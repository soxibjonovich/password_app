from passlib.context import CryptContext
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from .config import settings
import base64
import hashlib

# Password hashing context (for user passwords)
pwd_context = CryptContext(
    schemes=["argon2"],
    argon2__default_rounds=4,        # ~1 second on modern CPU
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)



def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


# Encryption for stored passwords
def get_fernet_key() -> bytes:
    """Derive a Fernet key from the SECRET_KEY"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=b"static_salt_change_in_production",  # Use unique salt per app
        iterations=100000,
        backend=default_backend()
    )
    key = base64.urlsafe_b64encode(kdf.derive(settings.SECRET_KEY.encode()))
    return key


_fernet = Fernet(get_fernet_key())


def encrypt_password(password: str) -> str:
    """Encrypt a password for storage (reversible)"""
    return _fernet.encrypt(password.encode()).decode()


def decrypt_password(encrypted_password: str) -> str:
    """Decrypt a stored password"""
    return _fernet.decrypt(encrypted_password.encode()).decode()
