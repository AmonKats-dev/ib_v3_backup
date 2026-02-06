from app.core import BaseModel
from app.shared import db
from sqlalchemy import func


class NdpSdg(BaseModel):
    __tablename__ = 'ndp_sdg'
    _has_archive = True

    name = db.Column(db.String(255), nullable=False)
    ndp_outcome_ids = db.Column(db.String(255), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('ndp_outcome_id'):
            filter_list.append(func.find_in_set(
                filter.get('ndp_outcome_id'), self.ndp_outcome_ids))
        if filter.get('ids'):
            filter_list.append(self.id.in_(filter.get('ids')))
        return filter_list
