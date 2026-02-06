from datetime import date, datetime

from app.core import BaseService
from app.signals import user_created, user_updated

from ..organization import OrganizationService
from .model import UserRole
from .resource import UserRoleList, UserRoleView
from .schema import UserRoleSchema


class UserRoleService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = UserRole
        self.schema = UserRoleSchema
        self.resources = [
            {'resource': UserRoleList, 'url': '/user-roles'},
            {'resource': UserRoleView, 'url': '/user-roles/<int:record_id>'}
        ]

    def update(self, record_id, data, partial=False):
        record = super().update(record_id, data, partial=partial)
        if record['is_delegated'] and record['is_approved']:
            original_user_role = self.get_all(
                filters={'user_id': record['delegated_by'],
                         'role_id': record['role_id']})
            delegator = {
                'start_date': record['start_date'],
                'end_date': record['end_date'],
                'is_delegator': True,
                'is_delegated': False
            }
            if original_user_role:
                self.update(original_user_role[0]
                            ['id'], delegator, partial=True)
        return record

    def manage_user_roles(self, user_roles, user_id, delete=False):
        import logging
        logger = logging.getLogger(__name__)
        try:
            logger.info(f"manage_user_roles called with {len(user_roles)} roles for user {user_id}, delete={delete}")
            
            if delete:
                ids = []
                for record in user_roles:
                    if 'id' in record:
                        ids.append(record['id'])
                filter = {"not_ids": ids, "user_id": user_id}
                logger.info(f"Deleting user roles with filter: {filter}")
                self.delete_many(filter)

            for index, user_role in enumerate(user_roles):
                logger.info(f"Processing user_role {index}: {user_role}")
                # Create a copy to avoid modifying the original
                role_data = dict(user_role)
                role_data["user_id"] = user_id
                role_data["is_delegated"] = False
                role_data["is_delegator"] = False
                role_data["is_approved"] = True
                
                logger.info(f"Role data to save: {role_data}")
                
                if "id" in role_data:
                    logger.info(f"Updating existing user_role with id: {role_data['id']}")
                    self.update(role_data["id"], role_data)
                else:
                    logger.info(f"Creating new user_role")
                    result = self.create(role_data)
                    logger.info(f"User role created successfully: {result}")
            
            logger.info(f"Successfully processed all user roles for user {user_id}")
        except Exception as e:
            logger.error(f"Error in manage_user_roles: {str(e)}", exc_info=True)
            raise

    def reset_delegator(self, role_id, user_id):
        user_roles = self.get_all(
            filters={'role_id': role_id, 'user_id': user_id})
        if user_roles:
            record = user_roles[0]
            today = date.today()
            if record['is_delegator']:
                end_date = datetime.strptime(
                    record['end_date'], '%Y-%m-%d').date()
                if end_date < today:
                    self.update(record['id'], data={
                        'is_delegator': False}, partial=True)
        return True


@user_created.connect
def create_user_roles(sender, user, **kwargs):
    import logging
    logger = logging.getLogger(__name__)
    try:
        logger.info(f"create_user_roles signal received for user {user.id}")
        user_roles = kwargs.get("user_roles", None)
        logger.info(f"user_roles from kwargs: {user_roles}")
        if user_roles is not None:
            service = UserRoleService()
            logger.info(f"Calling manage_user_roles with {len(user_roles)} roles")
            service.manage_user_roles(user_roles, user.id)
            logger.info(f"Successfully created user roles for user {user.id}")
        else:
            logger.info(f"No user_roles found in kwargs for user {user.id}")
    except Exception as e:
        logger.error(f"Error in create_user_roles signal handler: {str(e)}", exc_info=True)
        raise


@user_updated.connect
def update_user_roles(sender, user, **kwargs):
    import logging
    logger = logging.getLogger(__name__)
    try:
        logger.info(f"update_user_roles signal received for user {user.id}")
        user_roles = kwargs.get("user_roles", None)
        if user_roles is not None:
            service = UserRoleService()
            service.manage_user_roles(user_roles, user.id, delete=True)
            logger.info(f"Successfully updated user roles for user {user.id}")
    except Exception as e:
        logger.error(f"Error in update_user_roles signal handler: {str(e)}", exc_info=True)
        raise
