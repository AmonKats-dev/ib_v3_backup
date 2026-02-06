from app.constants import MEReportStatus
from app.core import BaseModel
from app.shared import db


class MEReport(BaseModel):
    __tablename__ = 'me_report'

    quarter = db.Column(db.String(2), nullable=True)
    year = db.Column(db.SmallInteger(), nullable=False)
    start_date = db.Column(db.Date(), nullable=True)
    end_date = db.Column(db.Date(), nullable=True)
    effectiveness_date = db.Column(db.Date(), nullable=True)
    financing_agreement_date = db.Column(db.Date(), nullable=True)
    signed_date = db.Column(db.Date(), nullable=True)
    me_type = db.Column(db.String(255), nullable=False)
    data_collection_type = db.Column(db.String(255), nullable=False)
    report_status = db.Column(
        db.Enum(MEReportStatus), nullable=False, default=MEReportStatus.DRAFT)
    disbursement = db.Column(db.Text(), nullable=True)
    issues = db.Column(db.JSON(), nullable=True)
    challenges = db.Column(db.Text(), nullable=True)
    recommendations = db.Column(db.Text(), nullable=True)
    lessons_learned = db.Column(db.Text(), nullable=True)
    summary = db.Column(db.Text(), nullable=True)
    rational_study = db.Column(db.Text(), nullable=True)
    methodology = db.Column(db.Text(), nullable=True)
    frequency = db.Column(db.String(255), nullable=False)

    me_workflow_id = db.Column(db.Integer, db.ForeignKey(
        'me_workflow.id'), nullable=False, default=1)
    current_step = db.Column(db.SmallInteger, nullable=False)
    max_step = db.Column(db.SmallInteger, nullable=False)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)
    me_outputs = db.relationship('MEOutput', lazy=True, uselist=True)
    me_activities = db.relationship('MEActivity', lazy=True, uselist=True)
    me_workflow = db.relationship('MEWorkflow', lazy=True)
    me_liabilities = db.relationship('MELiability', lazy=True, uselist=True)

    created_by = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', lazy=True, foreign_keys=created_by)

    files = db.relationship('Media', backref=db.backref('me_report_media', overlaps="files,project_detail_media,options_media,timeline_media"), uselist=True,
                            primaryjoin="and_(MEReport.id == foreign(Media.entity_id), foreign(Media.entity_type) == 'me-report')",
                            overlaps="files,project_detail_media,options_media,timeline_media")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('quarter'):
            filter_list.append(self.quarter == filter.get('quarter'))
        if filter.get('year'):
            filter_list.append(self.year == filter.get('year'))
        if filter.get('frequency'):
            filter_list.append(self.frequency == filter.get('frequency'))
        if filter.get('report_status'):
            filter_list.append(self.report_status ==
                               filter.get('report_status'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        return filter_list
