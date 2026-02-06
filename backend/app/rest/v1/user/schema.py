from datetime import date

import app.rest.v1.user_role as user_role
from app.constants import AUTH_ROLE_FIELDS, messages
from app.core import BaseSchema
from marshmallow import fields, validate


class AuthSchema(BaseSchema):
    username = fields.Str(required=True, validate=validate.Length(max=50))
    password = fields.Str(required=True)


class UserSchema(BaseSchema):
    password_regexp = '^(?=.*[A-Z])(?=.*[!@#$&*%])(?=.*[0-9])(?=.*[a-z]).{8,}$'
    username = fields.Str(required=True, validate=validate.Length(max=50))
    password = fields.Str(required=False, load_only=True, validate=validate.Regexp(
        password_regexp, error=messages.PASSWORD_RULES))
    full_name = fields.Str(required=True, validate=validate.Length(max=255))
    email = fields.Email(required=True, validate=validate.Length(max=255))
    phone = fields.Str(
        required=False, validate=validate.Length(max=50), allow_none=True)
    last_login_time = fields.DateTime(required=False, dump_only=True)
    password_changed_on = fields.DateTime(required=False, dump_only=True)
    is_blocked = fields.Bool(allow_none=True)
    organization_id = fields.Int(required=False, allow_none=True)
    fund_id = fields.Int(required=False, allow_none=True)
    supervisor_id = fields.Int(required=False, allow_none=True)
    management_id = fields.Int(required=False, allow_none=True)

    # Completely disable user_roles and nested schemas to avoid JSON serialization issues
    # user_roles = fields.Method('get_user_roles')
    # organization = fields.Nested("OrganizationSchema", dump_only=True)
    # fund = fields.Nested("FundSchema", dump_only=True)
    # supervisor = fields.Nested(
    #     "UserSchema", dump_only=True, only=('username', 'full_name',))
    # fund = fields.Nested("ManagementSchema", dump_only=True)



class AuthUserSchema(BaseSchema):
    username = fields.Str(required=True, validate=validate.Length(max=50))
    full_name = fields.Str(required=True, validate=validate.Length(max=255))
    organization_id = fields.Int(required=False, allow_none=True)
    original_id = fields.Int(allow_none=True)
    
    # Remove problematic fields.Method to avoid JSON serialization issues
    # user_roles and current_role will be handled manually in the resource


def get_available_roles(obj):
    user_roles = []
    today = date.today()
    for item in obj.user_roles:
        if item.is_delegator == True:
            if item.start_date > today or item.end_date < today:
                user_roles.append(item)
        elif item.is_delegated == False:
            user_roles.append(item)
        elif (all(date is not None for date in [item.start_date, item.end_date])
              and item.start_date <= today and item.end_date >= today):
            user_roles.append(item)
    return user_roles
