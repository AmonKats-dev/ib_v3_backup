from app.core import BaseModel
from app.shared import db


class IntegrationSync(BaseModel):
    __tablename__ = 'integration_sync'

    system = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    records_synced = db.Column(db.Integer, nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


class IntegrationNdpProject(BaseModel):
    __tablename__ = 'integration_ndp'
    _has_meta_data = False

    ndp_pip_code = db.Column(db.String(20), nullable=False)
    program_code = db.Column(db.String(6), nullable=True)
    project_name = db.Column(db.Text, nullable=False)
    implementation_status = db.Column(db.String(20), nullable=True)
    planned_start_date = db.Column(db.Date, nullable=True)
    planned_end_date = db.Column(db.Date, nullable=True)
    description = db.Column(db.Text(), nullable=True)
    total_cost = db.Column(db.String(20), nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=True)
    integration_sync_id = db.Column(db.Integer, db.ForeignKey(
        'integration_sync.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('ndp_pip_code'):
            filter_list.append(self.ndp_pip_code ==
                               filter.get('ndp_pip_code'))
        if filter.get('program_code'):
            filter_list.append(self.program_code ==
                               filter.get('program_code'))
        if filter.get('is_not_linked'):
            filter_list.append(self.project_id == None)
        return filter_list


class IntegrationPbsProject(BaseModel):
    __tablename__ = 'integration_pbs_project'
    _has_meta_data = False

    project_coa_code = db.Column(db.String(4), nullable=False)
    project_name = db.Column(db.String(255), nullable=False)
    project_status = db.Column(db.String(15), nullable=False)
    vote_code = db.Column(db.String(10), nullable=False)
    vote_name = db.Column(db.String(255), nullable=False)
    program_code = db.Column(db.String(10), nullable=False)
    program_name = db.Column(db.String(255), nullable=False)
    subprogram_code = db.Column(db.String(10), nullable=False)
    subprogram_name = db.Column(db.String(255), nullable=False)

    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=True)
    integration_sync_id = db.Column(db.Integer, db.ForeignKey(
        'integration_sync.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_coa_code'):
            filter_list.append(self.project_coa_code ==
                               filter.get('project_coa_code'))
        if filter.get('vote_code'):
            filter_list.append(self.vote_code ==
                               filter.get('vote_code'))
        if filter.get('program_code'):
            filter_list.append(self.program_code ==
                               filter.get('program_code'))
        if filter.get('subprogram_code'):
            filter_list.append(self.subprogram_code ==
                               filter.get('subprogram_code'))
        if filter.get('is_not_linked'):
            filter_list.append(self.project_id == None)
        if filter.get('project_id'):
            filter_list.append(self.project_id ==
                               filter.get('project_id'))
        return filter_list


class IntegrationAmp(BaseModel):
    __tablename__ = 'integration_amp'
    _has_meta_data = False

    project_coa_code = db.Column(db.String(5), nullable=False)
    project_title = db.Column(db.String(255), nullable=False)
    project_status = db.Column(db.String(15), nullable=True)
    agreement_title = db.Column(db.String(255), nullable=True)
    agreement_sign_date = db.Column(db.Date(), nullable=True)
    agreement_effective_date = db.Column(db.Date(), nullable=True)
    agreement_close_date = db.Column(db.Date(), nullable=True)
    donor = db.Column(db.String(255), nullable=False)
    donor_commitment_date = db.Column(db.Date(), nullable=True)
    financing_instrument = db.Column(db.String(255), nullable=True)
    executing_agency = db.Column(db.String(255), nullable=True)
    implementing_agency = db.Column(db.String(255), nullable=True)
    planned_commitment_amount = db.Column(db.Float(), nullable=True)
    actual_commitment_amount = db.Column(db.Float(), nullable=True)
    actual_disbursement_amount = db.Column(db.Float(), nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False)
    integration_sync_id = db.Column(db.Integer, db.ForeignKey(
        'integration_sync.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_coa_code'):
            filter_list.append(self.project_coa_code ==
                               filter.get('project_coa_code'))
        if filter.get('agreement_title'):
            filter_list.append(self.agreement_title ==
                               filter.get('agreement_title'))
        if filter.get('project_id'):
            filter_list.append(self.project_id ==
                               filter.get('project_id'))
        return filter_list
