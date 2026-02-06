from app.constants import messages
from app.core import BaseModel
from app.shared import db
from app.utils import get_level
from sqlalchemy import event


class Function(BaseModel):
    __tablename__ = 'coa_function'
    _has_archive = True
    _has_additional_data = True
    _default_sort_field = 'name'

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey(
        'coa_function.id'), nullable=True)
    organization_id = db.Column(db.Integer, db.ForeignKey(
        'organization.id'), nullable=True)
    level = db.Column(db.Integer, nullable=False)
    parent = db.relationship(
        'Function', remote_side="Function.id", lazy=True)
    children = db.relationship("Function", lazy=True, overlaps="parent")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        if filter.get('level'):
            # Convert level to int if it's a string
            level_value = filter.get('level')
            if isinstance(level_value, str):
                try:
                    level_value = int(level_value)
                except (ValueError, TypeError):
                    pass  # Keep original value if conversion fails
            filter_list.append(self.level == level_value)
        if filter.get('parent_id'):
            filter_list.append(self.parent_id == filter.get('parent_id'))
        if filter.get('organization_id'):
            filter_list.append(self.organization_id ==
                               filter.get('organization_id'))
        return filter_list

    def delete(self):
        for child in self.children:
            child.is_deleted = True
            child.save()
        return super().delete()


@event.listens_for(Function, 'before_insert')
@event.listens_for(Function, 'before_update')
def set_level(mapper, connection, target):
    try:
        target.level = get_level(Function, target.parent_id)
    except ValueError as e:
        # If get_level fails (e.g., parent not found), this is a validation error
        # Store the error message in the target so it can be handled in the service layer
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error calculating level for Function: {str(e)}")
        # Re-raise as ValueError so it can be caught and converted to HTTPException in service layer
        raise ValueError(f"Invalid parent_id {target.parent_id}: {str(e)}")
    except Exception as e:
        # For any other unexpected errors, log and re-raise
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Unexpected error calculating level for Function: {str(e)}")
        raise
