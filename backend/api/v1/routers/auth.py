import uuid

from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.v1.deps import get_db
from backend.schemas import user as user_schema
from backend.crud import user as user_crud

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@auth_router.post("")
async def login(
        credentials: user_schema.UserLogin,
        db: AsyncSession = Depends(get_db),
):
    """Log user in"""
    user = await user_crud.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect secret or password"
        )
    return user_schema.User.model_validate(user)
@auth_router.post("/logout")
async def logout():
    ...


@auth_router.post("/register", response_model=user_schema.UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: user_schema.UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user with secret and master password"""
    db_user = await user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this secret already exists"
        )
    return await user_crud.create_user(db=db, user=user)