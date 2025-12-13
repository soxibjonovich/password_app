from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models import Password
from ..schemas.password import PasswordCreate, PasswordUpdate
from ..core.security import encrypt_password, decrypt_password

import pyotp
import urllib
import base64


async def verify_facode(fa_code: str) -> bool:
    """Проверяет валидность otpauth URI на первом этапе"""
    try:
        # Извлекаем секрет из URI
        uri = fa_code.strip()
        if uri.startswith('otpauth://totp/'):
            parsed = urllib.parse.urlparse(uri)
            params = urllib.parse.parse_qs(parsed.query)
            if 'secret' not in params:
                return False
            secret = params['secret'][0]
        else:
            secret = fa_code
        
        # Валидация Base32
        secret = secret.strip().upper()
        valid_chars = set('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567')
        cleaned = ''.join(c for c in secret if c in valid_chars)
        
        if len(cleaned) < 16 or len(cleaned) % 8 != 0:
            return False
        
        base64.b32decode(cleaned)  # Финальная проверка
        return True
        
    except Exception:
        return False

async def get_password(db: AsyncSession, password_id: int) -> Password | None:
    result = await db.execute(select(Password).where(Password.id == password_id))
    return result.scalar_one_or_none()


async def get_user_passwords(db: AsyncSession, user_id: int) -> list[Password] | None:
    result = await db.execute(select(Password).where(Password.user_id == user_id))
    return list(result.scalars().all())


async def create_password(
    db: AsyncSession, password: PasswordCreate, user_id: int
) -> Password | None:
    if not verify_facode(password.fa_code):
        return None
        
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


def extract_totp_secret(uri_or_secret: str) -> str:
    """Возвращает чистый Base32 секрет"""
    uri = uri_or_secret.strip()
    if uri.startswith('otpauth://totp/'):
        parsed = urllib.parse.urlparse(uri)
        params = urllib.parse.parse_qs(parsed.query)
        secret = params['secret'][0]
    else:
        secret = uri
    
    secret = secret.strip().upper()
    cleaned = ''.join(c for c in secret if c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567')
    if len(cleaned) < 16 or len(cleaned) % 8 != 0:
        raise ValueError(f"Invalid secret length: {len(cleaned)}")
    base64.b32decode(cleaned)
    return cleaned
    
async def update_password(
    db: AsyncSession, password_id: int, password: PasswordUpdate, user_id: int, fa_code: str | None = None
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

    # TOTP URI валидация + извлечение секрета
    if "fa_code" in update_data:
        fa_uri = update_data["fa_code"]
        
        # 1. Проверяем валидность URI
        if not verify_facode(fa_uri):
            raise ValueError("Invalid TOTP URI format")
        
        # 2. Извлекаем чистый секрет
        # clean_secret = extract_totp_secret(fa_uri)
        update_data["fa_code"] = fa_uri  # Сохраняем только Base32
        
        print(f"TOTP validated: {fa_uri[:50]}... → {fa_uri}")

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
