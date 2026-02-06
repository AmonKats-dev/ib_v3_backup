from app.core import BaseService
from app.signals import user_created

from .model import FileType
from .resource import FileTypeList, FileTypeView
from .schema import FileTypeSchema


class FileTypeService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = FileType
        self.schema = FileTypeSchema
        self.resources = [
            {'resource': FileTypeList, 'url': '/file-types'},
            {'resource': FileTypeView, 'url': '/file-types/<int:record_id>'}
        ]
