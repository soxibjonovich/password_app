import uuid
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from .models import RegisterNewDevice
from .config import USERS

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@auth_router.get("/register")
async def request_new_device():
    return {"status": 200, "data": str(uuid.uuid4())}


@auth_router.post("/register")
async def register_new_device(data: RegisterNewDevice):
    for user in USERS:
        if user.secret == data.secret:
            return HTTPException(status_code=400, detail="Device already registered")
