from datetime import datetime

from app.constants import FULL_ACCESS, PER_PAGE, SINGLE_RECORD, messages
from app.core.cerberus import has_permission
from app.logger import log_message
from app.shared import db
from flask import current_app as app
from flask_jwt_extended import get_jwt_identity
from flask_restful import abort
from sqlalchemy import asc, desc, exc
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import expression, func


class AuditMixin(object):
    @declared_attr
    def created_on(self):
        if self._has_meta_data:
            return db.Column(db.DateTime, default=func.now())

    @declared_attr
    def modified_on(self):
        if self._has_meta_data:
            return db.Column(db.DateTime, default=func.now())

    @declared_attr
    def created_by(self):
        if self._has_meta_data:
            return db.Column(db.Integer, nullable=False)

    @declared_attr
    def modified_by(self):
        if self._has_meta_data:
            return db.Column(db.Integer, nullable=True)


class DataMixin(object):
    @declared_attr
    def additional_data(self):
        if self._has_additional_data:
            return db.Column(db.JSON, nullable=True)


class ArchiveMixin(object):
    @declared_attr
    def is_deleted(self):
        if self._has_archive:
            return db.Column(db.Boolean,
                             server_default=expression.false(),
                             nullable=False)


class BaseModel(AuditMixin, DataMixin, ArchiveMixin, db.Model):
    __abstract__ = True
    _has_archive = False
    _has_meta_data = True
    _has_additional_data = False
    _archive_permission = None
    _default_sort_field = 'id'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    @declared_attr
    def __tablename__(self):
        return self.__name__.lower()

    def to_dict(self):
        state = self.__dict__.copy()
        del state['_sa_instance_state']
        return state

    @classmethod
    def get_list(self, page=1, per_page=PER_PAGE,
                 sort_field=None, sort_order='ASC', filter=dict()):
        import logging
        logger = logging.getLogger(__name__)
        
        # Log if this is an INCOMING request
        is_incoming = filter.get('action') == 'INCOMING' if filter else False
        if is_incoming:
            print("=" * 80)
            print("[GET_LIST] INCOMING request detected")
            print(f"[GET_LIST] Filter: {filter}")
            print("=" * 80)
            logger.info("=" * 80)
            logger.info("[GET_LIST] INCOMING request detected")
            logger.info(f"[GET_LIST] Filter: {filter}")
            logger.info("=" * 80)
        
        result = []
        if sort_field is None:
            sort_field = self._default_sort_field
        query = self.query
        
        # Get and log access filters
        access_filters = self.get_access_filters(self, filter=filter)
        if is_incoming:
            print(f"[GET_LIST] Access filters count: {len(access_filters)}")
            logger.info(f"[GET_LIST] Access filters count: {len(access_filters)}")
            for i, f in enumerate(access_filters):
                print(f"[GET_LIST] Access filter {i}: {f}")
                logger.info(f"[GET_LIST] Access filter {i}: {f}")
        query = query.filter(*access_filters)

        # Get and log regular filters
        regular_filters = self.get_filters(self, filter)
        if is_incoming:
            print(f"[GET_LIST] Regular filters count: {len(regular_filters)}")
            logger.info(f"[GET_LIST] Regular filters count: {len(regular_filters)}")
            for i, f in enumerate(regular_filters):
                print(f"[GET_LIST] Regular filter {i}: {f}")
                logger.info(f"[GET_LIST] Regular filter {i}: {f}")
        query = query.filter(*regular_filters)
        
        # For INCOMING requests, log the final SQL query for debugging
        if is_incoming:
            try:
                from sqlalchemy.dialects import postgresql
                compiled_query = str(query.statement.compile(compile_kwargs={"literal_binds": True}))
                print(f"[GET_LIST] SQL Query: {compiled_query}")
                logger.info(f"[GET_LIST] SQL Query: {compiled_query}")
            except Exception as sql_err:
                # If literal_binds fails, just print the statement
                print(f"[GET_LIST] SQL Query: {query.statement}")
                logger.info(f"[GET_LIST] SQL Query: {query.statement}")
                print(f"[GET_LIST] SQL compilation error: {sql_err}")
                logger.warning(f"[GET_LIST] SQL compilation error: {sql_err}")

        if sort_order is not None:
            sort_order = sort_order.upper()
        order_direction = desc if sort_order == 'DESC' else asc
        
        # Log the SQL query for INCOMING requests
        if is_incoming:
            try:
                sql_query = str(query.statement)
                print(f"[GET_LIST] SQL Query: {sql_query}")
                logger.info(f"[GET_LIST] SQL Query: {sql_query}")
            except Exception as e:
                print(f"[GET_LIST] Could not get SQL query: {e}")
                logger.info(f"[GET_LIST] Could not get SQL query: {e}")
        
        try:
            if per_page is -1:
                result = query.order_by(order_direction(sort_field)).all()
            else:
                result = query.order_by(order_direction(sort_field)).paginate(
                    page,
                    per_page,
                    error_out=False
                ).items
            
            # Log results for INCOMING requests
            if is_incoming:
                # Get current user's organization_id to check for cross-org leaks
                from flask_jwt_extended import get_jwt_identity
                current_user_org_id = None
                try:
                    user = get_jwt_identity()
                    if isinstance(user, int):
                        from app.rest.v1.user.model import User
                        user_record = User.query.get(user)
                        if user_record:
                            current_user_org_id = user_record.organization_id
                    elif isinstance(user, dict):
                        user_id = user.get('id') or user.get('original_id')
                        if user_id:
                            from app.rest.v1.user.model import User
                            user_record = User.query.get(user_id)
                            if user_record:
                                current_user_org_id = user_record.organization_id
                except:
                    pass
                
                print(f"[GET_LIST] Found {len(result)} project(s) for INCOMING (User org_id: {current_user_org_id})")
                logger.info(f"[GET_LIST] Found {len(result)} project(s) for INCOMING (User org_id: {current_user_org_id})")
                
                for i, project in enumerate(result[:5]):  # Log first 5
                    project_org_id = project.organization_id if hasattr(project, 'organization_id') else getattr(project, 'organization_id', 'N/A')
                    project_name = project.name if hasattr(project, 'name') else getattr(project, 'name', 'N/A')
                    project_status = project.project_status if hasattr(project, 'project_status') else getattr(project, 'project_status', 'N/A')
                    project_status_value = project_status.value if hasattr(project_status, 'value') else str(project_status)
                    project_created_by = project.created_by if hasattr(project, 'created_by') else getattr(project, 'created_by', 'N/A')
                    project_workflow_id = project.workflow_id if hasattr(project, 'workflow_id') else getattr(project, 'workflow_id', 'N/A')
                    print(f"[GET_LIST] Project {i+1}: {project_name} (ID: {getattr(project, 'id', 'N/A')}, org_id: {project_org_id}, status: {project_status_value}, created_by: {project_created_by}, workflow_id: {project_workflow_id})")
                    logger.info(f"[GET_LIST] Project {i+1}: {project_name} (ID: {getattr(project, 'id', 'N/A')}, org_id: {project_org_id}, status: {project_status_value}, created_by: {project_created_by}, workflow_id: {project_workflow_id})")
                    
                    # CRITICAL: Check if DRAFT project is being returned (should never happen)
                    if project_status_value and project_status_value.upper() == 'DRAFT':
                        print(f"[GET_LIST] 🚨 ERROR: DRAFT project found in INCOMING results! This should never happen!")
                        logger.error(f"[GET_LIST] ERROR: DRAFT project found in INCOMING results! Project ID: {getattr(project, 'id', 'N/A')}, Status: {project_status_value}, Created By: {project_created_by}, Workflow ID: {project_workflow_id}")
                    
                    # CRITICAL: Check if project from different organization is being returned (MAJOR BUG!)
                    if current_user_org_id and project_org_id != 'N/A':
                        try:
                            if int(project_org_id) != int(current_user_org_id):
                                print(f"[GET_LIST] 🚨🚨🚨 CRITICAL SECURITY BUG: User (org_id: {current_user_org_id}) is seeing project from DIFFERENT organization (org_id: {project_org_id})! Project ID: {getattr(project, 'id', 'N/A')}")
                                logger.error(f"[GET_LIST] CRITICAL SECURITY BUG: User (org_id: {current_user_org_id}) is seeing project from DIFFERENT organization (org_id: {project_org_id})! Project ID: {getattr(project, 'id', 'N/A')}, Project Name: {project_name}")
                        except (ValueError, TypeError):
                            pass
                print("=" * 80)
                logger.info("=" * 80)
        except Exception as err:
            if is_incoming:
                logger.error(f"[GET_LIST] Error executing query: {err}")
                import traceback
                logger.error(traceback.format_exc())
            raise err
        finally:
            self.cleanup(self)
        return result

    @classmethod
    def get_total(self, filter=dict()):
        result = None
        query = self.query
        query = query.filter(*self.get_access_filters(self, filter=filter))
        query = query.filter(*self.get_filters(self, filter))
        try:
            result = query.count()
        except Exception as err:
            raise err
        finally:
            self.cleanup(self)
        return result

    @classmethod
    def get_one(self, record_id):
        result = None
        query = self.query
        query = query.filter(
            *self.get_access_filters(self, access_type=SINGLE_RECORD))
        query = query.filter(self.id == record_id)
        try:
            result = query.first()
        except Exception as err:
            raise err
        finally:
            self.cleanup(self)
        return result

    @classmethod
    def create(self, **kwargs):
        log_message(app, 'insert', self.__tablename__, **kwargs)
        instance = self(**kwargs)
        return instance.save()

    def update(self, **kwargs):
        kwargs.pop('id', None)
        log_message(app, 'update', self.__tablename__, **kwargs)
        for attr, value in kwargs.items():
            # if value is not None:
            setattr(self, attr, value)
        return self.save()

    def delete(self):
        log_message(app, 'delete', self.__tablename__, **{'id': self.id})
        if self._has_archive:
            self.archive()
        else:
            try:
                db.session.delete(self)
                db.session.commit()
            except Exception as err:
                raise err
            finally:
                self.cleanup()

    def archive(self):
        log_message(app, 'archive', self.__tablename__, **{'id': self.id})
        setattr(self, 'is_deleted', True)
        return self.save()

    @classmethod
    def delete_many(self, filter=dict()):
        query = self.query
        filters = self.get_filters(self, filter)
        if len(filters) > 0:
            query = query.filter(*filters)
        else:
            abort(500, message=messages.MULTI_DELETE_NOT_ALLOWED)
        records = query.all()
        for record in records:
            record.delete()

    def save(self):
        try:
            if self._has_meta_data:
                try:
                    user = get_jwt_identity()
                    if user is not None:
                        if self.id is None:
                            self.created_by = user['id'] if isinstance(user, dict) else user
                        else:
                            self.modified_by = user['id'] if isinstance(user, dict) else user
                except Exception:
                    # If JWT is not available, use default values
                    if self.id is None:
                        self.created_by = 1  # Default admin user
                    else:
                        self.modified_by = 1  # Default admin user
                self.modified_on = datetime.now()
            db.session.add(self)
            db.session.commit()
            db.session.refresh(self)
            return self
        except exc.IntegrityError as e:
            abort(500, message=str(e.__dict__['orig']))
        except exc.DatabaseError as e:
            abort(500, message=str(e.__dict__['orig']))
        except exc.SQLAlchemyError as e:
            abort(500, message=str(e.__dict__['orig']))
        finally:
            self.cleanup()

    def get_filters(self, filter):
        filter_list = []
        if filter.get('name') and hasattr(self, 'name'):
            filter_list.append(self.name.like(
                '%{}%'.format(filter.get('name'))))
        return filter_list

    def get_access_filters(self, **kwargs):
        filter = kwargs.get('filter', dict())
        access_type = kwargs.get('access_type')
        filter_list = []
        is_deleted = 'is_deleted' in filter and filter.get(
            'is_deleted') or None
        if self._has_archive:
            if (has_permission(self._archive_permission)
                    or has_permission(FULL_ACCESS)):
                if is_deleted not in [None, 'both']:
                    filter_list.append(self.is_deleted ==
                                       filter.get('is_deleted'))
                elif (access_type != SINGLE_RECORD and is_deleted != 'both'):
                    filter_list.append(self.is_deleted == False)
            else:
                if is_deleted != 'both':
                    filter_list.append(self.is_deleted == False)
        return filter_list

    def cleanup(self):
        engine_container = db.get_engine(app)
        engine_container.dispose()
