import json
from functools import wraps

from app.constants import ALL, FULL_ACCESS
from app.shared import db
from flask import current_app
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask_restful import abort


def has_permission(permission):
    """
    Check if the current user has the specified permission.
    Returns True if:
    - User has FULL_ACCESS permission
    - User's role has the specific permission
    - User's role has 'all' permissions
    """
    try:
        user = get_jwt_identity()
        if user is None:
            return False
        
        # Handle case where user is just an ID (backward compatibility)
        if isinstance(user, int):
            # If we only have user ID, we need to query the user's role
            from app.rest.v1.user.model import User
            user_record = User.query.get(user)
            if not user_record:
                return False
            # Get user's first approved role for permission check
            from app.rest.v1.user_role.model import UserRole
            user_role = UserRole.query.filter_by(
                user_id=user,
                is_approved=True
            ).first()
            if not user_role or not user_role.role:
                return False
            permissions = user_role.role.permissions or []
        else:
            # User is a dict with current_role information
            current_role = user.get("current_role")
            if not current_role:
                return False
            
            # Get permissions from current role
            # current_role can be a dict with 'role' nested object or flat
            if isinstance(current_role, dict):
                role_data = current_role.get('role', current_role)
                permissions = role_data.get('permissions', [])
            else:
                # If current_role is not a dict, try to get the role from DB
                from app.rest.v1.role.model import Role
                role_record = Role.query.get(current_role)
                if not role_record:
                    return False
                permissions = role_record.permissions or []
        
        # Check if user has the requested permission
        if not permissions:
            return False
        
        # Check for full access or 'all' permissions
        if FULL_ACCESS in permissions or ALL in permissions or 'all' in permissions:
            return True
        
        # Check for specific permission
        if permission in permissions:
            return True
        
        return False
        
    except Exception as e:
        # Log the error for debugging but don't expose it to the user
        print(f"Permission check error: {e}")
        import traceback
        traceback.print_exc()
        return False


def check_permission(permission):
    def _has_access(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            if has_permission(permission):
                return fn(*args, **kwargs)
            else:
                abort(403)
        return wrapper
    return _has_access
