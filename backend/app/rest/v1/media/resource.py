from app.constants import common, messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from app.utils import retrieve_file
from flask import request
from flask_restful import Resource, abort


class MediaList(BaseList):
    method_decorators = {'post': [check_permission('upload_media')]}

    def get(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)


class MediaView(BaseView):
    method_decorators = {'patch': [check_permission('update_media')],
                         'delete': [check_permission('delete_media')]}

    def put(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)


class UploadView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self, filename):
        return retrieve_file(common.UPLOAD_FOLDER, filename)
