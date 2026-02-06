from app.core.cerberus import check_permission
from flask import request
from flask_restful import Resource


class ExportView(Resource):
    method_decorators = {'post': [check_permission('export')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def post(self):
        json_data = request.get_json(force=True)
        result = self.service.export(json_data)
        if result is not None:
            return {
                "mime_type": "application/pdf",
                "extension": result['extension'],
                "file_content": result['content'].decode("utf-8")
            }, 200
