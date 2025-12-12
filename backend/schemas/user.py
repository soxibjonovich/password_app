from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UserBase(BaseModel):
    secret: str
    username: str | None = None
    full_name: str | None = None


class UserCreate(UserBase):
    password: str  # Plain text password (will be hashed)


class UserLogin(BaseModel):
    secret: str
    password: str


class UserUpdate(BaseModel):
    username: str | None = None
    full_name: str | None = None
    password: str | None = None  # If provided, will update password


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserWithPasswordsResponse(UserResponse):
    passwords: list['PasswordResponse'] = []


class GetUserBySecret(BaseModel):
    secret: str
    password: str  # Master password required to decrypt passwords
