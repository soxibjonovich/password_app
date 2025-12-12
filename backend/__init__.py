from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .core import init_db, close_db
from .api.v1.routers import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title="Password Manager API",
    description="Async Password Manager with SQLAlchemy and aiosqlite",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Password Manager API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}





# ============================================
# USAGE
# ============================================
# Run: uvicorn app.main:app --reload
#
# 1. Register a user:
# POST /api/v1/users/register
# {
#   "secret": "user123",
#   "username": "john",
#   "full_name": "John Doe",
#   "password": "mySecurePassword123"
# }
#
# 2. Login (verify credentials):
# POST /api/v1/users/login
# {
#   "secret": "user123",
#   "password": "mySecurePassword123"
# }
#
# 3. Create a password (encrypted):
# POST /api/v1/passwords?secret=user123&master_password=mySecurePassword123
# {
#   "title": "Gmail",
#   "email": "john@gmail.com",
#   "password": "gmailPassword456",
#   "username": "john_doe"
# }
#
# 4. Get all passwords (decrypted):
# POST /api/v1/passwords/get-all
# {
#   "secret": "user123",
#   "password": "mySecurePassword123"
# }
#
# 5. Get single password (decrypted):
# GET /api/v1/passwords/1?secret=user123&master_password=mySecurePassword123
#
# 6. Update password:
# PATCH /api/v1/passwords/1?secret=user123&master_password=mySecurePassword123
# {
#   "password": "newGmailPassword789"
# }
#
# 7. Delete password:
# DELETE /api/v1/passwords/1?secret=user123&master_password=mySecurePassword123
