from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.schemas import password as password_schema
from backend.schemas import user as user_schema
from backend.crud import password as password_crud
from backend.crud import user as user_crud
from ..deps import get_db

import pyotp
import time
from datetime import datetime

password_router = APIRouter(prefix="/passwords", tags=["Passwords"])


@password_router.post("/get-all", response_model=list[password_schema.PasswordResponse])
async def get_user_passwords(
    data: user_schema.GetUserBySecret, db: AsyncSession = Depends(get_db)
):
    """Get all passwords for a user (requires authentication)"""
    # Authenticate user
    user = await user_crud.authenticate_user_secret(db, data.secret)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect secret or password",
        )

    # Get passwords and decrypt them
    passwords = await password_crud.get_user_passwords(db, user_id=user.id)

    if not passwords:
        return []

    # Decrypt passwords for response
    decrypted_passwords = [
        password_crud.decrypt_password_for_response(pwd) for pwd in passwords
    ]

    return decrypted_passwords


@password_router.post(
    "",
    response_model=password_schema.PasswordResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_password(
    password: password_schema.PasswordCreate,
    secret: str = Query(..., description="User secret"),
    db: AsyncSession = Depends(get_db),
):
    """Create a new password entry (requires authentication)"""
    # Authenticate user
    user = await user_crud.authenticate_user_secret(db, secret)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect secret or password",
        )

    # Create encrypted password
    db_password = await password_crud.create_password(
        db=db, password=password, user_id=user.id
    )
    
    if not db_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid FA code",
        )

    # Return with decrypted password
    return password_crud.decrypt_password_for_response(db_password)


@password_router.get("/{password_id}", response_model=password_schema.PasswordResponse)
async def get_password(
    password_id: int,
    secret: str = Query(..., description="User secret"),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific password by ID (requires authentication)"""
    # Authenticate user
    user = await user_crud.authenticate_user_secret(db, secret)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect secret or password",
        )

    password = await password_crud.get_password(db, password_id=password_id)
    if not password or password.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Password not found"
        )

    # Return with decrypted password
    return password_crud.decrypt_password_for_response(password)


@password_router.patch(
    "/{password_id}", response_model=password_schema.PasswordResponse
)
async def update_password(
    password_id: int,
    password: password_schema.PasswordUpdate,
    secret: str = Query(..., description="User secret"),
    db: AsyncSession = Depends(get_db),
):
    """Update a password entry (requires authentication)"""
    # Authenticate user
    user = await user_crud.authenticate_user_secret(db, secret)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect secret or password",
        )

    db_password = await password_crud.update_password(
        db, password_id=password_id, password=password, user_id=user.id, fa_code=password.fa_code
    )
    if not db_password:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Password not found"
        )

    # Return with decrypted password
    return password_crud.decrypt_password_for_response(db_password)


@password_router.delete("/{password_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_password(
    password_id: int,
    secret: str = Query(..., description="User secret"),
    db: AsyncSession = Depends(get_db),
):
    """Delete a password entry (requires authentication)"""
    # Authenticate user
    user = await user_crud.authenticate_user_secret(db, secret)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect secret or password",
        )

    deleted = await password_crud.delete_password(
        db, password_id=password_id, user_id=user.id
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Password not found"
        )

@password_router.get("/user/totp/{secret}/{password_id}", status_code=status.HTTP_200_OK)
async def get_user_totop_code(
    secret: str,
    password_id: int,
    db: AsyncSession = Depends(get_db)
):
    user = await user_crud.authenticate_user_secret(db, secret)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect secret or password",
        )
    
    password = await password_crud.get_password(db, password_id)
    if not password:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Password not found"
        )
    
    if not password.fa_code:
        return {"code": 0}
    
    totp = pyotp.TOTP(password.fa_code)
    current_token = totp.now()
    time_remaining = 30 - (int(time.time() % 30))
    
    next_request_time = time_remaining * 1000
            
    return {
        "success": True,
        "user_id": user.user_id,
        "code": current_token,
        "time_remaining_seconds": time_remaining,
        "next_request_in_ms": next_request_time,
        "generated_at": datetime.now().isoformat()
    }
