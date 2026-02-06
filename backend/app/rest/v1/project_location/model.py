from app.core import BaseModel
from app.shared import db


class ProjectLocation(BaseModel):
    __tablename__ = 'project_location'
    _has_additional_data = True

    location_type = db.Column(db.String(50), nullable=True)
    country_name = db.Column(db.String(255), nullable=True)
    administrative_post = db.Column(db.String(255), nullable=True)
    location_name = db.Column(db.String(255), nullable=True)

    location_id = db.Column(db.Integer, db.ForeignKey(
        'location.id'), nullable=True)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    location = db.relationship('Location', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('location_id'):
            filter_list.append(self.location_id == filter.get('location_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list
