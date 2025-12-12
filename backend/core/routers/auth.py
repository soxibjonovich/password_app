import uuid
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from .models import RegisterNewDevice
from ..config import USERS

from io import BytesIO
import segno

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@auth_router.get("/register")
async def request_new_device():
    qr = segno.make("sdflhdskgjh", micro=False)
    buffer = BytesIO()
    qr.save(buffer, kind="svg", scale=16, border=0)
    svg_bytes = buffer.getvalue()

    svg_str = svg_bytes.decode("utf-8")
    return {"status": 200, "qr_code": svg_str}


@auth_router.post("/register")
async def register_new_device(data: RegisterNewDevice):
    for user in USERS:
        if user.secret == data.secret:
            return HTTPException(status_code=400, detail="Device already registered")
