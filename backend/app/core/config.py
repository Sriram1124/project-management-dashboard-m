"""
app/core/config.py
──────────────────
Centralised configuration via environment variables.

All settings are loaded once at import time through pydantic-settings.
Use the `get_settings()` dependency or import `settings` directly for
non-FastAPI contexts (e.g. Alembic env.py).
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings sourced exclusively from environment variables.

    No default value is provided for sensitive fields so that the application
    fails loudly at startup if a required variable is missing.
    """

    # ── Database ──────────────────────────────────────────────────────────────
    database_url: str  # e.g. postgresql://user:pass@host:5432/dbname

    # ── Application ───────────────────────────────────────────────────────────
    app_env: str = "development"

    # ── Security (placeholder — not used in Phase 1) ──────────────────────────
    secret_key: str = "change-this-to-a-long-random-secret-key"

    model_config = SettingsConfigDict(
        # Read from backend/.env when present; env vars always take precedence.
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # Ignore POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
    )


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance.

    Using @lru_cache means the .env file is parsed exactly once per process.
    In tests, call `get_settings.cache_clear()` before overriding env vars.
    """
    return Settings()


# Module-level singleton for non-DI contexts (e.g. alembic/env.py)
settings: Settings = get_settings()
