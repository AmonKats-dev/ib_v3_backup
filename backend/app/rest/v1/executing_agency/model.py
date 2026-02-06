from app.core import BaseModel
from app.shared import db


class ExecutingAgency(BaseModel):
    __tablename__ = 'executing_agency'
    _has_additional_data = True

    organization_id = db.Column(db.Integer, db.ForeignKey(
        'organization.id'), nullable=False)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    organization = db.relationship('Organization', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('organization_id'):
            filter_list.append(self.organization_id ==
                               filter.get('organization_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list
