from fastapi import APIRouter
from . import users, auth, passwords

api_router = APIRouter()
api_router.include_router(auth.auth_router)
api_router.include_router(passwords.password_router)
# api_router.include_router(users.)

__all__ = ["api_router"]