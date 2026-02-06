from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource, abort


class StakeholderEngagementList(BaseList):
    method_decorators = {'get': [check_permission('list_stakeholder_engagements')],
                         'post': [check_permission('create_stakeholder_engagement')]}


class StakeholderEngagementView(BaseView):
    method_decorators = {'get': [check_permission('view_stakeholder_engagement')],
                         'patch': [check_permission('edit_stakeholder_engagement')]}
