from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource, abort


class RiskAssessmentList(BaseList):
    method_decorators = {'get': [check_permission('list_risk_assessments')],
                         'post': [check_permission('create_risk_assessment')]}


class RiskAssessmentView(BaseView):
    method_decorators = {'get': [check_permission('view_risk_assessment')],
                         'patch': [check_permission('edit_risk_assessment')]}
