from sqlalchemy.sql import expression
from sqlalchemy import or_

from app.core import BaseModel
from app.core.cerberus import has_permission
from app.constants import FULL_ACCESS
from app.shared import db
from flask_jwt_extended import get_jwt_identity


class Role(BaseModel):
    __tablename__ = 'role'
    _has_archive = True

    name = db.Column(db.String(255), nullable=False)
    organization_level = db.Column(db.SmallInteger, nullable=True)
    has_allowed_projects = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    permissions = db.Column(db.JSON(), nullable=True)
    phase_ids = db.Column(db.JSON(), nullable=False)

    role_users = db.relationship('UserRole', back_populates='role',
                                 lazy=True, uselist=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    @classmethod
    def find_by_role(cls, role):
        return cls.query.filter_by(name=role).first()

    def get_access_clauses(self):
        """Filter roles based on user's current role and permissions."""
        if has_permission(FULL_ACCESS):
            # Return empty or_() which means no filtering (show all)
            return or_()
        
        try:
            user = get_jwt_identity()
        except Exception:
            user = None
        
        if user is None:
            # No user logged in - return a clause that matches nothing
            return self.id == -1
        
        role = user.get("current_role")
        if not role:
            # User has no current role - return a clause that matches nothing
            return self.id == -1
        
        # Get user's role IDs (roles they currently have)
        from app.rest.v1.user_role.model import UserRole
        user_roles = UserRole.query.filter_by(
            user_id=user['id'],
            is_approved=True
        ).all()
        user_role_ids = [ur.role_id for ur in user_roles] if user_roles else []
        
        # Also include the current role if it exists (even if not in approved list)
        current_role_id = role.get('role_id')
        if current_role_id and current_role_id not in user_role_ids:
            user_role_ids.append(current_role_id)
        
        # Build access clauses
        clause_list = []
        
        # 1. Users can always see roles they currently have
        if user_role_ids:
            clause_list.append(self.id.in_(user_role_ids))
        
        # 2. Roles at their organization level or below (if organization_level is set)
        if role.get('role') and role['role'].get('organization_level') is not None:
            user_org_level = role['role']['organization_level']
            # Users can see roles at their level or below (higher number = lower level)
            # Also include roles without org level set (for backward compatibility)
            clause_list.append(
                or_(
                    self.organization_level >= user_org_level,
                    self.organization_level.is_(None)
                )
            )
        # If user's role doesn't have org level, don't add org level restriction
        # This allows backward compatibility when org level feature is not used
        # Users will see all roles (unless restricted by other means)
        
        # If no clauses were added, show all roles (backward compatibility)
        # This handles cases where user has no approved roles and no org level restriction
        if not clause_list:
            # Return empty or_() which means no filtering (show all)
            # But only if they have list_roles permission (checked at resource level)
            return or_()
        
        # Combine all clauses with OR
        return or_(*clause_list)

    def get_access_filters(self, **kwargs):
        """Override to add role-based access control."""
        filter_list = super().get_access_filters(self, **kwargs)
        if has_permission(FULL_ACCESS):
            return filter_list
        clauses = self.get_access_clauses(self)
        # Add the access clauses
        # Empty or_() means no filtering (show all) - don't add it to avoid SQL errors
        if clauses is not None:
            # Check if it's an empty or_() by checking if it has clauses
            if hasattr(clauses, 'clauses') and len(clauses.clauses) == 0:
                # Empty or_() - don't add it (means show all)
                pass
            else:
                # Has clauses - add the filter
                filter_list.append(clauses)
        return filter_list
