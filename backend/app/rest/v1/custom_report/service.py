from app.core import BaseService
from app.core.cerberus import has_permission
from app.signals import user_created
from flask_restful import abort

from .model import CustomReport
from .resource import CustomReportList, CustomReportView
from .schema import CustomReportSchema


class CustomReportService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = CustomReport
        self.schema = CustomReportSchema
        self.resources = [
            {'resource': CustomReportList, 'url': '/custom-reports'},
            {'resource': CustomReportView, 'url': '/custom-reports/<int:record_id>'}
        ]

    def create(self, data):
        self.check_public_report_permission(data)
        return super().create(data)

    def update(self, record_id, data, partial=False):
        self.check_public_report_permission(data)
        return super().update(record_id, data, partial=partial)

    def check_public_report_permission(self, data):
        if ('is_public' in data and data['is_public'] is True and
                not has_permission('save_public_custom_report')):
            abort(403)
