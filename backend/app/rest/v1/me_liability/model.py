from app.core import BaseModel
from app.shared import db


class MELiability(BaseModel):
    __tablename__ = 'me_liability'

    description = db.Column(db.Text(), nullable=True)
    amount = db.Column(db.String(20), nullable=True)
    due_date = db.Column(db.Date(), nullable=True)

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
