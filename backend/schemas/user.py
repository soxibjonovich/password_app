from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UserBase(BaseModel):
    username: str | None = None
    full_name: str | None = None

class User(UserBase):
    email: str
    secret: str

    model_config = ConfigDict(from_attributes=True)

class UserCreate(UserBase):
    email: str
    password: str  # Plain text password (will be hashed)


class UserLogin(BaseModel):
    email: str
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
