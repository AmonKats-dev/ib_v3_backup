from app.constants import MEReleaseType
from app.core import BaseModel
from app.shared import db


class MERelease(BaseModel):
    __tablename__ = 'me_release'

    release_type = db.Column(db.Enum(MEReleaseType), nullable=False)
    government_funded = db.Column(db.JSON(), nullable=False)
    donor_funded = db.Column(db.JSON(), nullable=False)

    me_report_id = db.Column(db.Integer, db.ForeignKey(
        'me_report.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('me_report_id'):
            filter_list.append(self.me_report_id == filter.get('me_report_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list
