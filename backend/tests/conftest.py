"""
tests/conftest.py
─────────────────
Shared pytest fixtures for the backend test suite.

The `client` fixture provides a synchronous ASGI test client backed by
the real FastAPI application. Tests do not need to spin up a live server
or a real database to exercise the API layer.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    """Return a TestClient wrapping the FastAPI application.

    `scope="session"` means the app is instantiated once per test session,
    which keeps test runs fast. Expand to `scope="function"` if individual
    tests need to override app state (e.g. dependency overrides).
    """
    with TestClient(app) as test_client:
        yield test_client
