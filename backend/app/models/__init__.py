"""
app/models/__init__.py
──────────────────────
Exposes all Phase 2A Identity & RBAC SQLAlchemy models.
Importing this package ensures that all models are registered in Base.metadata.
"""

from app.models.organization import Organization
from app.models.permission import Permission
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.user import User
from app.models.user_role import UserRole

__all__ = [
    "Organization",
    "User",
    "Role",
    "Permission",
    "UserRole",
    "RolePermission",
]
