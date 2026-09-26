"""
app/core/database.py
────────────────────
SQLAlchemy 2.x synchronous database infrastructure.

Provides:
  - engine       : SQLAlchemy Engine connected to PostgreSQL
  - SessionLocal : Session factory used to create DB sessions
  - Base         : Declarative base class for all ORM models
  - get_db       : FastAPI dependency that yields a scoped Session

Phase 2 domain models must import `Base` from this module so that
Alembic's autogenerate can discover them via `Base.metadata`.

NOTE: Base.metadata.create_all() is intentionally NOT called here.
      Alembic is the sole database schema management mechanism.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


# ── Engine ────────────────────────────────────────────────────────────────────
engine = create_engine(
    settings.database_url,
    # Pool settings suited for a containerised backend.
    # Adjust pool_size / max_overflow in production based on expected load.
    pool_pre_ping=True,   # Discard stale connections before use
    pool_size=5,
    max_overflow=10,
    echo=settings.app_env == "development",  # Log SQL only in dev
)


# ── Session factory ───────────────────────────────────────────────────────────
SessionLocal: sessionmaker[Session] = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# ── Declarative base ──────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models.

    Phase 2 models inherit from this class:

        from app.core.database import Base

        class User(Base):
            __tablename__ = "users"
            ...
    """


# ── FastAPI dependency ────────────────────────────────────────────────────────
def get_db() -> Generator[Session, None, None]:
    """Yield a database session and guarantee its closure.

    Usage in a route:

        from fastapi import Depends
        from sqlalchemy.orm import Session
        from app.core.database import get_db

        @router.get("/example")
        def example(db: Session = Depends(get_db)):
            ...

    The session is passed down through the service → repository layers via
    dependency injection; it is never created inside a repository directly.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
