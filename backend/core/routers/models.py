from pydantic import BaseModel, Field
from datetime import datetime


class RegisterNewDevice(BaseModel):
    secret: str


class Password(BaseModel):
    title: str
    logo: str | None = None
    email: str
    username: str | None = None
    password: str
    fa_code: str | None = None


class User(BaseModel):
    secret: str
    username: str | None = None
    full_name: str | None = None
    passwords: list[Password]
    created_at: datetime = Field(default_factory=datetime.now)


class GetUserPasswords(BaseModel):
    secret: str
