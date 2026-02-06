import logging
from string import Template

from app.constants import ALL, messages
from app.core import BaseService, feature
from app.shared import mail
from app.signals import project_status_changed
from app.utils import get_all_parents_dict
from flask import request
from flask_jwt_extended import get_jwt_identity
from flask_mail import Message

from ..user_role import UserRoleService
from .model import Notification
from .resource import NotificationList, NotificationView
from .schema import NotificationSchema
from .template import NOTIFICATION_TEMPLATE


class NotificationService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Notification
        self.schema = NotificationSchema
        self.resources = [
            {'resource': NotificationList, 'url': '/notifications'},
            {'resource': NotificationView, 'url': '/notifications/<int:record_id>'}
        ]

    def get_one(self, record_id):
        return self.update(record_id, data={'is_unread': False}, partial=True)

    def send_notification(self, recipient_id, project_id, project_status):
        user = get_jwt_identity()
        # Handle both integer (user ID) and dict user types
        user_id = None
        if isinstance(user, int):
            user_id = user
        elif isinstance(user, dict):
            user_id = user.get('id') or user.get('original_id')
        
        if user_id is not None and user_id == recipient_id:
            return
        data = {
            'recipient_id': recipient_id,
            'project_id': project_id,
            'project_status': project_status
        }
        record = self.create(data)
        if feature.is_active('send_notification_by_email'):
            self._send_notification_email(record)
        return record

    def _send_notification_email(self, record):
        project_link = '%s#/projects/%s/show/' % (
            request.referrer, str(record['project_id']))
        msg = Message('Your have a new notification',
                      recipients=[record['recipient']['email']])
        msg.html = Template(NOTIFICATION_TEMPLATE).safe_substitute(
            full_name=record['recipient']['full_name'],
            project_title=record['project']['name'],
            project_status=record['project_status'],
            sender_full_name=record['sender']['full_name'],
            project_link=project_link
        )
        try:
            mail.send(msg)
        except:
            logging.error(
                f'{messages.EMAIL_NOT_SENT} - {record["recipient"]["email"]} for user id: {record["recipient_id"]}')


@project_status_changed.connect
def find_recipient(sender, project, workflow, **kwargs):
    from ..user.model import User
    import sys
    
    sys.stdout.write("=" * 80 + "\n")
    sys.stdout.write("[NOTIFICATION] project_status_changed signal received\n")
    sys.stdout.write("=" * 80 + "\n")
    sys.stdout.flush()
    print("=" * 80)
    print("[NOTIFICATION] project_status_changed signal received")
    print("=" * 80)
    logging.info("=" * 80)
    logging.info("[NOTIFICATION] project_status_changed signal received")
    logging.info("=" * 80)
    
    project_id = project.get('id')
    
    # Log the project structure for debugging
    print(f"[NOTIFICATION] Project type: {type(project)}")
    sys.stdout.flush()
    logging.info(f"[NOTIFICATION] Project type: {type(project)}")
    if isinstance(project, dict):
        print(f"[NOTIFICATION] Project dict keys: {list(project.keys())[:20]}")
        print(f"[NOTIFICATION] Project dict has 'organization_id': {'organization_id' in project}")
        sys.stdout.flush()
        logging.info(f"[NOTIFICATION] Project dict keys: {list(project.keys())[:20]}")  # First 20 keys
        logging.info(f"[NOTIFICATION] Project dict has 'organization_id': {'organization_id' in project}")
        if 'organization_id' in project:
            print(f"[NOTIFICATION] Project dict organization_id value: {project.get('organization_id')}")
            sys.stdout.flush()
            logging.info(f"[NOTIFICATION] Project dict organization_id value: {project.get('organization_id')}")
    
    # Get organization_id - handle both dict and object formats
    project_organization_id = project.get('organization_id')
    if not project_organization_id:
        logging.warning(f"[NOTIFICATION] Project {project_id} has no top-level organization_id, trying nested objects...")
        # Try to get from nested organization object if present
        project_org = project.get('project_organization') or project.get('organization')
        if project_org:
            if isinstance(project_org, dict):
                project_organization_id = project_org.get('id')
                logging.info(f"[NOTIFICATION] Got organization_id from project_organization dict: {project_organization_id}")
            elif hasattr(project_org, 'id'):
                project_organization_id = project_org.id
                logging.info(f"[NOTIFICATION] Got organization_id from project_organization object: {project_organization_id}")
        else:
            logging.warning(f"[NOTIFICATION] Project {project_id} has no project_organization or organization object")
    else:
        logging.info(f"[NOTIFICATION] Got organization_id from top-level: {project_organization_id}")
    
    workflow_role_id = workflow.get('role_id')
    
    # Log the project details for debugging
    print(f"[NOTIFICATION] Project ID: {project_id}")
    print(f"[NOTIFICATION] Project Organization ID: {project_organization_id}")
    print(f"[NOTIFICATION] Target Role ID: {workflow_role_id}")
    print(f"[NOTIFICATION] Project Status: {project.get('project_status')}")
    sys.stdout.flush()
    logging.info(f"[NOTIFICATION] Project ID: {project_id}")
    logging.info(f"[NOTIFICATION] Project Organization ID: {project_organization_id}")
    logging.info(f"[NOTIFICATION] Target Role ID: {workflow_role_id}")
    logging.info(f"[NOTIFICATION] Project Status: {project.get('project_status')}")
    
    # Validate that project has an organization_id
    if not project_organization_id:
        print(f"[NOTIFICATION] Project {project_id} has no organization_id. Skipping notifications.")
        sys.stdout.flush()
        logging.warning(f"[NOTIFICATION] Project {project_id} has no organization_id. Skipping notifications.")
        return
    
    user_role_service = UserRoleService()
    user_roles = user_role_service.get_all(
        filters={'role_id': workflow_role_id})
    
    print(f"[NOTIFICATION] Found {len(user_roles)} user(s) with role_id {workflow_role_id}")
    sys.stdout.flush()
    logging.info(f"[NOTIFICATION] Found {len(user_roles)} user(s) with role_id {workflow_role_id}")
    
    notifications_sent = 0
    notifications_skipped = 0
    
    for user_role in user_roles:
        # Get the user's actual organization_id from the user record
        user_id = user_role.get('user_id')
        if not user_id:
            logging.debug(f"[NOTIFICATION] Skipping user_role {user_role.get('id')} - no user_id")
            notifications_skipped += 1
            continue
            
        user_organization_id = None
        try:
            user_record = User.query.get(user_id)
            if user_record:
                user_organization_id = user_record.organization_id
                user_name = user_record.full_name or user_record.username
            else:
                user_name = f"User ID {user_id}"
                logging.warning(f"[NOTIFICATION] User {user_id} not found in database")
        except Exception as e:
            logging.error(f"[NOTIFICATION] Error fetching user {user_id} organization: {e}")
            notifications_skipped += 1
            continue
        
        # STRICT MATCH: Only send notification if user is in the EXACT SAME organization (department) as the project
        # This ensures projects from Organization A, Department A1 only go to users in Organization A, Department A1
        if user_organization_id and project_organization_id:
            if user_organization_id == project_organization_id:
                # Exact match - send notification
                print(f"[NOTIFICATION] [OK] Sending notification to User {user_id} ({user_name}) - Organization match: {user_organization_id} == {project_organization_id}")
                sys.stdout.flush()
                logging.info(f"[NOTIFICATION] [OK] Sending notification to User {user_id} ({user_name}) - Organization match: {user_organization_id} == {project_organization_id}")
                NotificationService().send_notification(
                    user_role['user_id'], project['id'], project['project_status'])
                notifications_sent += 1
            else:
                # User is in different organization/department - skip notification
                print(f"[NOTIFICATION] [SKIP] Skipping User {user_id} ({user_name}) - Organization mismatch: {user_organization_id} != {project_organization_id}")
                sys.stdout.flush()
                logging.info(f"[NOTIFICATION] [SKIP] Skipping User {user_id} ({user_name}) - Organization mismatch: {user_organization_id} != {project_organization_id}")
                notifications_skipped += 1
                continue
        else:
            # Missing organization_id - skip for safety (prevents cross-organization notifications)
            if not user_organization_id:
                logging.warning(f"[NOTIFICATION] [SKIP] Skipping User {user_id} - has no organization_id")
            if not project_organization_id:
                logging.warning(f"[NOTIFICATION] [SKIP] Skipping - Project {project_id} has no organization_id")
            notifications_skipped += 1
            continue
    
    print(f"[NOTIFICATION] Summary for Project {project_id}: {notifications_sent} sent, {notifications_skipped} skipped")
    sys.stdout.flush()
    logging.info(f"[NOTIFICATION] Summary for Project {project_id}: {notifications_sent} sent, {notifications_skipped} skipped")
    
    # Also notify project creator (if they're in the same organization)
    creator_id = project.get('created_by')
    if creator_id and project_organization_id:
        try:
            creator = User.query.get(creator_id)
            if creator and creator.organization_id == project_organization_id:
                print(f"[NOTIFICATION] [OK] Sending notification to project creator {creator_id}")
                sys.stdout.flush()
                logging.info(f"[NOTIFICATION] [OK] Sending notification to project creator {creator_id}")
                NotificationService().send_notification(
                    creator_id, project['id'], project['project_status'])
            else:
                if creator:
                    print(f"[NOTIFICATION] [SKIP] Project creator {creator_id} is in different organization ({creator.organization_id} != {project_organization_id})")
                    sys.stdout.flush()
                    logging.info(f"[NOTIFICATION] [SKIP] Project creator {creator_id} is in different organization ({creator.organization_id} != {project_organization_id})")
                else:
                    print(f"[NOTIFICATION] Project creator {creator_id} not found")
                    sys.stdout.flush()
                    logging.warning(f"[NOTIFICATION] Project creator {creator_id} not found")
        except Exception as e:
            print(f"[NOTIFICATION] Error sending notification to project creator: {e}")
            sys.stdout.flush()
            logging.error(f"[NOTIFICATION] Error sending notification to project creator: {e}")
    
    print("=" * 80)
    print(f"[NOTIFICATION] Notification processing completed for Project {project_id}")
    print("=" * 80)
    sys.stdout.flush()
    logging.info("=" * 80)
    logging.info(f"[NOTIFICATION] Notification processing completed for Project {project_id}")
    logging.info("=" * 80)