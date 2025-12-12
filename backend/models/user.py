from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    secret = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)  # User's master password (hashed)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship
    passwords = relationship("Password", back_populates="user", cascade="all, delete-orphan")

