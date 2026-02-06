from app.constants import MEOutputStatus
from app.core import BaseModel
from app.shared import db


class MEOutput(BaseModel):
    __tablename__ = 'me_output'

    output_progress = db.Column(db.SmallInteger(), nullable=False)
    indicators = db.Column(db.JSON(), nullable=False)
    risk_description = db.Column(db.Text(), nullable=True)
    risk_response = db.Column(db.Text(), nullable=True)
    challenges = db.Column(db.Text(), nullable=True)
    output_status = db.Column(
        db.Enum(MEOutputStatus), nullable=False, default=MEOutputStatus.ON_TRACK)

    output_id = db.Column(db.Integer, db.ForeignKey(
        'output.id'), nullable=False)
    me_report_id = db.Column(db.Integer, db.ForeignKey(
        'me_report.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    output = db.relationship('Output', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('output_id'):
            filter_list.append(self.output_id == filter.get('output_id'))
        if filter.get('output_status'):
            filter_list.append(self.output_status ==
                               filter.get('output_status'))
        if filter.get('me_report_id'):
            filter_list.append(self.me_report_id == filter.get('me_report_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list
