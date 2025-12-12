from http.client import HTTPException

from fastapi import APIRouter

from .models import GetUserPasswods, User
from ..config import USERS

password_router = APIRouter(
    prefix="/password",
    tags=["Password"],
)

password_router.get("/", response_model=GetUserPasswods)
async def get_user_passwords(data: GetUserPasswods) -> User | None:
    for user in USERS:
        if user.secret == data.secret:
            return user


    # return HTTPException()
