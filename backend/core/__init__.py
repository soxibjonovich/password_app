from fastapi import FastAPI
from .routers import auth

app = FastAPI(
    title="Local Password Application",
    version="0.0.1",
)

app.include_router(auth.auth_router)
