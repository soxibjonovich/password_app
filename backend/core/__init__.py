from fastapi import FastAPI
from .routers import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Local Password Application",
    version="0.0.1",
)

origins = [
    "http://localhost:3000",   # your frontend
    "http://127.0.0.1:3000",
    "http://localhost:5173",   # Vite
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # or ["*"] for all origins (not safe for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.auth_router)
