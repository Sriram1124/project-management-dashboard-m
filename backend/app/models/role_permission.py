"""
app/models/role_permission.py
─────────────────────────────
SQLAlchemy model for the `role_permissions` junction table.
Authoritative source: V1 ERD (Identity & RBAC).
"""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.permission import Permission
    from app.models.role import Role


class RolePermission(Base):
    """Junction entity associating Roles and Permissions."""

    __tablename__ = "role_permissions"

    role_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    permission_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    )

    # Optional viewonly relationships for direct junction queries
    role: Mapped["Role"] = relationship("Role", viewonly=True)
    permission: Mapped["Permission"] = relationship("Permission", viewonly=True)
