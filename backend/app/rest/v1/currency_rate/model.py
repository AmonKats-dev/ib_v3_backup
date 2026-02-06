from app.core import BaseModel
from app.shared import db


class CurrencyRate(BaseModel):
    __tablename__ = 'currency_rate'

    rate = db.Column(db.String(10), nullable=False)
    currency_id = db.Column(db.Integer, db.ForeignKey(
        'currency.id'), nullable=False)

    currency = db.relationship('Currency', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('currency_id'):
            filter_list.append(self.currency_id == filter.get('currency_id'))
        return filter_list
