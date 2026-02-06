from app.core import BaseModel
from app.shared import db


class FundSource(BaseModel):
    __tablename__ = 'fund_source'
    _has_archive = True
    _has_additional_data = True

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    fund_id = db.Column(db.Integer, db.ForeignKey('fund.id'), nullable=True)
    
    fund = db.relationship('Fund', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        if filter.get('name'):
            filter_list.append(self.name.ilike(f"%{filter.get('name')}%"))
        if filter.get('fund_id'):
            filter_list.append(self.fund_id == filter.get('fund_id'))
        return filter_list

