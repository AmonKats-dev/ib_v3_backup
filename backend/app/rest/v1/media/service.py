from app.constants import common, messages
from app.core import BaseService
from app.signals import user_created
from app.utils import (common_parser, generate_random_string, get_extension,
                       remove_file, upload_encoded_file, validate_schema)
from flask import current_app as app
from flask_restful import abort

from .model import Media
from .resource import MediaList, MediaView, UploadView
from .schema import MediaSchema


class MediaService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Media
        self.schema = MediaSchema
        self.resources = [
            {'resource': MediaList, 'url': '/media'},
            {'resource': MediaView, 'url': '/media/<int:record_id>'},
            {'resource': UploadView, 'url': '/uploads/<path:filename>'}
        ]

    def create(self, data):
        schema = self.schema()
        if validate_schema(data, schema):
            try:
                if 'entity_ids' in data:
                    entity_ids = []
                    for entity_id in data['entity_ids']:
                        data['entity_id'] = entity_id
                        self._create_media(data)
                        entity_ids.append(entity_id)
                    return entity_ids
                else:
                    return self._create_media(data)
            except Exception as e:
                app.logger.error("Error uploading file: %s", e)
                abort(422, message=messages.UNSUPPORTED_ENTITY)

    def _create_media(self, data):
        if 'media' in data and data['media'] is not None:
            media_file = data['media'].split(',')
            extension = get_extension(media_file[0] + ',')

            filename = generate_random_string() + extension
            upload_encoded_file(common.UPLOAD_FOLDER,
                                filename, media_file[1])
            data['filename'] = filename
        try:
            return super().create(data)
        except Exception as error:
            remove_file(common.UPLOAD_FOLDER, filename)
            abort(422, message=messages.UNSUPPORTED_ENTITY)

    def update(self, record_id, data, partial=False):
        if 'title' in data:
            allowed_data = {'title': data['title']}
            return super().update(record_id, allowed_data, partial)

    def delete(self, record_id):
        record = self.model.get_one(record_id)
        if not record:
            return {'message': messages.NOT_FOUND}, 404
        try:
            remove_file(common.UPLOAD_FOLDER, record.filename)
        except:
            app.logger.error(
                "File with filename: %s couldn't be removed", record.filename)
        record.delete()
        return self.schema().dump(record)

    def bulk_create(self, data):
        entity_ids = []
        if 'entity_ids' in data:
            for entity_id in data['entity_ids']:
                data['entity_id'] = entity_id
                self.create(data)
        abort(405, messages.METHOD_NOT_ALLOWED)
