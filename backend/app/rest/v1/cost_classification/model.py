from app.core import BaseModel
from app.shared import db


class CostClassification(BaseModel):
    __tablename__ = 'cost_classification'
    _has_archive = True
    _has_additional_data = True

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    cost_category_id = db.Column(db.Integer, db.ForeignKey('cost_category.id'), nullable=True)
    
    cost_category = db.relationship('CostCategory', lazy=True, foreign_keys=[cost_category_id])

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        if filter.get('name'):
            filter_list.append(self.name.ilike(f"%{filter.get('name')}%"))
        if filter.get('cost_category_id'):
            filter_list.append(self.cost_category_id == filter.get('cost_category_id'))
        return filter_list

