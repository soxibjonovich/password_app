from pydantic import BaseModel, ConfigDict
from datetime import datetime


class PasswordBase(BaseModel):
    title: str
    logo: str | None = None
    email: str
    username: str | None = None
    password: str
    fa_code: str | None = None


class PasswordCreate(PasswordBase):
    pass


class PasswordUpdate(BaseModel):
    title: str | None = None
    logo: str | None = None
    email: str | None = None
    username: str | None = None
    password: str | None = None
    fa_code: str | None = None


class PasswordResponse(PasswordBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
