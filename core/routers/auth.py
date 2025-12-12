import uuid
from fastapi import APIRouter
from .models import RegisterNewDevice
from core.config import USERS

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@auth_router.get("/register")
async def request_new_device():
	return {
	    "status": 200,
		"data": str(uuid.uuid4())
	}
	

@auth_router.post("")
async def register_new_device(data: RegisterNewDevice):
	...