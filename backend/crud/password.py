from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import Password
from ..schemas.password import PasswordCreate, PasswordUpdate
from ..core.security import encrypt_password, decrypt_password


async def get_password(db: AsyncSession, password_id: int) -> Password | None:
    result = await db.execute(select(Password).where(Password.id == password_id))
    return result.scalar_one_or_none()


async def get_user_passwords(db: AsyncSession, user_id: int) -> list[Password] | None:
    result = await db.execute(select(Password).where(Password.user_id == user_id))
    return list(result.scalars().all())


async def create_password(
    db: AsyncSession, password: PasswordCreate, user_id: int
) -> Password:
    # Encrypt the password before storing
    encrypted_pwd = encrypt_password(password.password)

    db_password = Password(
        user_id=user_id,
        title=password.title,
        logo=password.logo,
        email=password.email,
        username=password.username,
        encrypted_password=encrypted_pwd,
        fa_code=password.fa_code,
    )
    db.add(db_password)
    await db.commit()
    await db.refresh(db_password)
    return db_password


async def update_password(
    db: AsyncSession, password_id: int, password: PasswordUpdate, user_id: int
) -> Password | None:
    db_password = await get_password(db, password_id)
    if not db_password or db_password.user_id != user_id:
        return None

    update_data = password.model_dump(exclude_unset=True)

    # Encrypt password if provided
    if "password" in update_data:
        update_data["encrypted_password"] = encrypt_password(
            update_data.pop("password")
        )

    for field, value in update_data.items():
        setattr(db_password, field, value)

    await db.commit()
    await db.refresh(db_password)
    return db_password


async def delete_password(db: AsyncSession, password_id: int, user_id: int) -> bool:
    db_password = await get_password(db, password_id)
    if not db_password or db_password.user_id != user_id:
        return False

    await db.delete(db_password)
    await db.commit()
    return True


def decrypt_password_for_response(password: Password) -> dict:
    """Decrypt password and return as dict for response"""
    return {
        "id": password.id,
        "user_id": password.user_id,
        "title": password.title,
        "logo": password.logo,
        "email": password.email,
        "username": password.username,
        "password": decrypt_password(password.encrypted_password),  # Decrypt here
        "fa_code": password.fa_code,
        "created_at": password.created_at,
    }
