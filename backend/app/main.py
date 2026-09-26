"""
app/main.py
───────────
FastAPI application entry point.

Creates the FastAPI app instance, registers routes, and exposes the
development API documentation (Swagger UI at /docs, ReDoc at /redoc).

Phase 2 domain routers will be imported and included here under /api/v1/.
"""

from fastapi import FastAPI

from app.core.config import get_settings

settings = get_settings()

# ── Application instance ──────────────────────────────────────────────────────
app = FastAPI(
    title="Intern Project Management Platform API",
    description=(
        "Organization-specific platform for managing intern projects "
        "and tracking performance."
    ),
    version="1.0.0",
    # Swagger UI and ReDoc are available in all environments for now.
    # Restrict to development only in a future phase if required.
    docs_url="/docs",
    redoc_url="/redoc",
)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Returns the operational status of the backend service.

    Used by Docker Compose, load balancers, and monitoring tools to
    verify that the API process is running.
    """
    return {"status": "ok"}


# ── Future: include domain routers here in Phase 2 ───────────────────────────
# from app.api.v1 import router as api_v1_router
# app.include_router(api_v1_router, prefix="/api/v1")
