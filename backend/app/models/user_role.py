"""
app/models/user_role.py
───────────────────────
SQLAlchemy model for the `user_roles` junction table.
Authoritative source: V1 ERD (Identity & RBAC).
"""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.role import Role
    from app.models.user import User


class UserRole(Base):
    """Junction entity associating Users and Roles with an assignment timestamp."""

    __tablename__ = "user_roles"

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    role_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    )
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Optional viewonly relationships for direct junction queries
    user: Mapped["User"] = relationship("User", viewonly=True)
    role: Mapped["Role"] = relationship("Role", viewonly=True)
