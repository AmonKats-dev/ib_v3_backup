from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource, abort


class HumanResourceList(BaseList):
    method_decorators = {'get': [check_permission('list_human_resources')],
                         'post': [check_permission('create_human_resource')]}


class HumanResourceView(BaseView):
    method_decorators = {'get': [check_permission('view_human_resource')],
                         'patch': [check_permission('edit_human_resource')]}
