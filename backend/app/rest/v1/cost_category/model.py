from app.core import BaseModel
from app.shared import db


class CostCategory(BaseModel):
    __tablename__ = 'cost_category'
    _has_archive = True
    _has_additional_data = True

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    expenditure_type = db.Column(db.String(50), nullable=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        if filter.get('name'):
            filter_list.append(self.name.ilike(f"%{filter.get('name')}%"))
        if filter.get('expenditure_type'):
            filter_list.append(self.expenditure_type == filter.get('expenditure_type'))
        return filter_list

