from app.core import BaseModel
from app.shared import db
from sqlalchemy.sql import expression


class WorkflowInstance(BaseModel):
    __tablename__ = 'workflow_instance'
    _has_additional_data = False

    name = db.Column(db.String(255), nullable=False)
    entity_type = db.Column(db.String(100), nullable=True)
    organization_level = db.Column(db.String(100), nullable=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('name'):
            filter_list.append(self.name.ilike(f"%{filter.get('name')}%"))
        if filter.get('entity_type'):
            filter_list.append(self.entity_type == filter.get('entity_type'))
        if filter.get('organization_level'):
            filter_list.append(self.organization_level == filter.get('organization_level'))
        return filter_list

    def get_access_filters(self, **kwargs):
        filter_list = super().get_access_filters(self, **kwargs)
        return filter_list
