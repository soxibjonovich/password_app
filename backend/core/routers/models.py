from pydantic import BaseModel
from datetime import datetime


class RegisterNewDevice(BaseModel):
    secret: str


class Password(BaseModel):
    title: str
    logo: str | None
    email: str
    username: str | None
    password: str
    fa_code: str | None


class User(BaseModel):
    secret: str
    username: str | None
    full_name: str | None
    passwords: list[Password]
    created_at: datetime = datetime.now()


class GetUserPasswods(BaseModel):
    secret: str
