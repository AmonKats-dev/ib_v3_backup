from flask_restful import abort

from app.constants import messages
from app.core import BaseService
from app.signals import project_detail_created, project_detail_updated

from ..project_detail import ProjectDetailService
from .model import PostEvaluation
from .resource import PostEvaluationList
from .schema import PostEvaluationSchema


class PostEvaluationService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = PostEvaluation
        self.schema = PostEvaluationSchema
        self.resources = [
            {'resource': PostEvaluationList, 'url': '/post-evaluations'}
        ]

    def get_all(self, args, filters=dict()):
        if filters is None:
            filters = []
        if 'project_detail_id' in filters:
            project_detail = ProjectDetailService().get_one(
                filters['project_detail_id'])
            if project_detail is not None:
                return super().get_all(args, filters=filters)

        abort(404, message=messages.NOT_FOUND)

    def manage_post_evaluations(self, record, project_detail_id, delete=False):
        record['project_detail_id'] = project_detail_id
        if 'id' in record:
            self.update(record["id"], record)
        else:
            self.create(record)


@project_detail_created.connect
@project_detail_updated.connect
def update_post_evaluations(self, project_detail, **kwargs):
    record = kwargs.get("post_evaluation", None)
    if bool(record):
        service = PostEvaluationService()
        service.manage_post_evaluations(
            record, project_detail['id'], delete=False)
