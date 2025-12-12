from fastapi import APIRouter, HTTPException
from .models import GetUserPasswords, User
from ..config import USERS

password_router = APIRouter(
    prefix="/password",
    tags=["Password"],
)


@password_router.post("", response_model=dict)
async def get_user_passwords(data: GetUserPasswords):
    for user in USERS:
        if user.secret == data.secret:
            return {"user": user.model_dump_json()}

    raise HTTPException(detail="Not found", status_code=404)