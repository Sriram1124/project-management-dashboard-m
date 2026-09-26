"""
alembic/env.py
──────────────
Alembic migration environment.

This file is executed by every Alembic command (e.g. `alembic upgrade head`).
It configures the database connection and supplies SQLAlchemy metadata so
Alembic can detect model changes for autogenerate.

Phase 1 notes:
  - No migration files exist yet.
  - Base.metadata is imported so autogenerate is ready for Phase 2.
  - The DATABASE_URL is read exclusively from the environment; it is never
    hardcoded or read from alembic.ini.
"""

import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# ── Alembic Config object (wraps alembic.ini) ─────────────────────────────────
config = context.config

# Configure Python logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ── Override sqlalchemy.url from the environment ──────────────────────────────
# This ensures credentials never appear in alembic.ini (which is committed).
database_url = os.environ.get("DATABASE_URL")
if not database_url:
    raise RuntimeError(
        "DATABASE_URL environment variable is not set. "
        "Copy backend/.env.example to backend/.env and fill in your credentials."
    )
config.set_main_option("sqlalchemy.url", database_url)

# ── Import Base so autogenerate can detect model changes ──────────────────────
# Phase 2 models inherit from Base; importing them here registers their
# Table objects in Base.metadata automatically.
from app.core.database import Base  # noqa: E402
import app.models  # noqa: F401, E402

target_metadata = Base.metadata


# ── Migration runners ─────────────────────────────────────────────────────────

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    In offline mode Alembic emits SQL to stdout / a file instead of
    connecting to a live database. Useful for generating SQL scripts to
    review before applying.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (default).

    In online mode Alembic connects to the live database and applies
    migrations within a transaction.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # Single-use connection; safe for migration runs
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
