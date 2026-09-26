"""
tests/test_health.py
─────────────────────
Tests for the GET /health endpoint.

Verifies that:
  - The endpoint is reachable (HTTP 200).
  - The response body is exactly {"status": "ok"}.
"""

from fastapi.testclient import TestClient


def test_health_returns_200(client: TestClient) -> None:
    """Health endpoint must respond with HTTP 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_response_body(client: TestClient) -> None:
    """Health endpoint must return the expected JSON payload."""
    response = client.get("/health")
    assert response.json() == {"status": "ok"}
