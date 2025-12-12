from .routers.models import User

USERS: list[User] = [
    User(secret="ok", username="admin", full_name="ok@gmail.com", passwords=[]),
]
