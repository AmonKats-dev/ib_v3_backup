import logging
from datetime import date

from app.constants import (FULL_ACCESS, SIMPLE_PROJECT, ProjectAction,
                           ProjectStatus, messages)
from app.core import BaseService, feature
from app.core.cerberus import check_permission, has_permission
from app.shared import db
from app.signals import (investment_updated, project_analysis_submitted,
                         project_created, project_data_changed,
                         project_dates_changed, project_moved_to_next_phase,
                         project_status_changed, project_updated)
from app.utils import validate_schema
from flask_jwt_extended import get_jwt_identity
from flask_restful import abort

from ..function import FunctionService
from ..fund import FundService
from ..phase import PhaseService
from ..workflow import WorkflowService
from .model import Project
from .resource import (ProjectActionView, ProjectBulkActionView, ProjectList,
                       ProjectView)
from .schema import ActionSchema, ProjectSchema


class ProjectService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.exclude = {'get_all': ['program']}
        self.model = Project
        self.schema = ProjectSchema
        self.action_schema = ActionSchema
        self.resources = [
            {'resource': ProjectList, 'url': '/projects'},
            {'resource': ProjectActionView,
                'url': '/projects/<int:record_id>/actions'},
            {'resource': ProjectBulkActionView,
                'url': '/projects/actions'},
            {'resource': ProjectView, 'url': '/projects/<int:record_id>'}
        ]

    def get_budgeted_projects(self, schema_fields=None):
        if schema_fields is None:
            schema_fields = ('id', 'budget_code', 'code',
                             'name', 'project_status')
        schema = self.schema(many=True, only=schema_fields)
        records = self.model.get_list(
            filter={"is_budgeted": True}, per_page=-1)
        return schema.dump(records)

    def create(self, data):
        schema = self.schema()
        data['phase_id'] = PhaseService().get_init_phase_id()
        workflow = WorkflowService().get_first_workflow_by_phase(
            data['phase_id'])
        data['workflow_id'] = workflow['id']
        data['current_step'] = workflow['step']
        data['max_step'] = workflow['step']
        
        # CRITICAL: Always set project_status to DRAFT for newly created projects
        # This ensures they don't appear in "Incoming" until they are explicitly submitted
        # Even if the workflow has a different project_status, new projects should start as DRAFT
        from app.constants import ProjectStatus
        data['project_status'] = ProjectStatus.DRAFT
        logging.info(f"[PROJECT CREATE] Set project_status to DRAFT for new project")
        print(f"[PROJECT CREATE] Set project_status to DRAFT for new project")
        
        # IMPORTANT: Projects belong to the User's Department (user's organization)
        # Hierarchy: User Vote (parent) -> User Department (user's org) -> Projects -> Programs
        # Multiple projects from the same vote can share one program
        
        # Set project's organization_id to user's department (user's organization)
        # This ensures each project belongs to the user's department within their vote
        user_department_id = None
        user_vote_id = None
        
        try:
            user = get_jwt_identity()
            logging.info(f"[PROJECT CREATE] JWT Identity: {user}")
            print(f"[PROJECT CREATE] JWT Identity: {user}")
            
            # Handle both dict and integer user identity
            user_id = None
            if isinstance(user, dict):
                user_id = user.get('id') or user.get('original_id')
            elif isinstance(user, int):
                user_id = user
            
            if user_id:
                from ..user.model import User
                from ..organization.model import Organization
                
                logging.info(f"[PROJECT CREATE] Looking up user with ID: {user_id}")
                print(f"[PROJECT CREATE] Looking up user with ID: {user_id}")
                user_record = User.query.get(user_id)
                if user_record and user_record.organization_id:
                    # Get user's organization (this is the user department)
                    user_org = Organization.query.get(user_record.organization_id)
                    if user_org:
                        # Set project's organization_id to user's department
                        user_department_id = user_org.id
                        data['organization_id'] = user_department_id
                        logging.info(f"[PROJECT CREATE] [OK] Set project organization_id to user department: {user_org.name} (ID: {user_org.id})")
                        print(f"[PROJECT CREATE] [OK] Set project organization_id to user department: {user_org.name} (ID: {user_org.id})")
                        
                        # Initialize additional_data if not present
                        if 'additional_data' not in data or data.get('additional_data') is None:
                            data['additional_data'] = {}
                        elif not isinstance(data['additional_data'], dict):
                            data['additional_data'] = {}
                        
                        # Store user department (user's organization)
                        data['additional_data']['user_department_id'] = user_org.id
                        data['additional_data']['user_department_name'] = user_org.name
                        data['additional_data']['user_department_code'] = user_org.code
                        
                        # Get user vote (parent organization of user's organization)
                        if user_org.parent_id:
                            parent_org = Organization.query.get(user_org.parent_id)
                            if parent_org:
                                user_vote_id = parent_org.id
                                data['additional_data']['user_vote_id'] = parent_org.id
                                data['additional_data']['user_vote_name'] = parent_org.name
                                data['additional_data']['user_vote_code'] = parent_org.code
                                logging.info(f"[PROJECT CREATE] [OK] Captured user vote: {parent_org.name} (ID: {parent_org.id}) and user department: {user_org.name} (ID: {user_org.id})")
                                print(f"[PROJECT CREATE] [OK] Captured user vote: {parent_org.name} (ID: {parent_org.id}) and user department: {user_org.name} (ID: {user_org.id})")
                            else:
                                logging.warning(f"[PROJECT CREATE] ⚠ User organization parent_id={user_org.parent_id} not found")
                                print(f"[PROJECT CREATE] ⚠ User organization parent_id={user_org.parent_id} not found")
                        else:
                            logging.info(f"[PROJECT CREATE] User organization has no parent (no vote)")
                            print(f"[PROJECT CREATE] User organization has no parent (no vote)")
                    else:
                        logging.warning(f"[PROJECT CREATE] ⚠ User organization_id={user_record.organization_id} not found")
                        print(f"[PROJECT CREATE] ⚠ User organization_id={user_record.organization_id} not found")
                else:
                    logging.warning(f"[PROJECT CREATE] ⚠ User {user_id} has no organization_id")
                    print(f"[PROJECT CREATE] ⚠ User {user_id} has no organization_id")
            else:
                logging.warning(f"[PROJECT CREATE] ⚠ Could not extract user_id from JWT identity: {user}")
                print(f"[PROJECT CREATE] ⚠ Could not extract user_id from JWT identity: {user}")
        except Exception as e:
            logging.error(f"[PROJECT CREATE] ❌ Exception capturing user vote/department: {e}", exc_info=True)
            print(f"[PROJECT CREATE] ❌ Exception capturing user vote/department: {e}")
            # Don't fail project creation if this fails, just log the error
        
        # If organization_id is still missing (fallback scenarios)
        # Note: This should rarely happen if user has organization_id set
        if 'organization_id' not in data or data.get('organization_id') is None:
            logging.warning(f"[PROJECT CREATE] organization_id still missing after user department assignment. Attempting fallback.")
            
            # Fallback 1: try to get from implementing_agencies
            if 'implementing_agencies' in data:
                implementing_agencies = data.get('implementing_agencies')
                if implementing_agencies and isinstance(implementing_agencies, list) and len(implementing_agencies) > 0:
                    first_agency = implementing_agencies[0]
                    if isinstance(first_agency, dict) and 'organization_id' in first_agency:
                        data['organization_id'] = first_agency['organization_id']
                        logging.info(f"[PROJECT CREATE] [OK] Set organization_id from implementing_agencies (fallback): {first_agency['organization_id']}")
                        print(f"[PROJECT CREATE] [OK] Set organization_id from implementing_agencies (fallback): {first_agency['organization_id']}")
            
            # Fallback 2: try to get from program's organization_ids
            # IMPORTANT: Only use this if user doesn't have organization_id set
            # And prefer organizations that match user's vote hierarchy if available
            if ('organization_id' not in data or data.get('organization_id') is None) and 'program_id' in data and data.get('program_id'):
                program_id = data.get('program_id')
                logging.warning(f"[PROJECT CREATE] ⚠ User has no organization_id. Attempting Fallback 2: Getting organization_id from program_id={program_id}")
                print(f"[PROJECT CREATE] ⚠ User has no organization_id. Attempting Fallback 2: Getting organization_id from program_id={program_id}")
                print(f"[PROJECT CREATE] ⚠ WARNING: This may result in incorrect organization assignment if program belongs to different vote!")
                
                try:
                    from ..program import ProgramService
                    program_service = ProgramService()
                    program = program_service.model.get_one(program_id)
                    logging.info(f"[PROJECT CREATE] Program lookup result: {program is not None}")
                    print(f"[PROJECT CREATE] Program lookup result: {program is not None}")
                    
                    if program:
                        logging.info(f"[PROJECT CREATE] Program found: id={getattr(program, 'id', 'N/A')}, has organization_ids attr: {hasattr(program, 'organization_ids')}")
                        print(f"[PROJECT CREATE] Program found: id={getattr(program, 'id', 'N/A')}, has organization_ids attr: {hasattr(program, 'organization_ids')}")
                        
                        if hasattr(program, 'organization_ids'):
                            org_ids_str = program.organization_ids
                            logging.info(f"[PROJECT CREATE] Program organization_ids value: {org_ids_str}")
                            print(f"[PROJECT CREATE] Program organization_ids value: {org_ids_str}")
                            
                            if org_ids_str:
                                # organization_ids is a comma-separated string
                                org_ids = [int(x.strip()) for x in org_ids_str.split(',') if x.strip()]
                                logging.info(f"[PROJECT CREATE] Parsed organization_ids: {org_ids}")
                                print(f"[PROJECT CREATE] Parsed organization_ids: {org_ids}")
                                
                                if org_ids and len(org_ids) > 0:
                                    # Try to find an organization that matches user's vote hierarchy
                                    selected_org_id = None
                                    
                                    # If we have user_vote_id, try to find an org that belongs to that vote
                                    if user_vote_id:
                                        for org_id in org_ids:
                                            try:
                                                org = Organization.query.get(org_id)
                                                if org:
                                                    # Check if this org or its parents match user_vote_id
                                                    current_org = org
                                                    while current_org:
                                                        if current_org.id == user_vote_id:
                                                            selected_org_id = org_id
                                                            logging.info(f"[PROJECT CREATE] [OK] Found organization {org_id} that matches user vote {user_vote_id}")
                                                            print(f"[PROJECT CREATE] [OK] Found organization {org_id} that matches user vote {user_vote_id}")
                                                            break
                                                        current_org = Organization.query.get(current_org.parent_id) if current_org.parent_id else None
                                                    if selected_org_id:
                                                        break
                                            except Exception as e:
                                                logging.warning(f"[PROJECT CREATE] ⚠ Error checking org {org_id}: {e}")
                                    
                                    # If no match found, use the first one (but log a warning)
                                    if not selected_org_id:
                                        selected_org_id = org_ids[0]
                                        logging.warning(f"[PROJECT CREATE] ⚠ No organization in program matches user vote. Using first org: {selected_org_id}")
                                        print(f"[PROJECT CREATE] ⚠ No organization in program matches user vote. Using first org: {selected_org_id}")
                                        print(f"[PROJECT CREATE] ⚠ WARNING: Project may be assigned to wrong vote! User should have organization_id set.")
                                    
                                    data['organization_id'] = selected_org_id
                                    logging.info(f"[PROJECT CREATE] [OK] Set organization_id from program.organization_ids (fallback): {selected_org_id}")
                                    print(f"[PROJECT CREATE] [OK] Set organization_id from program.organization_ids (fallback): {selected_org_id}")
                                else:
                                    logging.warning(f"[PROJECT CREATE] ⚠ Program has organization_ids but parsing resulted in empty list")
                                    print(f"[PROJECT CREATE] ⚠ Program has organization_ids but parsing resulted in empty list")
                            else:
                                logging.warning(f"[PROJECT CREATE] ⚠ Program found but organization_ids is empty/None")
                                print(f"[PROJECT CREATE] ⚠ Program found but organization_ids is empty/None")
                        else:
                            logging.warning(f"[PROJECT CREATE] ⚠ Program found but does not have organization_ids attribute")
                            print(f"[PROJECT CREATE] ⚠ Program found but does not have organization_ids attribute")
                    else:
                        logging.warning(f"[PROJECT CREATE] ⚠ Program with id={program_id} not found")
                        print(f"[PROJECT CREATE] ⚠ Program with id={program_id} not found")
                except Exception as e:
                    logging.error(f"[PROJECT CREATE] ❌ Exception getting organization_id from program: {e}", exc_info=True)
                    print(f"[PROJECT CREATE] ❌ Exception getting organization_id from program: {e}")
                    import traceback
                    print(traceback.format_exc())
            
            # Final check - if still missing, abort with clear error
            if 'organization_id' not in data or data.get('organization_id') is None:
                error_msg = "Could not set organization_id. User must have an organization_id set, provide implementing_agencies, or select a program with organization_ids."
                logging.error(f"[PROJECT CREATE] {error_msg}")
                print(f"[PROJECT CREATE] {error_msg}")
                abort(422, message=messages.ORGANIZATION_NOT_FOUND)
            
            # Validation: Verify selected organization_id matches user's vote hierarchy if available
            if user_vote_id and data.get('organization_id'):
                try:
                    selected_org = Organization.query.get(data['organization_id'])
                    if selected_org:
                        # Check if selected org belongs to user's vote hierarchy
                        org_belongs_to_vote = False
                        current_org = selected_org
                        depth = 0
                        while current_org and depth < 10:  # Prevent infinite loops
                            if current_org.id == user_vote_id:
                                org_belongs_to_vote = True
                                break
                            current_org = Organization.query.get(current_org.parent_id) if current_org.parent_id else None
                            depth += 1
                        
                        if not org_belongs_to_vote:
                            logging.warning(f"[PROJECT CREATE] ⚠ Selected organization_id {data['organization_id']} ({selected_org.name}) does not belong to user's vote {user_vote_id}")
                            print(f"[PROJECT CREATE] ⚠ WARNING: Selected organization_id {data['organization_id']} ({selected_org.name}) does not belong to user's vote {user_vote_id}")
                            print(f"[PROJECT CREATE] ⚠ This may cause incorrect project assignment. User should have organization_id set in their profile.")
                        else:
                            logging.info(f"[PROJECT CREATE] [OK] Verified organization_id {data['organization_id']} belongs to user's vote {user_vote_id}")
                            print(f"[PROJECT CREATE] [OK] Verified organization_id {data['organization_id']} belongs to user's vote {user_vote_id}")
                except Exception as e:
                    logging.warning(f"[PROJECT CREATE] ⚠ Could not validate organization_id against user vote: {e}")
                    print(f"[PROJECT CREATE] ⚠ Could not validate organization_id against user vote: {e}")
        
        # Verify that the selected program is accessible within the user's vote hierarchy
        # Multiple projects from the same vote can share one program, so we just verify the program exists
        if 'program_id' in data and data.get('program_id'):
            try:
                from ..program import ProgramService
                program_service = ProgramService()
                program = program_service.model.get_one(data['program_id'])
                if not program:
                    logging.warning(f"[PROJECT CREATE] ⚠ Program {data['program_id']} not found, but continuing (program may be shared across votes)")
                    print(f"[PROJECT CREATE] ⚠ Program {data['program_id']} not found, but continuing (program may be shared across votes)")
                else:
                    logging.info(f"[PROJECT CREATE] [OK] Program {program.name} (ID: {program.id}) verified - can be shared by multiple projects")
                    print(f"[PROJECT CREATE] [OK] Program {program.name} (ID: {program.id}) verified - can be shared by multiple projects")
            except Exception as e:
                logging.warning(f"[PROJECT CREATE] ⚠ Exception verifying program: {e}")
                print(f"[PROJECT CREATE] ⚠ Exception verifying program: {e}")
        
        # Log final state before validation
        logging.info(f"[PROJECT CREATE] Before validation - organization_id: {data.get('organization_id')}, program_id: {data.get('program_id')}")
        print(f"[PROJECT CREATE] Before validation - organization_id: {data.get('organization_id')}, program_id: {data.get('program_id')}")
        
        validated_data = validate_schema(data, schema)
        if validated_data:
            # CRITICAL: Ensure project_status is DRAFT after validation (override any value from frontend)
            # New projects must always start as DRAFT, regardless of what the frontend sends
            from app.constants import ProjectStatus
            validated_data['project_status'] = ProjectStatus.DRAFT
            logging.info(f"[PROJECT CREATE] Enforced project_status=DRAFT after validation (overriding any frontend value)")
            print(f"[PROJECT CREATE] Enforced project_status=DRAFT after validation (overriding any frontend value)")
            
            record = self.model.create(**validated_data)
            project = schema.dump(record)
            
            # CRITICAL: Verify project_status is DRAFT after creation
            if project.get('project_status') != ProjectStatus.DRAFT.value:
                logging.error(f"[PROJECT CREATE] CRITICAL: Project created with wrong status! Expected DRAFT, got {project.get('project_status')}")
                print(f"[PROJECT CREATE] CRITICAL: Project created with wrong status! Expected DRAFT, got {project.get('project_status')}")
                # Force it to DRAFT in the database
                record.project_status = ProjectStatus.DRAFT
                db.session.commit()
                project = schema.dump(record)
                logging.info(f"[PROJECT CREATE] Fixed project_status to DRAFT in database")
                print(f"[PROJECT CREATE] Fixed project_status to DRAFT in database")
            else:
                logging.info(f"[PROJECT CREATE] Verified: Project created with DRAFT status (ID: {project.get('id')})")
                print(f"[PROJECT CREATE] Verified: Project created with DRAFT status (ID: {project.get('id')})")
            
            data.update(self._set_prev_state(project, workflow['step']))
            project_created.send(project=project, **data)
            return project

    def update(self, record_id, data, partial=False):
        project = super().update(record_id, data, partial=partial)
        project_updated.send(project=project, **data)
        return project

    def _set_prev_state(self, project, next_step):
        return {
            'prev_workflow_id': project['workflow_id'],
            'prev_step': project['current_step'],
            'prev_phase_id': project['phase_id'],
            'max_step': next_step if next_step > project['max_step'] else project['max_step']
        }
    
    def _get_workflow_step(self, project):
        """Safely get workflow step from project, handling both dict and int workflow types."""
        workflow = project.get('workflow')
        if isinstance(workflow, int):
            # If workflow is just an ID, use current_step from project
            return project.get('current_step')
        elif isinstance(workflow, dict):
            # If workflow is a dict, get step from it
            return workflow.get('step')
        else:
            # Fallback: use current_step from project
            return project.get('current_step')

    @check_permission('submit_project')
    def submit_project(self, project, project_detail_id, reason=None,
                       issues=None, recommendations=None):
        logger = logging.getLogger(__name__)
        import sys
        sys.stdout.write("=" * 80 + "\n")
        sys.stdout.write("[PROJECT SUBMIT] Starting project submission\n")
        sys.stdout.write("=" * 80 + "\n")
        sys.stdout.flush()
        print("=" * 80)
        print("[PROJECT SUBMIT] Starting project submission")
        print("=" * 80)
        logger.info("=" * 80)
        logger.info("[PROJECT SUBMIT] Starting project submission")
        logger.info("=" * 80)
        
        try:
            # Get current user info
            try:
                user = get_jwt_identity()
                # Handle both dict and integer user identity
                if isinstance(user, dict):
                    user_id = user.get('id') or user.get('original_id')
                    username = user.get('username')
                elif isinstance(user, int):
                    user_id = user
                    username = None
                else:
                    user_id = None
                    username = None
                print(f"[PROJECT SUBMIT] User: {username} (ID: {user_id})")
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] User: {username} (ID: {user_id})")
            except Exception as e:
                print(f"[PROJECT SUBMIT] Could not get user identity: {e}")
                sys.stdout.flush()
                logger.warning(f"[PROJECT SUBMIT] Could not get user identity: {e}")
                user_id = None
                username = None
            
            # Log project details
            project_id = project.get('id')
            project_name = project.get('name')
            project_org_id = project.get('organization_id')
            current_status = project.get('project_status')
            current_step = project.get('current_step')
            workflow_id = project.get('workflow_id')
            
            print(f"[PROJECT SUBMIT] Project ID: {project_id}")
            print(f"[PROJECT SUBMIT] Project Name: {project_name}")
            print(f"[PROJECT SUBMIT] Project Organization ID: {project_org_id}")
            print(f"[PROJECT SUBMIT] Current Status: {current_status}")
            print(f"[PROJECT SUBMIT] Current Step: {current_step}")
            print(f"[PROJECT SUBMIT] Workflow ID: {workflow_id}")
            print(f"[PROJECT SUBMIT] Project Detail ID: {project_detail_id}")
            sys.stdout.flush()
            logger.info(f"[PROJECT SUBMIT] Project ID: {project_id}")
            logger.info(f"[PROJECT SUBMIT] Project Name: {project_name}")
            logger.info(f"[PROJECT SUBMIT] Project Organization ID: {project_org_id}")
            logger.info(f"[PROJECT SUBMIT] Current Status: {current_status}")
            logger.info(f"[PROJECT SUBMIT] Current Step: {current_step}")
            logger.info(f"[PROJECT SUBMIT] Workflow ID: {workflow_id}")
            logger.info(f"[PROJECT SUBMIT] Project Detail ID: {project_detail_id}")
            
            if not project.get('workflow'):
                error_msg = f"[PROJECT SUBMIT] Workflow not found for project {project_id}"
                print(error_msg)
                sys.stdout.flush()
                logger.error(error_msg)
                abort(422, message="Workflow not found for this project")
            
            current_step = self._get_workflow_step(project)
            if not current_step:
                error_msg = f"[PROJECT SUBMIT] Workflow step not found for project {project_id}"
                print(error_msg)
                sys.stdout.flush()
                logger.error(error_msg)
                abort(422, message="Workflow step not found for this project")
            
            print(f"[PROJECT SUBMIT] Current workflow step: {current_step}")
            sys.stdout.flush()
            logger.info(f"[PROJECT SUBMIT] Current workflow step: {current_step}")
            
            workflow_service = WorkflowService()
            was_approved = False
            if self._was_conditionally_approved(project.get('additional_data')):
                was_approved = True
                logger.info(f"[PROJECT SUBMIT] Project was conditionally approved")
            
            next_workflow = workflow_service.get_next_step(
                current_step, project['phase_id'],
                self._was_revised_by_ipr(project.get('additional_data')),
                was_approved
            )
            
            if next_workflow is not None:
                print(f"[PROJECT SUBMIT] Next workflow found: ID={next_workflow.get('id')}, Step={next_workflow.get('step')}, Role ID={next_workflow.get('role_id')}")
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] Next workflow found: ID={next_workflow.get('id')}, Step={next_workflow.get('step')}, Role ID={next_workflow.get('role_id')}")
                
                # CRITICAL: Preserve the original organization_id - it should NEVER change during submission
                original_org_id = project.get('organization_id')
                if not original_org_id:
                    # Try to get from nested organization object
                    project_org = project.get('project_organization') or project.get('organization')
                    if project_org:
                        if isinstance(project_org, dict):
                            original_org_id = project_org.get('id')
                        elif hasattr(project_org, 'id'):
                            original_org_id = project_org.id
                
                print(f"[PROJECT SUBMIT] Original organization_id before update: {original_org_id}")
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] Original organization_id before update: {original_org_id}")
                
                data = {'action': ProjectAction.SUBMIT,
                    'workflow_id': next_workflow['id'],
                    'current_step': next_workflow['step'],
                    'project_status': ProjectStatus.SUBMITTED}
                data.update(self._set_prev_state(project, next_workflow['step']))
                if reason is not None:
                    data['reason'] = reason
                    logger.info(f"[PROJECT SUBMIT] Reason provided: {reason}")
                
                # CRITICAL: Ensure organization_id is NOT in update data (it should never change)
                if 'organization_id' in data:
                    logger.warning(f"[PROJECT SUBMIT] WARNING: organization_id found in update data! Removing it to preserve original value.")
                    data.pop('organization_id')
                
                print(f"[PROJECT SUBMIT] Update data: {data}")
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] Update data: {data}")
                
                # Handle workflow_additional_data - workflow might be int or dict
                workflow = project.get('workflow')
                workflow_additional_data = None
                if isinstance(workflow, dict):
                    workflow_additional_data = workflow.get('additional_data')
                if (workflow_additional_data and
                        'submit_project_analysis' in workflow_additional_data):
                    logger.info(f"[PROJECT SUBMIT] Sending project_analysis_submitted signal")
                    project_analysis_submitted.send(
                        project=project, issues=issues, recommendations=recommendations, project_detail_id=project_detail_id)
                if project['current_step'] == 1:
                    data['submission_date'] = date.today().strftime("%Y-%m-%d")
                    logger.info(f"[PROJECT SUBMIT] Setting submission_date: {data['submission_date']}")
                
                print(f"[PROJECT SUBMIT] Updating project {project_id} with new status: SUBMITTED")
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] Updating project {project_id} with new status: SUBMITTED")
                project = self.update(project['id'], data, partial=True)
                
                # Log updated project details
                updated_project_id = project.get('id') if isinstance(project, dict) else project.id if hasattr(project, 'id') else None
                updated_project_org_id = project.get('organization_id') if isinstance(project, dict) else project.organization_id if hasattr(project, 'organization_id') else None
                updated_status = project.get('project_status') if isinstance(project, dict) else project.project_status.value if hasattr(project, 'project_status') else None
                updated_step = project.get('current_step') if isinstance(project, dict) else project.current_step if hasattr(project, 'current_step') else None
                
                print(f"[PROJECT SUBMIT] Project updated successfully")
                print(f"[PROJECT SUBMIT] Updated Project ID: {updated_project_id}")
                print(f"[PROJECT SUBMIT] Updated Organization ID: {updated_project_org_id}")
                print(f"[PROJECT SUBMIT] Original Organization ID: {original_org_id}")
                print(f"[PROJECT SUBMIT] Updated Status: {updated_status}")
                print(f"[PROJECT SUBMIT] Updated Step: {updated_step}")
                print(f"[PROJECT SUBMIT] Next Workflow Role ID: {next_workflow.get('role_id')}")
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] Project updated successfully")
                logger.info(f"[PROJECT SUBMIT] Updated Project ID: {updated_project_id}")
                logger.info(f"[PROJECT SUBMIT] Updated Organization ID: {updated_project_org_id}")
                logger.info(f"[PROJECT SUBMIT] Original Organization ID: {original_org_id}")
                logger.info(f"[PROJECT SUBMIT] Updated Status: {updated_status}")
                logger.info(f"[PROJECT SUBMIT] Updated Step: {updated_step}")
                logger.info(f"[PROJECT SUBMIT] Next Workflow Role ID: {next_workflow.get('role_id')}")
                
                # CRITICAL: Use original_org_id if updated_project_org_id is missing or different
                # This ensures we always use the correct organization_id for notifications
                final_org_id = updated_project_org_id or original_org_id
                if updated_project_org_id and original_org_id and updated_project_org_id != original_org_id:
                    logger.error(f"[PROJECT SUBMIT] ERROR: Organization ID changed during update! Original: {original_org_id}, Updated: {updated_project_org_id}. Using original.")
                    final_org_id = original_org_id
                
                # CRITICAL: Ensure project dict has organization_id at top level for notification service
                # The schema dump might not include it or might nest it, so we explicitly ensure it's present
                if isinstance(project, dict):
                    if not project.get('organization_id') and final_org_id:
                        project['organization_id'] = final_org_id
                        logger.info(f"[PROJECT SUBMIT] Added organization_id to project dict: {final_org_id}")
                    elif project.get('organization_id') != final_org_id and final_org_id:
                        logger.warning(f"[PROJECT SUBMIT] Project dict has different organization_id ({project.get('organization_id')}) than expected ({final_org_id}). Using expected value.")
                        project['organization_id'] = final_org_id
                else:
                    # If project is an object, convert to dict with organization_id
                    from ..project.schema import ProjectSchema
                    schema = ProjectSchema()
                    project = schema.dump(project)
                    if not project.get('organization_id') and final_org_id:
                        project['organization_id'] = final_org_id
                        logger.info(f"[PROJECT SUBMIT] Added organization_id to serialized project: {final_org_id}")
                
                print(f"[PROJECT SUBMIT] Final project organization_id before signal: {project.get('organization_id')}")
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] Final project organization_id before signal: {project.get('organization_id')}")
                print(f"[PROJECT SUBMIT] Sending project_status_changed signal")
                print(f"[PROJECT SUBMIT] Signal will trigger notification to role_id={next_workflow.get('role_id')} in organization_id={project.get('organization_id')}")
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] Sending project_status_changed signal")
                logger.info(f"[PROJECT SUBMIT] Signal will trigger notification to role_id={next_workflow.get('role_id')} in organization_id={project.get('organization_id')}")
                
                project_status_changed.send(
                    project=project, workflow=next_workflow)
                
                print(f"[PROJECT SUBMIT] Signal sent successfully")
                print("=" * 80)
                print("[PROJECT SUBMIT] Submission completed successfully")
                print("=" * 80)
                sys.stdout.flush()
                logger.info(f"[PROJECT SUBMIT] Signal sent successfully")
                logger.info("=" * 80)
                logger.info("[PROJECT SUBMIT] Submission completed successfully")
                logger.info("=" * 80)
                
                return project
            else:
                error_msg = f"[PROJECT SUBMIT] No next workflow step found for project {project_id}, current_step={current_step}"
                print(error_msg)
                sys.stdout.flush()
                logger.error(error_msg)
                abort(422, message="No next workflow step found. Cannot submit project.")
        except Exception as e:
            error_msg = f"[PROJECT SUBMIT] Exception during submission: {e}"
            print(error_msg)
            sys.stdout.flush()
            logger.error(error_msg, exc_info=True)
            import traceback
            traceback.print_exc()
            raise

    @check_permission('assign_project')
    def assign_project(self, project, reason=None, assigned_user_id=None):
        workflow_service = WorkflowService()
        current_step = self._get_workflow_step(project)
        if not current_step:
            abort(422, message="Workflow step not found for this project")
        next_workflow = workflow_service.get_next_step(
            current_step, project['phase_id'],
            self._was_revised_by_ipr(project.get('additional_data'))
        )
        if next_workflow is not None:
            data = {'action': ProjectAction.ASSIGN,
                    'workflow_id': next_workflow['id'],
                    'current_step': next_workflow['step'],
                    'assigned_user_id': assigned_user_id,
                    'project_status': ProjectStatus.ASSIGNED}
            data.update(self._set_prev_state(project, next_workflow['step']))
            if reason is not None:
                data['reason'] = reason
            project = self.update(project['id'], data, partial=True)
            project_status_changed.send(
                project=project, workflow=next_workflow)
            return project

    @check_permission('approve_project')
    def approve_project(self, project, reason=None, evaluation_period=None, was_approved=False):
        workflow_service = WorkflowService()
        data = {'action': ProjectAction.APPROVE}
        if reason is not None:
            data['reason'] = reason
        current_step = self._get_workflow_step(project)
        if not current_step:
            abort(422, message="Workflow step not found for this project")
        next_workflow = workflow_service.get_next_step(
            current_step, project['phase_id'],
            self._was_revised_by_ipr(project.get('additional_data')),
            was_approved
        )

        if next_workflow is not None:
            data['workflow_id'] = next_workflow['id']
            data['current_step'] = next_workflow['step']
            if was_approved:
                if project['additional_data'] is not None:
                    data['additional_data'] = dict(project['additional_data'])
                else:
                    data['additional_data'] = dict()
                data['additional_data']['was_approved'] = True
                data['project_status'] = ProjectStatus.CONDITIONALLY_APPROVED
            else:
                data['project_status'] = next_workflow['project_status']
            data.update(self._set_prev_state(project, next_workflow['step']))
            project = self.update(project['id'], data, partial=True)
            project_status_changed.send(
                project=project, workflow=next_workflow)
            return project
        else:
            in_post_evaluation = False
            simple_project_last_phase = feature.is_active(
                'simple_project_last_phase')
            last_phase = workflow_service.get_last_workflow_by_phase()
            next_phase_id = project['phase_id']+1
            next_step = project['current_step']+1
            project_status = ProjectStatus.COMPLETED.value
            if next_step > last_phase['step']:
                next_phase_id = project['phase_id']
                init_workflow = project['workflow']
            elif (next_step == last_phase['step']
                  and 'post_evaluation' in last_phase
                  and last_phase['post_evaluation']
                  and (evaluation_period is None or evaluation_period == 0)):
                next_phase_id = project['phase_id']
                init_workflow = project['workflow']
            else:
                if (simple_project_last_phase
                        and project['project_type'] == SIMPLE_PROJECT
                        and next_phase_id > simple_project_last_phase['phase_id']):
                    next_phase_id = project['phase_id']
                    init_workflow = project['workflow']
                else:
                    init_workflow = workflow_service.get_first_workflow_by_phase(
                        next_phase_id)
                    project_status = init_workflow['project_status']
                    in_post_evaluation = True
            data['phase_id'] = next_phase_id
            data['project_status'] = project_status
            data['workflow_id'] = init_workflow['id']
            data['current_step'] = init_workflow['step']
            data['assigned_user_id'] = None
            if project['additional_data']:
                data['additional_data'] = dict(project['additional_data'])
                if 'was_revised_by_ipr' in project['additional_data']:
                    data['additional_data'].pop('was_revised_by_ipr', None)
                if 'was_approved' in project['additional_data']:
                    data['additional_data'].pop('was_approved', None)
            data.update(self._set_prev_state(project, init_workflow['step']))
            project = self.update(project['id'], data, partial=True)
            if project_status is not ProjectStatus.COMPLETED.value:
                project_moved_to_next_phase.send(project=project)
            project_status_changed.send(
                project=project, workflow=init_workflow)
            return project

    @check_permission('revise_project')
    def revise_project(self, project, reason=None):
        # Handle both dict and int workflow types
        workflow = project.get('workflow')
        if isinstance(workflow, int):
            # If workflow is just an ID, fetch the full workflow object
            workflow_service = WorkflowService()
            current_workflow = workflow_service.model.get_one(workflow)
            if current_workflow:
                current_workflow = workflow_service.schema().dump(current_workflow)
            else:
                abort(422, message="Workflow not found for this project")
        elif isinstance(workflow, dict):
            current_workflow = workflow
        else:
            abort(422, message="Workflow not found for this project")
        
        revised_workflow = current_workflow.get('revised_workflow')
        if not revised_workflow:
            abort(422, message="Revised workflow not found for this project")
        
        user = get_jwt_identity()
        data = {'action': ProjectAction.REVISE,
                'project_status': ProjectStatus.REVISED,
                'workflow_id': current_workflow.get('revise_to_workflow_id'),
                'revised_user_role_id': user["current_role"]["role_id"],
                'current_step': revised_workflow.get('step')}
        if reason is not None:
            data['reason'] = reason
        if current_workflow.get('is_ipr'):
            data['additional_data'] = {'was_revised_by_ipr': True}
        data.update(self._set_prev_state(project, revised_workflow.get('step')))
        project = self.update(project['id'], data, partial=True)
        project_status_changed.send(
            project=project, workflow=revised_workflow)
        return project

    @check_permission('reject_project')
    def reject_project(self, project, reason=None):
        data = {'action': ProjectAction.REJECT,
                'project_status': ProjectStatus.REJECTED}
        if reason is not None:
            data['reason'] = reason
        data.update(self._set_prev_state(project, project['current_step']))
        project = self.update(project['id'], data, partial=True)
        project_status_changed.send(
            project=project, workflow=project['workflow'])
        return project

    @check_permission('revert_project')
    def revert_project(self, project, reason=None):
        workflow_service = WorkflowService()
        data = {'action': ProjectAction.REVERT}
        current_step = self._get_workflow_step(project)
        if not current_step:
            abort(422, message="Workflow step not found for this project")
        prev_workflow = workflow_service.get_prev_step_in_phase(
            current_step, project['phase_id'])
        if reason is not None:
            data['reason'] = reason
        if project['project_status'] == ProjectStatus.REJECTED.name:
            data['project_status'] = prev_workflow['project_status']
            data.update(self._set_prev_state(
                project, current_step))
            project = self.update(project['id'], data, partial=True)
        elif prev_workflow is not None:
            data['workflow_id'] = prev_workflow['id']
            data['current_step'] = prev_workflow['step']
            data['project_status'] = prev_workflow['project_status']
            data.update(self._set_prev_state(project, prev_workflow['step']))
            project = self.update(project['id'], data, partial=True)
        return project

    def _validate_project_action(self, project, action):
        # Ensure action is an enum instance
        if isinstance(action, str):
            try:
                action = ProjectAction(action)
            except ValueError:
                return False
        
        # Check if action is in workflow actions list
        workflow = project.get('workflow', {})
        if not workflow:
            return False
        
        # Handle case where workflow might be an integer (workflow_id) instead of a dict
        if isinstance(workflow, int):
            # If workflow is just an ID, we need to fetch the workflow object
            workflow_service = WorkflowService()
            workflow_obj = workflow_service.model.get_one(workflow)
            if not workflow_obj:
                return False
            # Serialize the workflow object
            workflow_schema = workflow_service.schema()
            workflow = workflow_schema.dump(workflow_obj)
        
        # Ensure workflow is a dictionary before accessing its properties
        if not isinstance(workflow, dict):
            return False
            
        workflow_actions = workflow.get('actions', [])
        if not workflow_actions:
            return False
            
        # Convert workflow actions to strings if they're not already
        action_strings = [a if isinstance(a, str) else a.value if hasattr(a, 'value') else str(a) 
                         for a in workflow_actions]
        
        # Check if the action is allowed in the workflow
        # REVERT is always allowed (can revert from any step)
        if (action.value in action_strings or
                action == ProjectAction.REVERT):
            user = get_jwt_identity()
            if has_permission(FULL_ACCESS):
                return True
            
            # Handle case where user might be an integer (user_id) or dict
            if user:
                current_role = None
                if isinstance(user, int):
                    # User is just an ID, need to query for role
                    from ..user_role.model import UserRole
                    user_role = UserRole.query.filter_by(user_id=user, is_approved=True).first()
                    if user_role:
                        current_role = {'role_id': user_role.role_id}
                elif isinstance(user, dict):
                    # User is a dict with current_role
                    current_role = user.get("current_role")
                
                if current_role:
                    # Handle both cases: current_role can be a dict or an integer (role_id)
                    if isinstance(current_role, dict):
                        user_role_id = current_role.get("role_id")
                    elif isinstance(current_role, int):
                        user_role_id = current_role
                    else:
                        user_role_id = None
                    
                    if user_role_id and user_role_id == workflow.get('role_id'):
                        return True
        return False

    def _was_revised_by_ipr(self, additional_data):
        if additional_data and 'was_revised_by_ipr' in additional_data:
            return True
        return False

    def _was_conditionally_approved(self, additional_data):
        if additional_data and 'was_approved' in additional_data:
            return True
        return False

    def _check_if_donor_funded(self, fund_ids):
        funds = FundService().get_all(filters={'ids': fund_ids})
        for fund in funds:
            if fund['is_donor']:
                return True
        return False

    def manage_bulk_actions(self, data):
        projects_approved = []
        if 'project_ids' in data:
            for project_id in data['project_ids']:
                try:
                    self.manage_actions(project_id, data)
                    projects_approved.append(project_id)
                except:
                    logging.error(
                        f'Project: {project_id}  was not updated during bulk action update')
        return projects_approved

    def manage_actions(self, project_id, data):
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"manage_actions called - project_id: {project_id}, data: {data}")
        
        try:
            # ActionSchema is a class, instantiate it
            action_schema_instance = self.action_schema()
            validated_data = validate_schema(data, action_schema_instance)
            logger.info(f"manage_actions - validated_data: {validated_data}")
            logger.info(f"manage_actions - validated_data['action'] type: {type(validated_data.get('action'))}")
            logger.info(f"manage_actions - validated_data['action'] value: {validated_data.get('action')}")
            
            if not validated_data:
                logger.error("manage_actions - validated_data is empty or None")
                abort(422, message="Invalid action data provided")
        except Exception as e:
            logger.error(f"manage_actions - Error during validation: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            raise
        
        reason = None
        issues = None
        recommendations = None
        assigned_user_id = None
        if validated_data:
            if 'reason' in validated_data:
                reason = validated_data['reason']
            if 'issues' in validated_data:
                issues = validated_data['issues']
            if 'recommendations' in validated_data:
                recommendations = validated_data['recommendations']
            if 'assigned_user_id' in validated_data:
                assigned_user_id = validated_data['assigned_user_id']
            record = self.model.get_one(project_id)
            if record is None:
                abort(404, message=messages.NOT_FOUND)
            
            # Get evaluation_period and current_project_detail_id safely
            evaluation_period = None
            current_project_detail_id = None
            if record.current_project_detail:
                evaluation_period = record.current_project_detail.evaluation_period
                current_project_detail_id = record.current_project_detail.id
            
            project = self.schema().dump(record)
            if project['project_status'] == ProjectStatus.COMPLETED.value:
                abort(422, message=messages.COMPLETED_PROJECT_ERROR)
            if not project.get('workflow'):
                abort(422, message="Workflow not found for this project")
            # Ensure action is a ProjectAction enum for comparison
            action = validated_data['action']
            if isinstance(action, str):
                try:
                    action = ProjectAction(action)
                except ValueError:
                    logger.error(f"manage_actions - Invalid action string: {action}")
                    abort(422, message=f"Invalid action: {action}")
            
            logger.info(f"manage_actions - Processing action: {action}, type: {type(action)}")
            
            if self._validate_project_action(project, action):
                try:
                    if action == ProjectAction.REVERT:
                        return self.revert_project(project, reason)
                    elif action == ProjectAction.SUBMIT:
                        return self.submit_project(project, current_project_detail_id,
                                                   reason, issues, recommendations)
                    elif action == ProjectAction.ASSIGN:
                        return self.assign_project(project, reason, assigned_user_id)
                    elif (action == ProjectAction.APPROVE or
                          action == ProjectAction.ALLOCATE_FUNDS or
                          action == ProjectAction.COMPLETE):
                        return self.approve_project(project, reason, evaluation_period)
                    elif action == ProjectAction.CONDITIONALLY_APPROVE:
                        return self.approve_project(project, reason, evaluation_period, True)
                    elif action == ProjectAction.REJECT:
                        return self.reject_project(project, reason)
                    elif action == ProjectAction.REVISE:
                        return self.revise_project(project, reason)
                    else:
                        logger.error(f"manage_actions - Unhandled action: {action}")
                        abort(422, message=f"Action {action} is not supported")
                except Exception as e:
                    logger.error(f"manage_actions - Error processing action {action}: {str(e)}")
                    import traceback
                    logger.error(traceback.format_exc())
                    raise
            else:
                logger.warning(f"manage_actions - Action {action} not validated for project {project_id}")
                abort(403, message="You do not have permission to perform this action")


@investment_updated.connect
def update_project_funds(self, project_id, fund_ids, **kwargs):
    service = ProjectService()
    fund_ids_string = ','.join(map(str, fund_ids))
    data = {
        'fund_ids': fund_ids_string,
        'is_donor_funded': service._check_if_donor_funded(fund_ids)
    }

    service.update(project_id, data, partial=True)


@project_dates_changed.connect
def update_project_dates(self, project_id, start_date, end_date):
    service = ProjectService()
    data = {
        'start_date': start_date,
        'end_date': end_date
    }
    service.update(project_id, data, partial=True)


@project_data_changed.connect
def update_project_data(self, project_id, data):
    service = ProjectService()
    data_to_update = dict()
    if 'name' in data:
        data_to_update['name'] = data['name']
    if 'function_id' in data:
        data_to_update['function_id'] = data['function_id']
    if 'program_id' in data:
        data_to_update['program_id'] = data['program_id']
    service.update(project_id, data_to_update, partial=True)
