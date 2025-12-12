from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///database.db"
    DATABASE_ECHO: bool = False
    SECRET_KEY: str = "idk-bro-if-you-are-reading-this-you-are-damn))"
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"


settings = Settings()
