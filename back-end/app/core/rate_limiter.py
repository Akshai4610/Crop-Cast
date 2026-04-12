import time
import os
from fastapi import HTTPException

# in-memory store (can upgrade to Redis later)
login_attempts = {}

MAX_ATTEMPTS = int(os.getenv("LOGIN_RATE_LIMIT", 5))
WINDOW = int(os.getenv("LOGIN_RATE_WINDOW", 60))


def check_rate_limit(identifier: str):
    now = time.time()

    if identifier not in login_attempts:
        login_attempts[identifier] = []

    # remove old attempts
    login_attempts[identifier] = [
        t for t in login_attempts[identifier]
        if now - t < WINDOW
    ]

    if len(login_attempts[identifier]) >= MAX_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Try again later."
        )

    login_attempts[identifier].append(now)