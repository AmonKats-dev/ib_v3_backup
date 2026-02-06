from flask import Blueprint
from flask_restful import Api

from .feature import FeatureService
from .instance import InstanceService
from .module import ModuleService
from .permission import PermissionService

admin_blueprint = Blueprint('admin', __name__)
admin = Api(admin_blueprint)

FeatureService().add_resources(admin)
InstanceService().add_resources(admin)
ModuleService().add_resources(admin)
PermissionService().add_resources(admin)
