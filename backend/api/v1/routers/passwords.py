from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.schemas import password as password_schema
from backend.schemas import user as user_schema
from backend.crud import password as password_crud
from backend.crud import user as user_crud
from ..deps import get_db

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
        db, password_id=password_id, password=password, user_id=user.id
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
