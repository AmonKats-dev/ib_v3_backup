from app.core import BaseService

from .model import Comment
from .resource import CommentList, CommentView
from .schema import CommentSchema


class CommentService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Comment
        self.schema = CommentSchema
        self.resources = [
            {'resource': CommentList, 'url': '/comments'},
            {'resource': CommentView, 'url': '/comments/<int:record_id>'}
        ]
