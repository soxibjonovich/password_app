import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ..models import User
from ..schemas.user import UserCreate, UserUpdate
from ..core.security import hash_password, verify_password


async def get_user(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_secret(db: AsyncSession, secret: str) -> User | None:
    result = await db.execute(select(User).where(User.secret == secret))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    """Authenticate user with email and password"""
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def authenticate_user_secret(db: AsyncSession, secret: str) -> User | None:
    """Authenticate user with email and password"""
    user = await get_user_by_secret(db, secret)
    if not user:
        return None
    if not secret == user.secret:
        return None
    return user

async def get_user_with_passwords(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(
        select(User)
        .options(selectinload(User.passwords))
        .where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def get_user_with_passwords_by_secret(db: AsyncSession, secret: str) -> User | None:
    result = await db.execute(
        select(User)
        .options(selectinload(User.passwords))
        .where(User.secret == secret)
    )
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, user: UserCreate) -> User:
    hashed_password = hash_password(user.password)
    db_user = User(
        secret=uuid.uuid4().hex,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def update_user(db: AsyncSession, user_id: int, user: UserUpdate) -> User | None:
    db_user = await get_user(db, user_id)
    if not db_user:
        return None

    update_data = user.model_dump(exclude_unset=True)

    # Hash password if provided
    if "password" in update_data:
        update_data["hashed_password"] = hash_password(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(db_user, field, value)

    await db.commit()
    await db.refresh(db_user)
    return db_user


async def delete_user(db: AsyncSession, user_id: int) -> bool:
    db_user = await get_user(db, user_id)
    if not db_user:
        return False

    await db.delete(db_user)
    await db.commit()
    return True