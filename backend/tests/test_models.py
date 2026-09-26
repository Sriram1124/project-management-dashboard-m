"""
tests/test_models.py
────────────────────
Non-destructive validation of Phase 2A Identity & RBAC SQLAlchemy models.
"""

from app.core.database import Base
from app.models import Organization, Permission, Role, RolePermission, User, UserRole


def test_metadata_tables_present() -> None:
    """Verify that exactly the six Phase 2A Identity & RBAC tables exist in metadata."""
    expected_tables = {
        "organizations",
        "users",
        "roles",
        "user_roles",
        "permissions",
        "role_permissions",
    }
    actual_tables = set(Base.metadata.tables.keys())
    assert actual_tables == expected_tables, (
        f"Expected {expected_tables}, got {actual_tables}"
    )


def test_organizations_table_structure() -> None:
    """Verify organizations table columns and primary key."""
    table = Base.metadata.tables["organizations"]
    assert [c.name for c in table.primary_key.columns] == ["id"]
    assert set(table.columns.keys()) == {"id", "name", "created_at", "updated_at"}


def test_users_table_structure_and_constraints() -> None:
    """Verify users table columns, foreign keys, and organization-scoped email uniqueness."""
    table = Base.metadata.tables["users"]
    assert [c.name for c in table.primary_key.columns] == ["id"]
    assert set(table.columns.keys()) == {
        "id",
        "organization_id",
        "name",
        "email",
        "password_hash",
        "is_active",
        "created_at",
        "updated_at",
    }

    # Foreign key check
    fks = [
        (elem.parent.name, elem.target_fullname)
        for fkc in table.foreign_key_constraints
        for elem in fkc.elements
    ]
    assert ("organization_id", "organizations.id") in fks

    # Unique constraint check: UNIQUE(organization_id, email)
    unique_col_sets = [
        set(col.name for col in uc.columns)
        for uc in table.constraints
        if hasattr(uc, "columns") and len(uc.columns) > 1
    ]
    assert {"organization_id", "email"} in unique_col_sets


def test_roles_table_structure() -> None:
    """Verify roles table columns and primary key."""
    table = Base.metadata.tables["roles"]
    assert [c.name for c in table.primary_key.columns] == ["id"]
    assert set(table.columns.keys()) == {"id", "name", "description", "created_at"}


def test_user_roles_table_structure() -> None:
    """Verify user_roles junction table composite primary key, columns, and foreign keys."""
    table = Base.metadata.tables["user_roles"]
    assert set(c.name for c in table.primary_key.columns) == {"user_id", "role_id"}
    assert set(table.columns.keys()) == {"user_id", "role_id", "assigned_at"}

    fks = [
        (elem.parent.name, elem.target_fullname)
        for fkc in table.foreign_key_constraints
        for elem in fkc.elements
    ]
    assert ("user_id", "users.id") in fks
    assert ("role_id", "roles.id") in fks


def test_permissions_table_structure() -> None:
    """Verify permissions table columns and primary key."""
    table = Base.metadata.tables["permissions"]
    assert [c.name for c in table.primary_key.columns] == ["id"]
    assert set(table.columns.keys()) == {"id", "name", "description"}


def test_role_permissions_table_structure() -> None:
    """Verify role_permissions junction table composite primary key and foreign keys."""
    table = Base.metadata.tables["role_permissions"]
    assert set(c.name for c in table.primary_key.columns) == {"role_id", "permission_id"}
    assert set(table.columns.keys()) == {"role_id", "permission_id"}

    fks = [
        (elem.parent.name, elem.target_fullname)
        for fkc in table.foreign_key_constraints
        for elem in fkc.elements
    ]
    assert ("role_id", "roles.id") in fks
    assert ("permission_id", "permissions.id") in fks
