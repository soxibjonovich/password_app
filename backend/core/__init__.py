from fastapi import FastAPI
from .routers import auth
from .routers import auth, passwords

app = FastAPI(title="Local Password Application", version="0.0.1")

app.include_router(passwords.password_router, tags=["Password"])
app.include_router(auth.auth_router)
