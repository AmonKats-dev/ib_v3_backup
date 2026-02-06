from enum import Enum
import logging
import sys

from app.constants import ALL, FULL_ACCESS, SINGLE_RECORD, SORT_DESC, ProjectStatus, messages
from app.core import BaseModel, feature
from app.core.cerberus import has_permission
from app.shared import db
from app.utils import get_all_parents, get_children_ids
from flask_jwt_extended import get_jwt, get_jwt_identity
from flask_restful import abort
from sqlalchemy import and_, desc, event, func, not_, or_
from sqlalchemy.orm import foreign
from sqlalchemy.sql import expression, select

from ..function import FunctionService
from ..organization import OrganizationService
from ..organization.model import Organization as OrganizationModel
from ..phase import PhaseService
from ..program import ProgramService
from ..workflow import WorkflowService


class Project(BaseModel):
    __tablename__ = 'project'
    _has_archive = True
    _has_additional_data = True
    _archive_permission = 'access_deleted_project'

    code = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    project_type = db.Column(db.String(50), nullable=True)
    project_status = db.Column(
        db.Enum(ProjectStatus), nullable=False, default=ProjectStatus.DRAFT)
    phase_id = db.Column(db.Integer, db.ForeignKey(
        'phase.id'), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey(
        'organization.id'), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey(
        'program.id'), nullable=False)
    function_id = db.Column(
        db.Integer, db.ForeignKey('coa_function.id'), nullable=True)
    workflow_id = db.Column(db.Integer, db.ForeignKey(
        'workflow.id'), nullable=False, default=1)
    current_step = db.Column(db.SmallInteger, nullable=False)
    max_step = db.Column(db.SmallInteger, nullable=False)
    is_donor_funded = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    fund_ids = db.Column(db.String(255), nullable=True)
    revised_user_role_id = db.Column(db.Integer, db.ForeignKey(
        'user_role.id'), nullable=True)
    assigned_user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    submission_date = db.Column(db.DateTime, nullable=True)
    ndp_pip_code = db.Column(db.String(20), nullable=True)
    budget_code = db.Column(db.String(100), nullable=True)
    budget_allocation = db.Column(db.JSON(), nullable=True)
    myc_data = db.Column(db.JSON(), nullable=True)
    ranking_data = db.Column(db.JSON(), nullable=True)
    ranking_score = db.Column(db.SmallInteger, nullable=True)
    signed_date = db.Column(db.Date(), nullable=True)
    project_classification = db.Column(db.String(50), nullable=True)
    is_framework_updated = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)

    created_by = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', lazy=True, foreign_keys=created_by)

    phase = db.relationship('Phase', lazy=True)
    project_organization = db.relationship('Organization', lazy=True)
    program = db.relationship('Program', lazy=True)
    function = db.relationship('Function', lazy=True)
    workflow = db.relationship('Workflow', lazy=True)
    project_details = db.relationship('ProjectDetail', uselist=True, lazy=True)
    revised_user_role = db.relationship('UserRole', lazy=True)
    assigned_user = db.relationship(
        'User',  foreign_keys=assigned_user_id, lazy=True)
    project_management = db.relationship(
        'ProjectManagement', uselist=False, lazy=True)
    project_completion = db.relationship(
        'ProjectCompletion', uselist=False, lazy=True)
    def _get_project_detail_order_by():
        from ..project_detail.model import ProjectDetail
        return desc(ProjectDetail.id)
    
    def _get_timeline_order_by():
        from ..timeline.model import Timeline
        return desc(Timeline.id)
    
    current_project_detail = db.relationship(
        'ProjectDetail', 
        primaryjoin="and_(Project.id == foreign(ProjectDetail.project_id), foreign(ProjectDetail.phase_id) == Project.phase_id)", 
        lazy=True, 
        uselist=False, 
        overlaps="project_details",
        order_by=_get_project_detail_order_by,
        viewonly=True)
    current_timeline = db.relationship(
        'Timeline', 
        primaryjoin="and_(Project.id == foreign(Timeline.project_id), foreign(Timeline.phase_id) == Project.phase_id, foreign(Timeline.current_step) == Project.current_step)", 
        lazy=True,
        uselist=False,
        order_by=_get_timeline_order_by,
        viewonly=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        if filter.get('is_budgeted'):
            filter_list.append(self.budget_code != None)
        if filter.get('is_not_budgeted'):
            filter_list.append(self.budget_code == None)
        if filter.get('is_not_in_ndp'):
            filter_list.append(self.ndp_pip_code == None)
        if filter.get('budget_code'):
            filter_list.append(self.budget_code == filter.get('budget_code'))
        if filter.get('ndp_pip_code'):
            filter_list.append(self.ndp_pip_code == filter.get('ndp_pip_code'))
        if filter.get('project_status'):
            filter_list.append(self.project_status ==
                               filter.get('project_status'))
        if filter.get('phase_id'):
            filter_list.append(self.phase_id == filter.get('phase_id'))
        if filter.get('start_date'):
            filter_list.append(self.start_date >= filter.get('start_date'))
        if filter.get('end_date'):
            filter_list.append(self.end_date <= filter.get('end_date'))
        if filter.get('is_donor_funded'):
            filter_list.append(self.is_donor_funded ==
                               filter.get('is_donor_funded'))
        if filter.get('is_framework_updated'):
            filter_list.append(self.is_framework_updated ==
                               filter.get('is_framework_updated'))
        if filter.get('fund_id'):
            filter_list.append(func.find_in_set(
                filter.get('fund_id'), self.fund_ids))
        if filter.get('phase_ids'):
            filter_list.append(self.phase_id.in_(filter.get('phase_ids')))
        if filter.get('workflow_id'):
            filter_list.append(self.workflow_id == filter.get('workflow_id'))
        if filter.get('current_step'):
            filter_list.append(self.current_step == filter.get('current_step'))
        if filter.get('revised_user_role_id'):
            filter_list.append(self.revised_user_role_id ==
                               filter.get('revised_user_role_id'))
        # CRITICAL: For INCOMING requests, NEVER use organization_id expansion to prevent cross-organization access
        # The INCOMING-specific code below will add an exact organization match
        # Check for INCOMING in multiple ways to be safe
        is_incoming_action = False
        if filter.get('action'):
            action_val = filter.get('action')
            if (action_val == 'INCOMING' or 
                (isinstance(action_val, str) and action_val.upper() == 'INCOMING') or
                str(action_val).upper() == 'INCOMING'):
                is_incoming_action = True
                print(f"[INCOMING FILTER] INCOMING action detected - skipping organization expansion")
                logging.info(f"[INCOMING FILTER] INCOMING action detected - skipping organization expansion")
        
        if filter.get('organization_id') and not is_incoming_action:
            organization_ids = get_children_ids(
                OrganizationService().model.get_one(filter.get('organization_id')))
            filter_list.append(self.organization_id.in_(organization_ids))
        if filter.get('organization_ids') and not is_incoming_action:
            organization_ids = []
            for organization_id in filter.get('organization_ids'):
                organization_ids += get_children_ids(
                    OrganizationService().model.get_one(organization_id))
            filter_list.append(self.organization_id.in_(organization_ids))
        if filter.get('program_id'):
            program_ids = get_children_ids(
                ProgramService().model.get_one(filter.get('program_id')))
            filter_list.append(self.program_id.in_(program_ids))
        if filter.get('function_id'):
            # FunctionService.model uses Function model which maps to 'coa_function' table (not 'function' table)
            function_ids = get_children_ids(
                FunctionService().model.get_one(filter.get('function_id')))
            filter_list.append(self.function_id.in_(function_ids))
        if filter.get('action') and filter.get('action') == 'PENDING':
            workflow_service = WorkflowService()
            try:
                user = get_jwt_identity()
                user_id = None
                user_organization_id = None
                
                # Handle case where user is an integer (user ID) or a dictionary
                if isinstance(user, int):
                    user_id = user
                    # For integer user, fetch user's organization and role from database
                    from ..user.model import User
                    from ..user_role.model import UserRole
                    try:
                        user_record = User.query.get(user_id)
                        if user_record:
                            user_organization_id = user_record.organization_id
                            print(f"[PENDING FILTER] User {user_id} organization: {user_organization_id}")
                            
                        user_roles = UserRole.query.filter_by(
                            user_id=user_id,
                            is_approved=True
                        ).all()
                        if user_roles:
                            role_ids = [ur.role_id for ur in user_roles]
                            workflow_ids = []
                            for role_id in role_ids:
                                role_workflows = workflow_service.get_role_workflows(role_id)
                                workflow_ids.extend([w['id'] for w in role_workflows])
                            if workflow_ids:
                                workflow_ids = list(set(workflow_ids))
                                filter_list.append(self.workflow_id.in_(workflow_ids))
                                print(f"[PENDING FILTER] Added workflow filter for user {user_id}: {workflow_ids}")
                    except Exception as e:
                        print(f"[PENDING FILTER] Error getting workflows for user {user_id}: {e}")
                else:
                    # User is a dictionary
                    user_id = user.get('id') or user.get('original_id')
                    
                    # Get user's organization
                    if user_id:
                        from ..user.model import User
                        try:
                            user_record = User.query.get(user_id)
                            if user_record:
                                user_organization_id = user_record.organization_id
                                print(f"[PENDING FILTER] User {user_id} organization: {user_organization_id}")
                        except Exception as e:
                            print(f"[PENDING FILTER] Error getting user organization: {e}")
                    
                    role = user.get("current_role")
                    if role:
                        role_workflows = workflow_service.get_role_workflows(
                            role['role_id'])
                        workflow_ids = [workflow['id'] for workflow in role_workflows]
                        filter_list.append(self.workflow_id.in_(workflow_ids))
                        print(f"[PENDING FILTER] Added workflow filter from current_role: {workflow_ids}")
                
                # CRITICAL: Filter by organization - users should only see projects from their own organization
                # This prevents cross-organization access (same as INCOMING filter)
                if user_organization_id:
                    try:
                        user_org_id_int = int(user_organization_id)
                    except (ValueError, TypeError):
                        user_org_id_int = user_organization_id
                    filter_list.append(self.organization_id == user_org_id_int)
                    print(f"[PENDING FILTER] Added organization filter: organization_id == {user_org_id_int}")
                    logging.info(f"[PENDING FILTER] Added organization filter: organization_id == {user_org_id_int}")
                else:
                    # If we can't determine user's organization, return no results for safety
                    print(f"[PENDING FILTER] User {user_id} has no organization_id - returning no results for safety")
                    logging.warning(f"[PENDING FILTER] User {user_id} has no organization_id - returning no results for safety")
                    filter_list.append(self.id == -1)
                
                # NOTE: Users can have multiple roles, so they SHOULD see projects they created
                # when acting in a different role that has approval authority
                # Therefore, we do NOT filter by created_by
                print(f"[PENDING FILTER] Allowing projects from all users (including self) for user {user_id}")
                logging.info(f"[PENDING FILTER] Allowing projects from all users (including self) for user {user_id}")
                
                # Exclude REJECTED projects and DRAFT projects (PENDING should only show submitted/active projects)
                filter_list.append(self.project_status != ProjectStatus.REJECTED)
                filter_list.append(self.project_status != ProjectStatus.DRAFT)
                print(f"[PENDING FILTER] Excluding REJECTED and DRAFT projects")
                logging.info(f"[PENDING FILTER] Excluding REJECTED and DRAFT projects")
            except Exception as e:
                # If there's any error, just skip the workflow filtering
                print(f"[PENDING FILTER] Workflow filtering error: {e}")
                logging.error(f"[PENDING FILTER] Workflow filtering error: {e}")
                filter_list.append(self.project_status != ProjectStatus.REJECTED)
                filter_list.append(self.project_status != ProjectStatus.DRAFT)
        # CRITICAL: Check for INCOMING action - use robust detection
        is_incoming_in_get_filters = False
        if filter.get('action'):
            action_val = filter.get('action')
            if (action_val == 'INCOMING' or 
                (isinstance(action_val, str) and action_val.upper() == 'INCOMING') or
                str(action_val).upper() == 'INCOMING'):
                is_incoming_in_get_filters = True
                print(f"[INCOMING FILTER] ===== INCOMING DETECTED IN get_filters() =====")
                logging.info(f"[INCOMING FILTER] ===== INCOMING DETECTED IN get_filters() =====")
        
        # NOTE: Projects view should show ALL projects ever created in the system, regardless of status.
        # The "Incoming" view (action: "INCOMING") will show only projects waiting for action.
        # We no longer exclude INCOMING projects from the Projects view - they can appear in both.
        # This separation ensures:
        # - "Projects": Complete list of all projects (like a master registry)
        # - "Incoming": Only projects assigned to users waiting for action (like an incoming tray)
        
        if is_incoming_in_get_filters:
            workflow_service = WorkflowService()
            # Initialize user_id and user_organization_id early - BEFORE try block
            user_id = None
            user_organization_id = None
            
            try:
                user = get_jwt_identity()
                print(f"[INCOMING FILTER] Got user identity: {type(user)}, user={user}")
                logging.info(f"[INCOMING FILTER] Got user identity: {type(user)}")
                
                # Handle case where user is an integer (user ID) or a dictionary
                if isinstance(user, int):
                    # User is just an integer (user ID)
                    user_id = user
                    print(f"[INCOMING FILTER] User is integer: {user_id}")
                    # Try to get organization from database
                    from ..user.model import User
                    try:
                        user_record = User.query.get(user_id)
                        if user_record:
                            user_organization_id = user_record.organization_id
                            print(f"[INCOMING FILTER] Got org_id from DB: {user_organization_id}")
                            
                            # CRITICAL: Add organization filter for integer user
                            if user_organization_id:
                                try:
                                    user_org_id_int = int(user_organization_id)
                                except (ValueError, TypeError):
                                    user_org_id_int = user_organization_id
                                filter_list.append(self.organization_id == user_org_id_int)
                                print(f"[INCOMING FILTER] Added organization filter for integer user: {user_org_id_int}")
                                logging.info(f"[INCOMING FILTER] Added organization filter for integer user: {user_org_id_int}")
                                
                                # Get workflows for this user's role
                                # For INCOMING, we want projects currently at workflows assigned to this role
                                try:
                                    from ..user_role.model import UserRole
                                    # Get all approved user roles (user might have multiple roles)
                                    user_roles = UserRole.query.filter_by(
                                        user_id=user_id,
                                        is_approved=True
                                    ).all()
                                    
                                    # Also try to get current_role from JWT claims if available
                                    current_role_id = None
                                    try:
                                        # Try to get current_role from JWT claims
                                        jwt_claims = get_jwt()
                                        if jwt_claims:
                                            # JWT identity might be in 'sub' or 'identity' field
                                            jwt_identity = jwt_claims.get('sub') or jwt_claims.get('identity')
                                            if isinstance(jwt_identity, dict) and jwt_identity.get('current_role'):
                                                current_role_id = jwt_identity['current_role'].get('role_id')
                                                print(f"[INCOMING FILTER] Found current_role from JWT claims: {current_role_id}")
                                            # Also check if current_role is directly in claims
                                            elif jwt_claims.get('current_role'):
                                                current_role_id = jwt_claims['current_role'].get('role_id')
                                                print(f"[INCOMING FILTER] Found current_role directly in JWT claims: {current_role_id}")
                                        # Fallback: try get_jwt_identity() as dict
                                        jwt_user = get_jwt_identity()
                                        if isinstance(jwt_user, dict) and jwt_user.get('current_role'):
                                            current_role_id = jwt_user['current_role'].get('role_id')
                                            print(f"[INCOMING FILTER] Found current_role from get_jwt_identity(): {current_role_id}")
                                    except Exception as jwt_err:
                                        print(f"[INCOMING FILTER] Could not get current_role from JWT: {jwt_err}")
                                        pass
                                    
                                    role_ids = []
                                    if user_roles:
                                        role_ids = [ur.role_id for ur in user_roles]
                                    
                                    # Include current_role if it's not already in the list
                                    if current_role_id and current_role_id not in role_ids:
                                        role_ids.append(current_role_id)
                                        print(f"[INCOMING FILTER] Added current_role {current_role_id} to role list")
                                    
                                    if role_ids:
                                        workflow_ids = []
                                        for role_id in role_ids:
                                            role_workflows = workflow_service.get_role_workflows(role_id)
                                            workflow_ids.extend([w['id'] for w in role_workflows])
                                        
                                        # Remove duplicates
                                        workflow_ids = list(set(workflow_ids))
                                        
                                        if workflow_ids:
                                            # Filter by workflow_id to show projects currently at this role's workflows
                                            filter_list.append(self.workflow_id.in_(workflow_ids))
                                            print(f"[INCOMING FILTER] Added workflow filter for integer user: {workflow_ids} (roles: {role_ids})")
                                            logging.info(f"[INCOMING FILTER] Added workflow filter for integer user: {workflow_ids} (roles: {role_ids})")
                                        else:
                                            print(f"[INCOMING FILTER] No workflows found for roles {role_ids}")
                                            logging.warning(f"[INCOMING FILTER] No workflows found for roles {role_ids}")
                                    else:
                                        print(f"[INCOMING FILTER] No approved roles found for user {user_id}")
                                        logging.warning(f"[INCOMING FILTER] No approved roles found for user {user_id}")
                                except Exception as workflow_error:
                                    print(f"[INCOMING FILTER] Error getting workflows for integer user: {workflow_error}")
                                    logging.error(f"[INCOMING FILTER] Error getting workflows for integer user: {workflow_error}")
                                    import traceback
                                    logging.error(traceback.format_exc())
                    except Exception as e:
                        print(f"[INCOMING FILTER] Error getting user record: {e}")
                        logging.error(f"[INCOMING FILTER] Error getting user record: {e}")
                        pass
                    # Return no results if we can't get user info
                    if not user_organization_id:
                        print(f"[INCOMING FILTER] No org_id for integer user - blocking")
                        filter_list.append(self.id == -1)
                        return filter_list
                else:
                    # User is a dictionary
                    # CRITICAL: For INCOMING, we should check ALL of the user's approved roles,
                    # not just the current_role, because a user might need to see projects
                    # waiting for action at any of their roles (e.g., both Standard User and Department Head)
                    user_id = user.get('id') or user.get('original_id')
                    workflow_ids = []
                    role_ids = []
                    
                    # First, try to get workflows from ALL approved roles
                    if user_id:
                        try:
                            from ..user_role.model import UserRole
                            user_roles = UserRole.query.filter_by(
                                user_id=user_id,
                                is_approved=True
                            ).all()
                            if user_roles:
                                role_ids = [ur.role_id for ur in user_roles]
                                print(f"[INCOMING FILTER] Found {len(role_ids)} approved role(s) for user {user_id}: {role_ids}")
                                for role_id in role_ids:
                                    role_workflows = workflow_service.get_role_workflows(role_id)
                                    workflow_ids.extend([w['id'] for w in role_workflows])
                                workflow_ids = list(set(workflow_ids))  # Remove duplicates
                                print(f"[INCOMING FILTER] Workflows from all approved roles: {workflow_ids}")
                        except Exception as e:
                            print(f"[INCOMING FILTER] Error getting workflows from approved roles: {e}")
                            logging.error(f"[INCOMING FILTER] Error getting workflows from approved roles: {e}")
                            import traceback
                            logging.error(traceback.format_exc())
                    
                    # If no workflows found from approved roles, fall back to current_role
                    if not workflow_ids:
                        role = user.get("current_role")
                        if not role:
                            # Try to get current_role from JWT claims
                            try:
                                jwt_claims = get_jwt()
                                if jwt_claims:
                                    jwt_identity = jwt_claims.get('sub') or jwt_claims.get('identity')
                                    if isinstance(jwt_identity, dict) and jwt_identity.get('current_role'):
                                        role = jwt_identity['current_role']
                                        print(f"[INCOMING FILTER] Got current_role from JWT claims: {role.get('role_id')}")
                                    elif jwt_claims.get('current_role'):
                                        role = jwt_claims['current_role']
                                        print(f"[INCOMING FILTER] Got current_role directly from JWT claims: {role.get('role_id')}")
                            except:
                                pass
                        
                        if role:
                            try:
                                role_workflows = workflow_service.get_role_workflows(role['role_id'])
                                workflow_ids = [workflow['id'] for workflow in role_workflows]
                                role_ids = [role['role_id']]
                                print(f"[INCOMING FILTER] Using workflows from current_role: {workflow_ids} (role_id={role['role_id']})")
                            except Exception as workflow_error:
                                print(f"[INCOMING FILTER] Error getting workflows from current_role: {workflow_error}")
                                logging.error(f"[INCOMING FILTER] Error getting workflows from current_role: {workflow_error}")
                    
                    # Apply workflow filter
                    if workflow_ids:
                        filter_list.append(self.workflow_id.in_(workflow_ids))
                        print(f"[INCOMING FILTER] Added workflow filter: workflow_ids={workflow_ids} (roles: {role_ids})")
                        logging.info(f"[INCOMING FILTER] Added workflow filter: workflow_ids={workflow_ids} (roles: {role_ids})")
                    else:
                        # If no workflows found, return no results
                        print(f"[INCOMING FILTER] No workflows found for user {user_id} - returning no results")
                        logging.warning(f"[INCOMING FILTER] No workflows found for user {user_id} - returning no results")
                        filter_list.append(self.id == -1)
                    
                    # Filter by organization - users should only see projects from their EXACT organization
                    # This ensures Department Head in Organization A only sees projects from Organization A
                    # CRITICAL: This MUST be added, even if there are errors above
                    print(f"[INCOMING FILTER] Starting organization filter logic, user_id={user_id}, user_organization_id={user_organization_id}")
                    logging.info(f"[INCOMING FILTER] Starting organization filter logic, user_id={user_id}, user_organization_id={user_organization_id}")
                    
                    if isinstance(user, dict):
                        # Get user_id first (handle both 'id' and 'original_id')
                        if not user_id:
                            user_id = user.get('id') or user.get('original_id')
                            print(f"[INCOMING FILTER] Got user_id from user dict: {user_id}")
                        
                        # 1. ALWAYS fetch from user record first (most reliable source)
                        if user_id and not user_organization_id:
                            from ..user.model import User
                            try:
                                user_record = User.query.get(user_id)
                                if user_record:
                                    user_organization_id = user_record.organization_id
                                    print(f"[INCOMING FILTER] Retrieved user {user_id} from DB, org_id={user_organization_id}")
                                    logging.info(f"[INCOMING FILTER] Retrieved user {user_id} from DB, org_id={user_organization_id}")
                            except Exception as e:
                                print(f"[INCOMING FILTER] Error fetching user {user_id}: {e}")
                                logging.error(f"[INCOMING FILTER] Error fetching user {user_id}: {e}")
                                import traceback
                                logging.error(traceback.format_exc())
                                pass  # Silently continue to fallback methods
                        
                        # 2. Fallback: From user dict directly
                        if not user_organization_id:
                            user_organization_id = user.get('organization_id')
                            if user_organization_id:
                                print(f"[INCOMING FILTER] Got org_id from user dict: {user_organization_id}")
                                logging.info(f"[INCOMING FILTER] Got org_id from user dict: {user_organization_id}")
                        
                        # 3. Fallback: From organization object if present
                        if not user_organization_id:
                            organization = user.get('organization')
                            if isinstance(organization, dict):
                                user_organization_id = organization.get('id')
                            elif hasattr(organization, 'id'):
                                user_organization_id = organization.id
                            if user_organization_id:
                                print(f"[INCOMING FILTER] Got org_id from organization object: {user_organization_id}")
                                logging.info(f"[INCOMING FILTER] Got org_id from organization object: {user_organization_id}")
                    
                    # CRITICAL: ALWAYS add organization filter if we have user_organization_id
                    # This is the most important filter for INCOMING - it MUST be enforced
                    print(f"[INCOMING FILTER] Final check: user_organization_id={user_organization_id}, user_id={user_id}")
                    if user_organization_id:
                        # Use EXACT organization match - users only see projects from their own organization
                        # This prevents cross-organization access
                        # Example: Department Head in Organization A (id=1) only sees projects with organization_id=1
                        # Convert to int for reliable comparison
                        try:
                            user_org_id_int = int(user_organization_id)
                        except (ValueError, TypeError):
                            user_org_id_int = user_organization_id
                        
                        logging.info(f"[INCOMING FILTER] User {user_id} (org_id={user_org_id_int}) - Adding organization filter: organization_id == {user_org_id_int}")
                        print(f"[INCOMING FILTER] User {user_id} (org_id={user_org_id_int}) - Filtering projects by organization_id == {user_org_id_int}")
                        # CRITICAL: Add organization filter - this MUST be enforced
                        org_filter = self.organization_id == user_org_id_int
                        filter_list.append(org_filter)
                        print(f"[INCOMING FILTER] Organization filter added to filter_list. Current filter_list length: {len(filter_list)}")
                        logging.info(f"[INCOMING FILTER] Organization filter added successfully. filter_list length: {len(filter_list)}")
                    else:
                        # If we can't determine user's organization, return no results for safety
                        # This prevents users from seeing projects from other organizations
                        logging.warning(f"[INCOMING FILTER] User {user_id} has no organization_id - returning no results for safety")
                        print(f"[INCOMING FILTER] User {user_id} has no organization_id - returning no results for safety")
                        filter_list.append(self.id == -1)
                        # Don't continue - return early to prevent showing projects
                        return filter_list
                
                # CRITICAL: Exclude projects created by the current user
                # "Incoming" should only show projects waiting for the user's approval/review,
                # not projects they created themselves
                # NOTE: Users can have multiple roles, so they SHOULD see projects they created
                # when acting in a different role that has approval authority
                # Therefore, we do NOT filter by created_by
                if user_id:
                    try:
                        user_id_int = int(user_id)
                    except (ValueError, TypeError):
                        user_id_int = user_id
                    print(f"[INCOMING FILTER] Allowing projects from all users (including self) for user {user_id_int}")
                    logging.info(f"[INCOMING FILTER] Allowing projects from all users (including self) for user {user_id_int}")
                else:
                    logging.warning(f"[INCOMING FILTER] Could not get user_id")
                
                # CRITICAL: Incoming projects are ONLY SUBMITTED or ASSIGNED projects waiting for decision
                # Projects appear in "Incoming" when:
                # 1. They are SUBMITTED (submitted to a user role)
                # 2. They are ASSIGNED (assigned to a user role)
                # DRAFT projects MUST NEVER appear in Incoming - only when submitted or assigned
                # This ensures projects are cleared from "Incoming" after approval/rejection
                # because approved projects change status (not SUBMITTED/ASSIGNED) and rejected projects become REJECTED
                # Explicitly exclude DRAFT and only include SUBMITTED or ASSIGNED
                
                # Explicitly exclude DRAFT (case-insensitive to handle 'Draft' vs 'DRAFT' in database)
                # Use case-insensitive comparison since database may have 'Draft' but enum type expects 'DRAFT'
                from sqlalchemy import func
                # Cast to string and compare case-insensitively to handle any case variations
                draft_exclusion = func.upper(func.cast(self.project_status, db.String)) != func.upper(ProjectStatus.DRAFT.value)
                filter_list.append(draft_exclusion)
                
                # Only include SUBMITTED or ASSIGNED projects (case-insensitive)
                status_filter = or_(
                    func.upper(func.cast(self.project_status, db.String)) == func.upper(ProjectStatus.SUBMITTED.value),
                    func.upper(func.cast(self.project_status, db.String)) == func.upper(ProjectStatus.ASSIGNED.value)
                )
                filter_list.append(status_filter)
                logging.info(f"[INCOMING FILTER] Added status filters (case-insensitive): NOT {ProjectStatus.DRAFT.value} AND ({ProjectStatus.SUBMITTED.value} OR {ProjectStatus.ASSIGNED.value})")
                print(f"[INCOMING FILTER] Added status filters (case-insensitive): NOT {ProjectStatus.DRAFT.value} AND ({ProjectStatus.SUBMITTED.value} OR {ProjectStatus.ASSIGNED.value})")
                
                # CRITICAL FINAL VERIFICATION: Remove duplicate filters and ensure correct ones are present
                # Log all filters before deduplication for debugging
                print(f"[INCOMING FILTER] Filters before deduplication: {len(filter_list)}")
                for i, f in enumerate(filter_list):
                    filter_str = str(f)
                    print(f"[INCOMING FILTER] Filter {i}: {filter_str[:150]}")
                
                # Remove duplicate organization_id filters and keep only one correct one
                if user_organization_id:
                    try:
                        user_org_id_int = int(user_organization_id)
                        # Remove ALL existing organization_id column filters to avoid duplicates
                        # Use precise checking to only remove actual organization_id column comparisons
                        def is_org_filter(f):
                            """Check if filter is an organization_id column comparison"""
                            try:
                                # Check if it's a BinaryExpression with organization_id column
                                from sqlalchemy.sql.elements import BinaryExpression
                                if isinstance(f, BinaryExpression):
                                    if hasattr(f.left, 'key') and f.left.key == 'organization_id':
                                        return True
                                    if hasattr(f.left, 'name') and f.left.name == 'organization_id':
                                        return True
                                # Check string representation as fallback (but be careful)
                                filter_str = str(f).lower()
                                # Only match if it's clearly an organization_id comparison, not just mentioning it
                                if 'organization_id' in filter_str and ('==' in filter_str or '=' in filter_str.split()):
                                    # Make sure it's not part of a larger expression
                                    if filter_str.count('organization_id') == 1:
                                        return True
                            except:
                                pass
                            return False
                        
                        # Remove organization_id filters
                        filter_list = [f for f in filter_list if not is_org_filter(f)]
                        # Add the correct organization filter once at the beginning
                        filter_list.insert(0, self.organization_id == user_org_id_int)
                        print(f"[INCOMING FILTER] FINAL FIX: Removed duplicates and added single organization filter: {user_org_id_int}")
                        logging.info(f"[INCOMING FILTER] FINAL FIX: Removed duplicates and added single organization filter: {user_org_id_int}")
                    except Exception as final_fix_err:
                        print(f"[INCOMING FILTER] FINAL FIX ERROR: {final_fix_err}")
                        logging.error(f"[INCOMING FILTER] FINAL FIX ERROR: {final_fix_err}")
                        # Block access on error
                        filter_list.append(self.id == -1)
                        return filter_list
                else:
                    # No organization filter and no user_organization_id - block access
                    print(f"[INCOMING FILTER] FINAL BLOCK: No organization filter and no user_organization_id - blocking access")
                    logging.error(f"[INCOMING FILTER] FINAL BLOCK: No organization filter and no user_organization_id - blocking access")
                    filter_list.append(self.id == -1)
                    return filter_list
                
                # Remove duplicate created_by filters
                if user_id:
                    try:
                        user_id_int = int(user_id)
                        # Remove ALL existing created_by != filters to avoid duplicates
                        # Use multiple detection methods to catch all variations
                        def is_created_by_filter(f):
                            """Check if filter is a created_by != comparison"""
                            try:
                                # Method 1: Check SQLAlchemy BinaryExpression
                                from sqlalchemy.sql.elements import BinaryExpression
                                if isinstance(f, BinaryExpression):
                                    # Check left side is created_by column
                                    left_is_created_by = False
                                    if hasattr(f.left, 'key') and f.left.key == 'created_by':
                                        left_is_created_by = True
                                    elif hasattr(f.left, 'name') and f.left.name == 'created_by':
                                        left_is_created_by = True
                                    elif hasattr(f.left, '__class__'):
                                        # Check if it's a Column with created_by
                                        if hasattr(f.left, 'key') and 'created_by' in str(f.left.key):
                                            left_is_created_by = True
                                    
                                    if left_is_created_by:
                                        # Check if operator is !=
                                        if hasattr(f, 'operator'):
                                            op_str = str(f.operator)
                                            if op_str in ['!=', '<>', 'ne', 'isnot']:
                                                return True
                                        # Check string representation as fallback
                                        filter_str = str(f).lower()
                                        if '!=' in filter_str or '<>' in filter_str or 'is not' in filter_str:
                                            return True
                                
                                # Method 2: Check string representation
                                filter_str = str(f).lower()
                                # Look for created_by with != operator
                                if 'created_by' in filter_str:
                                    # Check for != operators
                                    if '!=' in filter_str or '<>' in filter_str or 'is not' in filter_str:
                                        # Make sure it's not part of a larger expression that mentions created_by
                                        # Count how many times created_by appears
                                        if filter_str.count('created_by') == 1:
                                            return True
                            except Exception as e:
                                # If detection fails, be conservative and don't remove
                                pass
                            return False
                        
                        # Count how many created_by filters exist before removal
                        created_by_count_before = sum(1 for f in filter_list if is_created_by_filter(f))
                        print(f"[INCOMING FILTER] Found {created_by_count_before} created_by filter(s) before deduplication")
                        
                        # Enhanced detection function that checks both structure and string
                        def is_any_created_by_filter(f):
                            """Comprehensive check for created_by != filters"""
                            # First try the structured check
                            if is_created_by_filter(f):
                                return True
                            # Then try string check as backup
                            try:
                                filter_str = str(f).lower()
                                # Look for created_by with != operators
                                if 'created_by' in filter_str:
                                    # Check for != operators
                                    if '!=' in filter_str or '<>' in filter_str or 'is not' in filter_str:
                                        # Make sure it's a simple comparison
                                        # If created_by appears once and it's a simple != comparison
                                        if filter_str.count('created_by') == 1:
                                            # Additional check: make sure it's not part of a complex AND/OR
                                            # Simple filters usually have format like "project.created_by != :created_by_1"
                                            if 'project.created_by' in filter_str or 'created_by !=' in filter_str:
                                                return True
                            except:
                                pass
                            return False
                        
                        # Remove ALL created_by != filters using comprehensive detection
                        filter_list_before = len(filter_list)
                        filter_list = [f for f in filter_list if not is_any_created_by_filter(f)]
                        removed_count = filter_list_before - len(filter_list)
                        print(f"[INCOMING FILTER] Removed {removed_count} created_by filter(s) during deduplication")
                        
                        # Count after removal
                        created_by_count_after = sum(1 for f in filter_list if is_any_created_by_filter(f))
                        print(f"[INCOMING FILTER] After removal: {created_by_count_after} created_by filter(s) remaining")
                        
                        if created_by_count_after > 0:
                            print(f"[INCOMING FILTER] WARNING: Still found {created_by_count_after} created_by filter(s) after removal!")
                            # Force remove any remaining ones
                            filter_list = [f for f in filter_list if not is_any_created_by_filter(f)]
                            print(f"[INCOMING FILTER] Force removed remaining created_by filters")
                        
                        # NOTE: We do NOT add back created_by filter because users with multiple roles
                        # should be able to see projects they created when acting in a different role
                        print(f"[INCOMING FILTER] FINAL FIX: Removed {created_by_count_before} created_by filter(s) - NOT adding back (multi-role support)")
                        logging.info(f"[INCOMING FILTER] FINAL FIX: Removed {created_by_count_before} created_by filter(s) - NOT adding back (multi-role support)")
                    except Exception as created_by_err:
                        print(f"[INCOMING FILTER] Error fixing created_by filter: {created_by_err}")
                        logging.error(f"[INCOMING FILTER] Error fixing created_by filter: {created_by_err}")
                        import traceback
                        logging.error(traceback.format_exc())
                
                # Log all filters after deduplication for debugging
                print(f"[INCOMING FILTER] Filters after deduplication: {len(filter_list)}")
                for i, f in enumerate(filter_list):
                    filter_str = str(f)
                    print(f"[INCOMING FILTER] Filter {i}: {filter_str[:150]}")
                    # Check for duplicates
                    if i > 0:
                        for j in range(i):
                            prev_filter_str = str(filter_list[j])
                            if filter_str == prev_filter_str:
                                print(f"[INCOMING FILTER] WARNING: Filter {i} is duplicate of filter {j}!")
                                logging.warning(f"[INCOMING FILTER] WARNING: Filter {i} is duplicate of filter {j}!")
                
                # Final verification: Check for any remaining duplicates and remove them
                filter_strings = [str(f) for f in filter_list]
                seen_strings = set()
                unique_filters = []
                duplicate_indices = []
                
                for i, filter_str in enumerate(filter_strings):
                    if filter_str not in seen_strings:
                        seen_strings.add(filter_str)
                        unique_filters.append(filter_list[i])
                    else:
                        duplicate_indices.append(i)
                        print(f"[INCOMING FILTER] Removing duplicate filter at index {i}: {filter_str[:100]}")
                        logging.warning(f"[INCOMING FILTER] Removing duplicate filter at index {i}")
                
                if duplicate_indices:
                    filter_list = unique_filters
                    print(f"[INCOMING FILTER] Removed {len(duplicate_indices)} duplicate filter(s) via final verification")
                    logging.warning(f"[INCOMING FILTER] Removed {len(duplicate_indices)} duplicate filter(s) via final verification")
                else:
                    print(f"[INCOMING FILTER] OK: No duplicate filters found")
                    logging.info(f"[INCOMING FILTER] OK: No duplicate filters found")
                
                # FINAL CHECK: Verify status filters are present
                # The filters are added earlier (lines 502-507), so they should be present
                # We do a simple count check - we expect at least 5 filters:
                # 1. organization_id
                # 2. workflow_id
                # 3. created_by !=
                # 4. project_status != DRAFT
                # 5. project_status == SUBMITTED OR ASSIGNED
                expected_min_filters = 5
                if len(filter_list) < expected_min_filters:
                    print(f"[INCOMING FILTER] WARNING: Only {len(filter_list)} filters found, expected at least {expected_min_filters}")
                    logging.warning(f"[INCOMING FILTER] Only {len(filter_list)} filters found, expected at least {expected_min_filters}")
                    # Count project_status filters to see if status filters are missing
                    project_status_filter_count = sum(1 for f in filter_list if 'project_status' in str(f).lower())
                    if project_status_filter_count < 2:
                        # Missing status filters - add them
                        print(f"[INCOMING FILTER] CRITICAL: Missing status filters! Adding DRAFT exclusion and status filter.")
                        logging.error(f"[INCOMING FILTER] CRITICAL: Missing status filters! Adding them.")
                        filter_list.append(self.project_status != ProjectStatus.DRAFT)
                        status_filter = or_(
                            self.project_status == ProjectStatus.SUBMITTED,
                            self.project_status == ProjectStatus.ASSIGNED
                        )
                        filter_list.append(status_filter)
                else:
                    # Filters appear to be present - log confirmation
                    project_status_filter_count = sum(1 for f in filter_list if 'project_status' in str(f).lower())
                    print(f"[INCOMING FILTER] Status filters verified: {len(filter_list)} total filters, {project_status_filter_count} project_status filters")
                    logging.info(f"[INCOMING FILTER] Status filters verified: {len(filter_list)} total filters, {project_status_filter_count} project_status filters")
                
                # FINAL CHECK: Ensure organization filter was added correctly
                org_filter_present = False
                org_filter_value = None
                for f in filter_list:
                    # Check string representation
                    filter_str = str(f)
                    if 'organization_id' in filter_str.lower() and '==' in filter_str:
                        org_filter_present = True
                        # Try to extract the value
                        import re
                        match = re.search(r'organization_id\s*==\s*(\d+)', filter_str)
                        if match:
                            org_filter_value = int(match.group(1))
                        break
                    # Method 2: Check SQLAlchemy column comparison
                    if hasattr(f, 'left'):
                        if hasattr(f.left, 'key') and f.left.key == 'organization_id':
                            org_filter_present = True
                            # Try to get the value from the right side
                            if hasattr(f, 'right'):
                                try:
                                    org_filter_value = int(f.right.value) if hasattr(f.right, 'value') else None
                                except:
                                    pass
                            break
                        if hasattr(f.left, 'name') and f.left.name == 'organization_id':
                            org_filter_present = True
                            if hasattr(f, 'right'):
                                try:
                                    org_filter_value = int(f.right.value) if hasattr(f.right, 'value') else None
                                except:
                                    pass
                            break
                    # Method 3: Check if it's a BinaryExpression with organization_id column
                    try:
                        from sqlalchemy.sql.elements import BinaryExpression
                        from sqlalchemy import Column
                        if isinstance(f, BinaryExpression):
                            if hasattr(f.left, 'key') and f.left.key == 'organization_id':
                                org_filter_present = True
                                if hasattr(f, 'right'):
                                    try:
                                        org_filter_value = int(f.right.value) if hasattr(f.right, 'value') else None
                                    except:
                                        pass
                                break
                            if hasattr(f.left, 'name') and f.left.name == 'organization_id':
                                org_filter_present = True
                                break
                    except:
                        pass
                
                print(f"[INCOMING FILTER] Final check: org_filter_present={org_filter_present}, org_filter_value={org_filter_value}, user_organization_id={user_organization_id}")
                logging.info(f"[INCOMING FILTER] Final check: org_filter_present={org_filter_present}, org_filter_value={org_filter_value}, user_organization_id={user_organization_id}")
                
                # CRITICAL: Verify organization filter matches user's organization
                if org_filter_present and user_organization_id:
                    try:
                        user_org_id_int = int(user_organization_id)
                        if org_filter_value is not None and org_filter_value != user_org_id_int:
                            # Organization filter has wrong value - this is a security issue!
                            print(f"[INCOMING FILTER] SECURITY: Organization filter value ({org_filter_value}) doesn't match user org ({user_org_id_int}) - fixing")
                            logging.error(f"[INCOMING FILTER] SECURITY: Organization filter value ({org_filter_value}) doesn't match user org ({user_org_id_int}) - fixing")
                            # Remove the wrong filter and add the correct one
                            # Note: We can't easily remove filters, so we'll add the correct one which will override
                            filter_list.insert(0, self.organization_id == user_org_id_int)
                    except Exception as verify_error:
                        print(f"[INCOMING FILTER] Error verifying org filter: {verify_error}")
                        logging.error(f"[INCOMING FILTER] Error verifying org filter: {verify_error}")
                
                if not org_filter_present and user_organization_id:
                    # Organization filter is missing - add it now as emergency measure
                    try:
                        user_org_id_int = int(user_organization_id)
                        filter_list.insert(0, self.organization_id == user_org_id_int)
                        print(f"[INCOMING FILTER] EMERGENCY: Added missing organization filter: {user_org_id_int}")
                        logging.warning(f"[INCOMING FILTER] EMERGENCY: Added missing organization filter: {user_org_id_int}")
                    except Exception as emergency_error:
                        print(f"[INCOMING FILTER] EMERGENCY: Error adding filter: {emergency_error}")
                        logging.error(f"[INCOMING FILTER] EMERGENCY: Error adding filter: {emergency_error}")
                elif not org_filter_present:
                    # No organization filter and no user_organization_id - block access
                    print(f"[INCOMING FILTER] EMERGENCY: No organization filter and no user_organization_id - blocking access")
                    logging.error(f"[INCOMING FILTER] EMERGENCY: No organization filter and no user_organization_id - blocking access")
                    filter_list.append(self.id == -1)
                    return filter_list
                    
            except Exception as e:
                # If there's any error, log it and return no results for safety
                print(f"[INCOMING FILTER] Workflow filtering error: {e}")
                import traceback
                traceback.print_exc()
                logging.error(f"[INCOMING FILTER] Exception in INCOMING filter: {e}")
                logging.error(traceback.format_exc())
                # CRITICAL: Even on error, try to add organization filter as safety measure
                # This ensures we NEVER show projects from other organizations, even if there's an error
                try:
                    user = get_jwt_identity()
                    if user:
                        # Handle both dict and integer user identity
                        if isinstance(user, dict):
                            user_id = user.get('id') or user.get('original_id')
                        elif isinstance(user, int):
                            user_id = user
                        else:
                            user_id = None
                        if user_id:
                            from ..user.model import User
                            user_record = User.query.get(user_id)
                            if user_record and user_record.organization_id:
                                user_org_id = int(user_record.organization_id)
                                filter_list.append(self.organization_id == user_org_id)
                                print(f"[INCOMING FILTER] Added organization filter as error recovery: {user_org_id}")
                                logging.info(f"[INCOMING FILTER] Added organization filter as error recovery: {user_org_id}")
                                # NOTE: NOT excluding projects created by user (multi-role support)
                                # Add status filters - CRITICAL: Must exclude DRAFT and only include SUBMITTED or ASSIGNED
                                filter_list.append(self.project_status != ProjectStatus.DRAFT)  # Explicitly exclude DRAFT first
                                status_filter = or_(
                                    self.project_status == ProjectStatus.SUBMITTED,
                                    self.project_status == ProjectStatus.ASSIGNED
                                )
                                filter_list.append(status_filter)
                                logging.info(f"[INCOMING FILTER] Added status filters in error recovery: NOT DRAFT AND (SUBMITTED OR ASSIGNED)")
                                print(f"[INCOMING FILTER] Added status filters in error recovery: NOT DRAFT AND (SUBMITTED OR ASSIGNED)")
                                # Return with these filters - don't block completely
                                return filter_list
                except Exception as recovery_error:
                    print(f"[INCOMING FILTER] Error in error recovery: {recovery_error}")
                    logging.error(f"[INCOMING FILTER] Error in error recovery: {recovery_error}")
                # If we can't add organization filter, return no results to be safe
                filter_list.append(self.id == -1)
                return filter_list
        if filter.get('created_on_start') and filter.get('created_on_end'):
            filter_list.append(self.created_on.between(filter.get(
                'created_on_start'), filter.get('created_on_end')))
        if filter.get('modified_on_start') and filter.get('modified_on_end'):
            filter_list.append(self.modified_on.between(filter.get(
                'modified_on_start'), filter.get('modified_on_end')))
        if filter.get('submission_date_start') and filter.get('submission_date_end'):
            filter_list.append(self.submission_date.between(filter.get(
                'submission_date_start'), filter.get('submission_date_end')))
        return filter_list

    def get_access_clauses(self):
        import sys
        clauses = or_()
        if has_permission(FULL_ACCESS):
            logging.info(f"[ACCESS CLAUSES] User has FULL_ACCESS - returning empty clauses (no restrictions)")
            return clauses
        logging.info(f"[ACCESS CLAUSES] User does NOT have FULL_ACCESS - checking request type")
        import sys
        organization_service = OrganizationService()
        phase_service = PhaseService()
        workflow_service = WorkflowService()

        try:
            user = get_jwt_identity()
        except Exception:
            user = None
        
        # Check if this is an INCOMING or PENDING request - need to check early
        # Try multiple methods to detect action type since it might be called from different contexts
        is_incoming_request = False
        is_pending_request = False
        user_organization_id_for_incoming = None
        try:
            from flask import request
            if request and hasattr(request, 'args'):
                filter_param = request.args.get('filter')
                if filter_param:
                    import json
                    filter_dict = json.loads(filter_param) if isinstance(filter_param, str) else filter_param
                    action_value = filter_dict.get('action')
                    
                    if action_value == 'INCOMING':
                        is_incoming_request = True
                        logging.info(f"[ACCESS CLAUSES] Detected INCOMING from request.args")
                        # Get user's organization_id for INCOMING requests
                        if user and isinstance(user, dict):
                            user_id = user.get('id') or user.get('original_id')
                            if user_id:
                                from ..user.model import User
                                user_record = User.query.get(user_id)
                                if user_record and user_record.organization_id:
                                    try:
                                        user_organization_id_for_incoming = int(user_record.organization_id)
                                    except (ValueError, TypeError):
                                        user_organization_id_for_incoming = user_record.organization_id
                                    logging.info(f"[ACCESS CLAUSES] Got user org_id: {user_organization_id_for_incoming}")
                    elif action_value == 'PENDING':
                        is_pending_request = True
                        logging.info(f"[ACCESS CLAUSES] Detected PENDING from request.args")
        except Exception as e:
            logging.debug(f"[ACCESS CLAUSES] Could not detect action from request: {e}")
            pass
        
        # Log request type
        if is_incoming_request:
            logging.info(f"[ACCESS CLAUSES] Request type: INCOMING")
        elif is_pending_request:
            logging.info(f"[ACCESS CLAUSES] Request type: PENDING")
        else:
            logging.info(f"[ACCESS CLAUSES] Request type: Normal Projects view")
        
        if user is not None:
            # Handle case where user is just an ID (integer) vs a dict with role info
            # Also extract user_id for later use
            if isinstance(user, int):
                # User is just an ID, need to query for role information
                user_id = user
                from ..user_role.model import UserRole
                user_role = UserRole.query.filter_by(
                    user_id=user,
                    is_approved=True
                ).first()
                
                if user_role and user_role.role:
                    # Build role dict structure similar to JWT identity format
                    role = {
                        'role_id': user_role.role_id,
                        'role': {
                            'id': user_role.role.id,
                            'name': user_role.role.name,
                            'phase_ids': user_role.role.phase_ids if user_role.role.phase_ids else []
                        },
                        'allowed_project_ids': user_role.allowed_project_ids,
                        'allowed_organization_ids': user_role.allowed_organization_ids
                    }
                else:
                    # User has no approved role
                    # For INCOMING/PENDING requests, return no access (role is required)
                    # For normal Projects view, allow access based on organization
                    if is_incoming_request or is_pending_request:
                        logging.warning(f"[ACCESS CLAUSES] User {user_id} has no role - blocking INCOMING/PENDING access")
                        return or_()
                    else:
                        # For normal Projects view, show all projects from user's organization
                        logging.info(f"[ACCESS CLAUSES] User {user_id} has no role - showing projects from organization for normal Projects view")
                        from ..user.model import User
                        user_record = User.query.get(user_id)
                        if user_record and user_record.organization_id:
                            try:
                                user_org_id_int = int(user_record.organization_id)
                                organization_ids = get_children_ids(
                                    organization_service.model.get_one(user_org_id_int))
                                return or_(self.organization_id.in_(organization_ids))
                            except Exception as e:
                                logging.error(f"[ACCESS CLAUSES] Error getting org projects for user without role: {e}")
                                return or_()
                        else:
                            logging.warning(f"[ACCESS CLAUSES] User {user_id} has no organization - no access")
                            return or_()
            else:
                # User is a dict with current_role
                user_id = user.get('id') or user.get('original_id')
                role = user.get("current_role")
                if not role:
                    # No current role
                    # For INCOMING/PENDING requests, return no access (role is required)
                    # For normal Projects view, allow access based on organization
                    if is_incoming_request or is_pending_request:
                        logging.warning(f"[ACCESS CLAUSES] User {user_id} (dict) has no role - blocking INCOMING/PENDING access")
                        return or_()
                    else:
                        # For normal Projects view, show all projects from user's organization
                        logging.info(f"[ACCESS CLAUSES] User {user_id} (dict) has no role - showing projects from organization for normal Projects view")
                        from ..user.model import User
                        user_record = User.query.get(user_id)
                        if user_record and user_record.organization_id:
                            try:
                                user_org_id_int = int(user_record.organization_id)
                                organization_ids = get_children_ids(
                                    organization_service.model.get_one(user_org_id_int))
                                return or_(self.organization_id.in_(organization_ids))
                            except Exception as e:
                                logging.error(f"[ACCESS CLAUSES] Error getting org projects for dict user without role: {e}")
                                return or_()
                        else:
                            logging.warning(f"[ACCESS CLAUSES] User {user_id} (dict) has no organization - no access")
                            return or_()
            
            # Debug logging for role and organization access
            role_name = role.get('role', {}).get('name', 'Unknown') if isinstance(role, dict) else 'Unknown'
            allowed_orgs = role.get('allowed_organization_ids') if isinstance(role, dict) else 'N/A'
            logging.info(f"[ACCESS DEBUG] User ID: {user_id}, Role: {role_name}, Allowed Orgs: {allowed_orgs}")
            
            # CRITICAL: Check request type FIRST before building workflow/phase clauses
            # For normal Projects view, skip all role-based filtering and just show all org projects
            if not is_incoming_request and not is_pending_request:
                # For normal Projects view (not INCOMING, not PENDING), show ALL projects from user's organization
                # This allows users to see all projects regardless of their role
                logging.info(f"[ACCESS CLAUSES] Normal Projects view - role={role_name}, showing ALL org projects (bypassing role restrictions)")
                
                # Get user's organization ID
                user_organization_id = None
                if isinstance(user, int):
                    from ..user.model import User
                    user_record = User.query.get(user)
                    if user_record:
                        user_organization_id = user_record.organization_id
                elif isinstance(user, dict):
                    user_id_lookup = user.get('id') or user.get('original_id')
                    if user_id_lookup:
                        from ..user.model import User
                        user_record = User.query.get(user_id_lookup)
                        if user_record:
                            user_organization_id = user_record.organization_id
                
                if user_organization_id:
                    try:
                        user_org_id_int = int(user_organization_id)
                        # Get all child organizations (hierarchical structure)
                        organization_ids = get_children_ids(
                            organization_service.model.get_one(user_org_id_int))
                        
                        # Show ALL projects from user's organization (and child orgs)
                        final_clauses = or_(self.organization_id.in_(organization_ids))
                        logging.info(f"[ACCESS CLAUSES] Returning ALL projects from org {user_org_id_int} and children: {organization_ids}")
                        return final_clauses
                    except (ValueError, TypeError) as e:
                        logging.error(f"[ACCESS CLAUSES] Error converting org_id: {e}")
                        # Fallback to showing projects user created
                        return or_(self.created_by == user_id)
                else:
                    logging.warning(f"[ACCESS CLAUSES] User has no organization - showing only projects they created")
                    # Fallback to showing projects user created
                    return or_(self.created_by == user_id)
            
            # Only build workflow/phase clauses for INCOMING and PENDING requests
            logging.info(f"[ACCESS CLAUSES] Building workflow/phase clauses for {('INCOMING' if is_incoming_request else 'PENDING')} request")
            
            role_workflow = workflow_service.get_role_first_workflow(
                role['role_id'])
            first_phase_id = 1
            first_phase = phase_service.model.get_list(
                per_page=1, sort_field='sequence')
            if len(first_phase) > 0:
                first_phase_id = first_phase[0].id

            not_draft = self.project_status != ProjectStatus.DRAFT
            not_first_phase = self.phase_id != first_phase_id

            workflow_clause = and_()
            if role_workflow is not None:
                workflow_clause = and_(self.max_step >= role_workflow.step)
            else:
                workflow_clause = and_(self.max_step > 1)
            phase_clause = and_(self.phase_id >= min(
                role['role']['phase_ids']))

            # For INCOMING requests, CRITICALLY enforce organization matching
            # Projects should ONLY appear in Incoming for users in the SAME organization
            if is_incoming_request and user_organization_id_for_incoming:
                # For INCOMING requests, we MUST use strict organization matching
                # Reset clauses to ensure ONLY organization-matched projects are included
                # Convert to int for reliable comparison
                try:
                    user_org_id_int = int(user_organization_id_for_incoming)
                except (ValueError, TypeError):
                    user_org_id_int = user_organization_id_for_incoming
                
                # Build the base organization filter - this is MANDATORY for all INCOMING clauses
                org_match = self.organization_id == user_org_id_int
                
                # For INCOMING, build clauses that ALWAYS include organization matching
                incoming_clauses = []
                
                # Add workflow/phase based access WITH organization matching
                incoming_clauses.append(and_(
                    org_match,
                    workflow_clause,
                    phase_clause,
                    or_(not_draft, not_first_phase)
                ))
                
                # If user has allowed_project_ids, include those projects BUT ONLY if they match organization
                if role['allowed_project_ids'] is not None:
                    incoming_clauses.append(and_(
                        self.id.in_(role['allowed_project_ids']),
                        org_match
                    ))
                
                # Replace clauses with organization-restricted clauses
                clauses = or_(*incoming_clauses) if incoming_clauses else and_(self.id == -1)
                
                logging.info(f"[INCOMING ACCESS CLAUSES] Applied strict organization filtering for INCOMING: org_id={user_org_id_int}, clauses_count={len(incoming_clauses)}")
            elif is_pending_request:
                # For PENDING requests, use role-based workflow filtering
                logging.info(f"[ACCESS CLAUSES] PENDING request - applying role-based filtering")
                clauses = or_(clauses, self.created_by == user_id)
                
                if role['allowed_project_ids'] is not None:
                    clauses = or_(clauses, and_(self.id.in_(
                        role['allowed_project_ids'])))
                
                if (role['allowed_organization_ids'] is not None
                        and ALL not in role['allowed_organization_ids']):
                    logging.info(f"[ACCESS DEBUG] PENDING: Applying SPECIFIC organization filter: {role['allowed_organization_ids']}")
                    organization_ids = []
                    for id in role['allowed_organization_ids']:
                        organization_ids += get_children_ids(
                            organization_service.model.get_one(id))
                    logging.info(f"[ACCESS DEBUG] PENDING: Organization IDs (with children): {organization_ids}")
                    clauses = or_(clauses, and_(self.organization_id.in_(
                        organization_ids), workflow_clause, phase_clause, or_(not_draft, not_first_phase)))
                else:
                    logging.info(f"[ACCESS DEBUG] PENDING: Applying GLOBAL access (allowed_org_ids has 'all' or is None)")
                    clauses = or_(clauses, and_(workflow_clause,
                                                phase_clause, or_(not_draft, not_first_phase)))
        return clauses

    def get_access_filters(self, **kwargs):
        try:
            # CRITICAL: Log at the VERY START before anything else
            filter_dict = kwargs.get('filter', {})
            access_type = kwargs.get('access_type')
            print(f"[INCOMING ACCESS] ===== get_access_filters START =====")
            print(f"[INCOMING ACCESS] filter_dict: {filter_dict}")
            print(f"[INCOMING ACCESS] kwargs keys: {list(kwargs.keys())}")
            print(f"[INCOMING ACCESS] access_type: {access_type}")
            sys.stdout.flush()
            logging.info(f"[INCOMING ACCESS] ===== get_access_filters START =====")
            logging.info(f"[INCOMING ACCESS] filter_dict: {filter_dict}")
            logging.info(f"[INCOMING ACCESS] kwargs keys: {list(kwargs.keys())}")
            logging.info(f"[INCOMING ACCESS] access_type: {access_type}")
            
            filter_list = super().get_access_filters(self, **kwargs)
            
            print(f"[INCOMING ACCESS] After super().get_access_filters, filter_list length: {len(filter_list)}")
            sys.stdout.flush()
            
            # CRITICAL: For SINGLE_RECORD access (viewing individual project), ALWAYS enforce organization filtering
            # This prevents users from different organizations from seeing each other's projects
            # 
            # Access Rules:
            # 1. User must have view_project permission AND belong to same organization as project
            # 2. No view_project permission → Cannot view any projects
            # 3. Different organization → Cannot view the project (even with FULL_ACCESS)
            #
            # TODO: If we need a "Global Viewer" role that can see all projects, implement a specific 
            #       permission like "global_viewer" and check for it here
            if access_type == SINGLE_RECORD:
                # Check if user has view_project permission
                has_view_permission = has_permission('view_project')
                has_full_access = has_permission(FULL_ACCESS)
                
                print(f"[SINGLE RECORD ACCESS] Permissions check - has_view_project: {has_view_permission}, has_full_access: {has_full_access}")
                logging.info(f"[SINGLE RECORD ACCESS] Permissions check - has_view_project: {has_view_permission}, has_full_access: {has_full_access}")
                
                # If user doesn't have view_project permission, block access entirely
                if not has_view_permission and not has_full_access:
                    filter_list.append(self.id == -1)
                    print(f"[SINGLE RECORD ACCESS] User lacks view_project permission - blocking all access")
                    logging.warning(f"[SINGLE RECORD ACCESS] User lacks view_project permission - blocking access to all projects")
                else:
                    # ALWAYS apply organization filtering (even for FULL_ACCESS users)
                    # This is critical for security - users should only see projects from their own organization
                    user = get_jwt_identity()
                    user_organization_id = None
                    
                    if isinstance(user, int):
                        from ..user.model import User
                        user_record = User.query.get(user)
                        if user_record:
                            user_organization_id = user_record.organization_id
                    elif isinstance(user, dict):
                        user_id = user.get('id') or user.get('original_id')
                        if user_id:
                            from ..user.model import User
                            user_record = User.query.get(user_id)
                            if user_record:
                                user_organization_id = user_record.organization_id
                    
                    if user_organization_id:
                        try:
                            user_org_id_int = int(user_organization_id)
                            filter_list.append(self.organization_id == user_org_id_int)
                            print(f"[SINGLE RECORD ACCESS] ✓ ENFORCED organization filter: org_id={user_org_id_int} (ALL users must match organization)")
                            logging.info(f"[SINGLE RECORD ACCESS] Enforced organization filter for user org_id: {user_org_id_int}")
                        except (ValueError, TypeError) as e:
                            print(f"[SINGLE RECORD ACCESS] Error converting org_id: {e}")
                            # On error, block access for safety
                            filter_list.append(self.id == -1)
                    else:
                        # No organization - block access to prevent leaks
                        filter_list.append(self.id == -1)
                        print(f"[SINGLE RECORD ACCESS] No organization found - blocking access")
                        logging.warning(f"[SINGLE RECORD ACCESS] No organization found for user - blocking access")
            
            # CRITICAL: Check for INCOMING BEFORE checking FULL_ACCESS
            # FULL_ACCESS users (administrators) should see NO projects in INCOMING tab
            # Incoming tab is only for regular users with workflow-based roles
            is_incoming_in_filter = False
            
            # Check filter_dict first
            if filter_dict and filter_dict.get('action'):
                action_val = filter_dict.get('action')
                if (action_val == 'INCOMING' or 
                    (isinstance(action_val, str) and action_val.upper() == 'INCOMING') or
                    str(action_val).upper() == 'INCOMING'):
                    is_incoming_in_filter = True
                    print(f"[INCOMING ACCESS] INCOMING detected in filter_dict - will block for FULL_ACCESS users")
                    sys.stdout.flush()
            
            # Also check request.args as fallback (important when filter_dict is empty)
            if not is_incoming_in_filter:
                try:
                    from flask import request
                    if request and hasattr(request, 'args'):
                        filter_param = request.args.get('filter')
                        if filter_param:
                            import json
                            try:
                                req_filter_dict = json.loads(filter_param) if isinstance(filter_param, str) else filter_param
                                req_action = req_filter_dict.get('action')
                                if req_action == 'INCOMING' or (isinstance(req_action, str) and req_action.upper() == 'INCOMING'):
                                    is_incoming_in_filter = True
                                    # Update filter_dict for use below
                                    filter_dict = req_filter_dict
                                    print(f"[INCOMING ACCESS] INCOMING detected in request.args - will block for FULL_ACCESS users")
                                    sys.stdout.flush()
                            except:
                                pass
                except:
                    pass
            
            # For FULL_ACCESS users, only bypass filters if it's NOT an INCOMING request
            # For INCOMING requests, administrators should NEVER see any projects
            # (Incoming tab is only for regular users with workflow-based roles)
            if has_permission(FULL_ACCESS) and not is_incoming_in_filter:
                print(f"[INCOMING ACCESS] User has FULL_ACCESS and NOT INCOMING - returning early")
                sys.stdout.flush()
                return filter_list
            elif has_permission(FULL_ACCESS) and is_incoming_in_filter:
                print(f"[INCOMING ACCESS] User has FULL_ACCESS but INCOMING detected - blocking all INCOMING projects for administrators")
                sys.stdout.flush()
                logging.info(f"[INCOMING ACCESS] Blocking INCOMING tab for FULL_ACCESS user (administrators don't use Incoming tab)")
                # Block all INCOMING projects for administrators
                filter_list.append(self.id == -1)
                return filter_list
        except Exception as e:
            print(f"[INCOMING ACCESS] ERROR at start of get_access_filters: {e}")
            sys.stdout.flush()
            import traceback
            traceback.print_exc()
            # Return base filters on error
            return super().get_access_filters(self, **kwargs)
        
        # CRITICAL: Always check for INCOMING - use the most reliable method
        # Check filter_dict first (most reliable)
        action_value = filter_dict.get('action') if filter_dict else None
        
        print(f"[INCOMING ACCESS] action_value from filter_dict: {action_value}, type: {type(action_value)}")
        sys.stdout.flush()
        
        # Try multiple ways to detect INCOMING
        is_incoming = False
        if action_value:
            # Direct comparison
            if action_value == 'INCOMING':
                is_incoming = True
                print(f"[INCOMING ACCESS] Detected INCOMING via direct comparison")
                sys.stdout.flush()
            # String comparison (case-insensitive)
            elif isinstance(action_value, str) and action_value.upper() == 'INCOMING':
                is_incoming = True
                print(f"[INCOMING ACCESS] Detected INCOMING via string comparison")
                sys.stdout.flush()
            # Convert to string and compare
            elif str(action_value).upper() == 'INCOMING':
                is_incoming = True
                print(f"[INCOMING ACCESS] Detected INCOMING via str() conversion")
                sys.stdout.flush()
        
        # Also try to detect INCOMING from request context as fallback
        if not is_incoming:
            try:
                from flask import request
                if request and hasattr(request, 'args'):
                    filter_param = request.args.get('filter')
                    if filter_param:
                        import json
                        try:
                            req_filter_dict = json.loads(filter_param) if isinstance(filter_param, str) else filter_param
                            req_action = req_filter_dict.get('action')
                            if req_action == 'INCOMING' or (isinstance(req_action, str) and req_action.upper() == 'INCOMING'):
                                is_incoming = True
                                print(f"[INCOMING ACCESS] Detected INCOMING from request.args")
                                logging.info(f"[INCOMING ACCESS] Detected INCOMING from request.args")
                        except:
                            pass
            except:
                pass
        
        # Log what we received - ALWAYS log for debugging
        print(f"[INCOMING ACCESS] After detection - action_value: {action_value}, type: {type(action_value)}, is_incoming: {is_incoming}")
        sys.stdout.flush()
        logging.info(f"[INCOMING ACCESS] After detection - action_value: {action_value}, type: {type(action_value)}, is_incoming: {is_incoming}")
        
        if is_incoming:
            print(f"[INCOMING ACCESS] INCOMING DETECTED!")
            logging.info(f"[INCOMING ACCESS] INCOMING DETECTED!")
        
        # Get user's organization_id for INCOMING requests
        user_organization_id_for_incoming = None
        user_id_for_incoming = None
        if is_incoming:
            print(f"[INCOMING ACCESS] Detected INCOMING request, filter_dict: {filter_dict}")
            sys.stdout.flush()
            logging.info(f"[INCOMING ACCESS] Detected INCOMING request, filter_dict: {filter_dict}")
            try:
                user = get_jwt_identity()
                print(f"[INCOMING ACCESS] User type: {type(user)}, user: {user}")
                sys.stdout.flush()
                
                # Handle both dict and integer user types
                if isinstance(user, int):
                    # User is an integer (user ID)
                    user_id_for_incoming = user
                    print(f"[INCOMING ACCESS] User is integer: {user_id_for_incoming}")
                    sys.stdout.flush()
                    from ..user.model import User
                    user_record = User.query.get(user_id_for_incoming)
                    if user_record and user_record.organization_id:
                        try:
                            user_organization_id_for_incoming = int(user_record.organization_id)
                        except (ValueError, TypeError):
                            user_organization_id_for_incoming = user_record.organization_id
                        print(f"[INCOMING ACCESS] User organization_id (integer user): {user_organization_id_for_incoming}")
                        sys.stdout.flush()
                        logging.info(f"[INCOMING ACCESS] User organization_id (integer user): {user_organization_id_for_incoming}")
                    else:
                        print(f"[INCOMING ACCESS] User {user_id_for_incoming} has no organization_id - blocking all access")
                        sys.stdout.flush()
                        logging.warning(f"[INCOMING ACCESS] User {user_id_for_incoming} has no organization_id - blocking all access")
                        filter_list.append(self.id == -1)
                        return filter_list
                elif user and isinstance(user, dict):
                    user_id_for_incoming = user.get('id') or user.get('original_id')
                    print(f"[INCOMING ACCESS] User ID: {user_id_for_incoming}")
                    sys.stdout.flush()
                    logging.info(f"[INCOMING ACCESS] User ID: {user_id_for_incoming}")
                    if user_id_for_incoming:
                        from ..user.model import User
                        user_record = User.query.get(user_id_for_incoming)
                        if user_record and user_record.organization_id:
                            try:
                                user_organization_id_for_incoming = int(user_record.organization_id)
                            except (ValueError, TypeError):
                                user_organization_id_for_incoming = user_record.organization_id
                            print(f"[INCOMING ACCESS] User organization_id: {user_organization_id_for_incoming}")
                            sys.stdout.flush()
                            logging.info(f"[INCOMING ACCESS] User organization_id: {user_organization_id_for_incoming}")
                        else:
                            # No organization_id for user - return no results for safety
                            print(f"[INCOMING ACCESS] User {user_id_for_incoming} has no organization_id - blocking all access")
                            sys.stdout.flush()
                            logging.warning(f"[INCOMING ACCESS] User {user_id_for_incoming} has no organization_id - blocking all access")
                            filter_list.append(self.id == -1)
                            return filter_list
                    else:
                        print(f"[INCOMING ACCESS] Could not get user_id from user dict")
                        sys.stdout.flush()
                        logging.warning(f"[INCOMING ACCESS] Could not get user_id from user dict")
                        filter_list.append(self.id == -1)
                        return filter_list
                else:
                    print(f"[INCOMING ACCESS] User is not a dict or integer, or is None - blocking all access")
                    sys.stdout.flush()
                    logging.warning(f"[INCOMING ACCESS] User is not a dict or integer, or is None")
                    filter_list.append(self.id == -1)
                    return filter_list
            except Exception as e:
                # If we can't get user organization, block access for safety
                print(f"[INCOMING ACCESS] Error getting user organization: {e}")
                sys.stdout.flush()
                logging.error(f"[INCOMING ACCESS] Error getting user organization: {e}")
                import traceback
                logging.error(traceback.format_exc())
                filter_list.append(self.id == -1)
                return filter_list
        else:
            if filter_dict:
                print(f"[INCOMING ACCESS] Not an INCOMING request, filter_dict: {filter_dict}, action: {filter_dict.get('action')}")
                logging.debug(f"[INCOMING ACCESS] Not an INCOMING request, filter_dict: {filter_dict}, action: {filter_dict.get('action')}")
            else:
                print(f"[INCOMING ACCESS] Not an INCOMING request, filter_dict is empty or None")
                logging.debug(f"[INCOMING ACCESS] Not an INCOMING request, filter_dict is empty or None")
        
        # For INCOMING requests, get_filters() already handles:
        # - organization_id filter (with deduplication)
        # - created_by filter (with deduplication)  
        # - workflow_id filter (projects currently at user's role workflows)
        # - project_status filter (SUBMITTED)
        # So we should NOT add duplicate filters here
        # The workflow_id filter from get_filters() is more precise than max_step >= for INCOMING
        print(f"[INCOMING ACCESS] DEBUG: is_incoming={is_incoming}, user_organization_id_for_incoming={user_organization_id_for_incoming}")
        sys.stdout.flush()
        if is_incoming and user_organization_id_for_incoming:
            print(f"[INCOMING ACCESS] INCOMING detected - get_filters() handles all necessary filters (org/created_by/workflow/status), returning filter_list as-is")
            logging.info(f"[INCOMING ACCESS] INCOMING detected - get_filters() handles all necessary filters, returning filter_list as-is")
            sys.stdout.flush()
            
            # Log current filters for debugging
            print(f"[INCOMING ACCESS] Current filter_list length: {len(filter_list)}")
            logging.info(f"[INCOMING ACCESS] Current filter_list length: {len(filter_list)}")
            for i, f in enumerate(filter_list):
                print(f"[INCOMING ACCESS] Filter {i}: {f}")
                logging.info(f"[INCOMING ACCESS] Filter {i}: {f}")
            sys.stdout.flush()
            
            # Return early - get_filters() has already added all necessary filters
            # No need to add restrictive clause with max_step >= as it conflicts with workflow_id filter
            print(f"[INCOMING ACCESS] EARLY RETURN: Returning filter_list without adding restrictive clause")
            sys.stdout.flush()
            return filter_list
        else:
            print(f"[INCOMING ACCESS] DEBUG: NOT taking early return path - is_incoming={is_incoming}, user_organization_id_for_incoming={user_organization_id_for_incoming}")
            sys.stdout.flush()
        
        # CRITICAL FIX: Even if INCOMING wasn't detected above, check again as fallback
        # This handles cases where the detection might have failed
        if not is_incoming and filter_dict:
            action_val = filter_dict.get('action')
            # Try multiple ways to detect INCOMING
            if (action_val == 'INCOMING' or 
                str(action_val).upper() == 'INCOMING' or
                (isinstance(action_val, str) and action_val.upper() == 'INCOMING')):
                # INCOMING was found but not detected - this is a bug, but let's handle it
                print(f"[INCOMING ACCESS] FALLBACK: INCOMING action found but initial detection failed! action_val: {action_val}")
                logging.warning(f"[INCOMING ACCESS] FALLBACK: INCOMING action found but initial detection failed! action_val: {action_val}")
                is_incoming = True  # Set it now
                # Now get user org - but don't add filters here, get_filters() handles them
                try:
                    user = get_jwt_identity()
                    if user and isinstance(user, dict):
                        user_id_for_incoming = user.get('id') or user.get('original_id')
                        if user_id_for_incoming:
                            from ..user.model import User
                            user_record = User.query.get(user_id_for_incoming)
                            if user_record and user_record.organization_id:
                                try:
                                    user_organization_id_for_incoming = int(user_record.organization_id)
                                except (ValueError, TypeError):
                                    user_organization_id_for_incoming = user_record.organization_id
                                # For INCOMING, get_filters() handles all filters, so just return
                                print(f"[INCOMING ACCESS] FALLBACK: INCOMING detected - get_filters() handles all filters, returning filter_list as-is")
                                logging.info(f"[INCOMING ACCESS] FALLBACK: INCOMING detected - get_filters() handles all filters, returning filter_list as-is")
                                return filter_list
                except Exception as e:
                    logging.error(f"[INCOMING ACCESS] FALLBACK: Error: {e}")
        
        # For non-INCOMING requests, use normal access clauses
        # BUT: If filter_dict has 'action': 'INCOMING', we MUST enforce organization matching
        # even if detection failed above (safety net)
        if not is_incoming and filter_dict:
            action_check = filter_dict.get('action')
            if action_check and (action_check == 'INCOMING' or str(action_check).upper() == 'INCOMING'):
                # This is definitely INCOMING - enforce organization matching
                print(f"[INCOMING ACCESS] FINAL FALLBACK: Detected INCOMING in filter_dict, enforcing organization matching")
                logging.warning(f"[INCOMING ACCESS] FINAL FALLBACK: Detected INCOMING in filter_dict, enforcing organization matching")
                try:
                    user = get_jwt_identity()
                    if user and isinstance(user, dict):
                        user_id = user.get('id') or user.get('original_id')
                        if user_id:
                            from ..user.model import User
                            user_record = User.query.get(user_id)
                            if user_record and user_record.organization_id:
                                user_org_id = int(user_record.organization_id)
                                # Add organization filter FIRST
                                filter_list.insert(0, self.organization_id == user_org_id)
                                # NOTE: NOT excluding projects created by user (multi-role support)
                                print(f"[INCOMING ACCESS] FINAL FALLBACK: Added org filter: {user_org_id}")
                                logging.info(f"[INCOMING ACCESS] FINAL FALLBACK: Added org filter: {user_org_id}")
                except Exception as e:
                    logging.error(f"[INCOMING ACCESS] FINAL FALLBACK: Error: {e}")
        
        # CRITICAL: For INCOMING requests, we should NEVER reach here if detection worked correctly
        # But if we do, it means INCOMING was not detected - check one more time
        # This is a safety net to prevent permissive clauses from being applied
        final_incoming_check = is_incoming or (filter_dict and filter_dict.get('action') == 'INCOMING')
        if final_incoming_check:
            # INCOMING was detected but we reached here - this means detection/processing failed
            # Block access rather than using permissive clauses
            print(f"[INCOMING ACCESS] ERROR: INCOMING detected but reached non-INCOMING code path! Blocking access.")
            sys.stdout.flush()
            logging.error(f"[INCOMING ACCESS] ERROR: INCOMING detected but reached non-INCOMING code path! Blocking access.")
            # Try one last time to add organization filter
            try:
                user = get_jwt_identity()
                user_id = None
                if isinstance(user, int):
                    user_id = user
                elif isinstance(user, dict):
                    user_id = user.get('id') or user.get('original_id')
                
                if user_id:
                    from ..user.model import User
                    user_record = User.query.get(user_id)
                    if user_record and user_record.organization_id:
                        user_org_id = int(user_record.organization_id)
                        filter_list.insert(0, self.organization_id == user_org_id)
                        # NOTE: NOT excluding projects created by user (multi-role support)
                        print(f"[INCOMING ACCESS] ERROR RECOVERY: Added org filter: {user_org_id}")
                        sys.stdout.flush()
                        logging.info(f"[INCOMING ACCESS] ERROR RECOVERY: Added org filter: {user_org_id}")
                        # Still block with id == -1 to be extra safe
                        filter_list.append(self.id == -1)
            except:
                pass
            filter_list.append(self.id == -1)
            return filter_list
        
        # FINAL SAFETY CHECK: Even if INCOMING wasn't detected above, check filter_dict one more time
        # This is a critical safety net to prevent cross-organization access
        if filter_dict and filter_dict.get('action'):
            action_val = filter_dict.get('action')
            # Check if action is INCOMING (case-insensitive)
            if (action_val == 'INCOMING' or 
                (isinstance(action_val, str) and action_val.upper() == 'INCOMING') or
                str(action_val).upper() == 'INCOMING'):
                # INCOMING is in the filter but wasn't detected - this is a critical bug
                # But we must handle it to prevent security issues
                print(f"[INCOMING ACCESS] CRITICAL: INCOMING found in filter_dict but not detected! action_val: {action_val}")
                sys.stdout.flush()
                logging.error(f"[INCOMING ACCESS] CRITICAL: INCOMING found in filter_dict but not detected! action_val: {action_val}")
                # For INCOMING, get_filters() handles all filters, so just return
                print(f"[INCOMING ACCESS] CRITICAL: INCOMING detected - get_filters() handles all filters, returning filter_list as-is")
                sys.stdout.flush()
                logging.info(f"[INCOMING ACCESS] CRITICAL: INCOMING detected - get_filters() handles all filters, returning filter_list as-is")
                return filter_list
        
        # FINAL SAFETY CHECK: Before using get_access_clauses(), verify INCOMING wasn't missed
        # This prevents permissive clauses from being applied to INCOMING requests
        final_action_check = None
        if filter_dict:
            final_action_check = filter_dict.get('action')
        
        # Check if INCOMING is in the filter (multiple ways)
        is_final_incoming = False
        if final_action_check:
            if (final_action_check == 'INCOMING' or 
                (isinstance(final_action_check, str) and final_action_check.upper() == 'INCOMING') or
                str(final_action_check).upper() == 'INCOMING'):
                is_final_incoming = True
        
        if is_final_incoming:
            # INCOMING is definitely in the filter but we're about to use permissive clauses
            # This should NEVER happen - but get_filters() should have handled it
            print(f"[INCOMING ACCESS] CRITICAL: INCOMING in filter but not handled! get_filters() should have handled it, returning filter_list as-is.")
            sys.stdout.flush()
            logging.error(f"[INCOMING ACCESS] CRITICAL: INCOMING in filter but not handled! get_filters() should have handled it, returning filter_list as-is.")
            # For INCOMING, get_filters() handles all filters, so just return
            return filter_list
        
        # For non-INCOMING requests, use normal access clauses
        clauses = self.get_access_clauses(self)
        filter_list.append(clauses)
        return filter_list

    @classmethod
    def get_total_by_phases(self):
        phase_model = PhaseService().model
        access_clauses = self.get_access_clauses(self)
        clauses = and_(self.phase_id == phase_model.id, access_clauses)
        query = db.session.query(func.count(self.id).label(
            'total_count'), phase_model.name.label('phase_name'))
        query = query.outerjoin(self, clauses)
        query = query.group_by(phase_model.id, phase_model.name)
        print(str(query))
        records = query.order_by(phase_model.id).all()
        return [u._asdict() for u in records]


@event.listens_for(Project, 'before_insert')
def generate_project_code(mapper, connection, target):
    import logging
    sequence = 1
    organization_code = ''
    
    # CRITICAL: Ensure project_status is always DRAFT for new projects
    # This is a final safeguard to prevent projects from being created with wrong status
    if target.project_status != ProjectStatus.DRAFT:
        logging.warning(f"[PROJECT CODE] Project being created with status {target.project_status}, forcing to DRAFT")
        print(f"[PROJECT CODE] WARNING: Project being created with status {target.project_status}, forcing to DRAFT")
        target.project_status = ProjectStatus.DRAFT
    
    # Check if organization_id is None or invalid
    if target.organization_id is None:
        logging.error(f"[PROJECT CODE] organization_id is None for project creation")
        abort(422, message=messages.ORGANIZATION_NOT_FOUND)
    
    logging.info(f"[PROJECT CODE] Generating code for organization_id={target.organization_id}, project_status={target.project_status}")
    
    # Use direct database query to bypass access filters (needed in before_insert event)
    # Access filters might prevent finding the organization through the service layer
    # Query without is_deleted filter first to see if it exists
    organization = OrganizationModel.query.filter_by(id=target.organization_id).first()
    
    if organization is None:
        logging.error(f"[PROJECT CODE] Organization {target.organization_id} does not exist in database at all")
        abort(422, message=messages.ORGANIZATION_NOT_FOUND)
    
    if organization.is_deleted:
        logging.error(f"[PROJECT CODE] Organization {target.organization_id} exists but is_deleted=True")
        abort(422, message=messages.ORGANIZATION_NOT_FOUND)
    
    logging.info(f"[PROJECT CODE] Organization found: id={organization.id}, name={getattr(organization, 'name', 'N/A')}, code={getattr(organization, 'code', 'N/A')}, parent_id={getattr(organization, 'parent_id', 'N/A')}")
    
    parents = get_all_parents(organization)
    logging.info(f"[PROJECT CODE] Found {len(parents)} parent(s) for organization {target.organization_id}")
    
    project_code_level = feature.is_active('project_code_level')
    filter_organization_id = target.organization_id  # Default to the organization itself
    
    if len(parents) > 0:
        # Organization has parents - use parent hierarchy
        for parent in parents:
            if hasattr(parent, 'code') and parent.code:
                organization_code = f'{organization_code}-{parent.code}'
                logging.info(f"[PROJECT CODE] Added parent code: {parent.code} (level: {getattr(parent, 'level', 'N/A')})")
                if project_code_level and hasattr(parent, 'level') and parent.level == project_code_level['level']:
                    filter_organization_id = parent.id
                    logging.info(f"[PROJECT CODE] Using parent {parent.id} for filter (matches project_code_level)")
    else:
        # Organization has no parents (top-level organization) - use the organization itself
        if hasattr(organization, 'code') and organization.code:
            organization_code = f'-{organization.code}'
            filter_organization_id = organization.id
            logging.info(f"[PROJECT CODE] No parents found, using organization code: {organization.code}")
        else:
            # Organization exists but has no code - this is an error
            logging.error(f"[PROJECT CODE] Organization {target.organization_id} exists but has no code and no parents. Cannot generate project code.")
            abort(422, message=messages.ORGANIZATION_NOT_FOUND)
    
    # Generate project code
    filters = {
        "organization_id": filter_organization_id,
        "is_deleted": "both"
    }
    logging.info(f"[PROJECT CODE] Looking for last project with filter: {filters}")
    last_project = Project.get_list(1, 1, "id", SORT_DESC, filters)
    if len(last_project) > 0:
        try:
            sequence = int(last_project[0].code.split("-")[0]) + 1
            logging.info(f"[PROJECT CODE] Found last project code: {last_project[0].code}, next sequence: {sequence}")
        except (ValueError, IndexError) as e:
            # If code format is unexpected, start from 1
            logging.warning(f"[PROJECT CODE] Could not parse last project code, starting from 1: {e}")
            sequence = 1
    else:
        logging.info(f"[PROJECT CODE] No previous projects found, starting sequence from 1")
    
    target.code = f'{sequence:05d}{organization_code}'
    logging.info(f"[PROJECT CODE] Generated project code: {target.code}")
