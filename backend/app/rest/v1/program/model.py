from app.constants import messages
from app.core import BaseModel
from app.shared import db
from app.utils import get_level
from sqlalchemy import event, func


class Program(BaseModel):
    __tablename__ = 'program'
    _has_archive = True
    _has_additional_data = True
    _default_sort_field = 'name'

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey(
        'program.id'), nullable=True)
    level = db.Column(db.Integer, nullable=False)
    parent = db.relationship(
        'Program', remote_side="Program.id", lazy=True)
    children = db.relationship("Program", lazy=True, overlaps="parent")
    organization_ids = db.Column(db.Text(), nullable=True)
    # function_id column - uncomment after running migration 7104944bd94b
    # function_id = db.Column(db.Integer, db.ForeignKey(
    #     'coa_function.id'), nullable=True)
    # function = db.relationship('Function', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        if filter.get('level'):
            filter_list.append(self.level == filter.get('level'))
        if filter.get('parent_id'):
            filter_list.append(self.parent_id == filter.get('parent_id'))
        if filter.get('organization_id'):
            filter_list.append(func.find_in_set(
                filter.get('organization_id'), self.organization_ids))
        # Filter by function_id (directorate) - direct link to coa_function table
        # Programs now have a direct foreign key to coa_function table
        if filter.get('function_id'):
            # Check if function_id column exists in the actual database table
            # If migration hasn't been run yet, fallback to organization_id filtering
            try:
                # Check the actual database schema, not just the model definition
                # Use a cached check to avoid repeated database queries
                if not hasattr(Program, '_function_id_column_exists'):
                    try:
                        from sqlalchemy import inspect
                        inspector = inspect(db.engine)
                        db_columns = [col['name'] for col in inspector.get_columns('program')]
                        Program._function_id_column_exists = 'function_id' in db_columns
                    except Exception:
                        # If inspection fails, assume column doesn't exist
                        Program._function_id_column_exists = False
                
                if Program._function_id_column_exists:
                    # Column exists in database - use direct filter
                    # Note: This will only work after uncommenting function_id column above
                    # For now, this path won't execute since column is commented out
                    try:
                        filter_list.append(self.function_id == filter.get('function_id'))
                    except AttributeError:
                        # Column not defined in model yet - use fallback
                        pass
                else:
                    # Column doesn't exist in database yet - fallback to organization_id method
                    # This happens if migration 7104944bd94b hasn't been run
                    import logging
                    logging.info(f"[PROGRAM FILTER] function_id column not in DB, using organization_id fallback for function_id={filter.get('function_id')}")
                    from ..function import FunctionService
                    function_service = FunctionService()
                    function = function_service.model.get_one(filter.get('function_id'))
                    if function:
                        if hasattr(function, 'organization_id') and function.organization_id:
                            logging.info(f"[PROGRAM FILTER] Function {filter.get('function_id')} has organization_id={function.organization_id}, filtering programs")
                            filter_list.append(func.find_in_set(
                                function.organization_id, self.organization_ids))
                        else:
                            logging.warning(f"[PROGRAM FILTER] Function {filter.get('function_id')} exists but has no organization_id set. Cannot filter programs.")
                    else:
                        logging.warning(f"[PROGRAM FILTER] Function {filter.get('function_id')} not found in database")
            except Exception as e:
                # If check fails, fallback to organization_id method
                import logging
                logging.warning(f"[PROGRAM FILTER] Error with function_id filter, using organization_id fallback: {e}")
                try:
                    from ..function import FunctionService
                    function_service = FunctionService()
                    function = function_service.model.get_one(filter.get('function_id'))
                    if function:
                        if hasattr(function, 'organization_id') and function.organization_id:
                            logging.info(f"[PROGRAM FILTER] Fallback: Function {filter.get('function_id')} has organization_id={function.organization_id}, filtering programs")
                            filter_list.append(func.find_in_set(
                                function.organization_id, self.organization_ids))
                        else:
                            logging.warning(f"[PROGRAM FILTER] Fallback: Function {filter.get('function_id')} exists but has no organization_id set. Cannot filter programs.")
                    else:
                        logging.warning(f"[PROGRAM FILTER] Fallback: Function {filter.get('function_id')} not found in database")
                except Exception as fallback_error:
                    # If fallback also fails, just skip the filter
                    logging.error(f"[PROGRAM FILTER] Fallback also failed: {fallback_error}")
                    pass
        return filter_list

    def delete(self):
        for child in self.children:
            child.is_deleted = True
            child.save()
        return super().delete()


@event.listens_for(Program, 'before_insert')
@event.listens_for(Program, 'before_update')
def set_level(mapper, connection, target):
    target.level = get_level(Program, target.parent_id)
