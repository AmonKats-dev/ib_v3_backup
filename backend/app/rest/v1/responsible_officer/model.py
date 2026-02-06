from app.core import BaseModel
from app.shared import db


class ResponsibleOfficer(BaseModel):
    __tablename__ = 'responsible_officer'
    _has_additional_data = True

    title = db.Column(db.String(255), nullable=True)
    name = db.Column(db.String(255), nullable=True)
    organization_name = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(15), nullable=True)
    mobile_phone = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(100), nullable=True)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('title'):
            filter_list.append(self.title == filter.get('title'))
        if filter.get('organization_name'):
            filter_list.append(self.organization_name ==
                               filter.get('organization_name'))
        if filter.get('email'):
            filter_list.append(self.email == filter.get('email'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list
