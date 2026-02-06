from app.constants import messages
from app.utils import validate_schema
from flask import json, request
from flask_restful import abort


class BaseService():

    def __init__(self, **kwargs):
        self.only = dict()
        self.exclude = dict()
        self.resources = []

    def get_total(self, filters=dict()):
        total = self.model.get_total(filters)
        return total

    def get_all(self, args=None, filters=dict()):
        only = self.only["get_all"] if "get_all" in self.only else None
        exclude = self.exclude["get_all"] if "get_all" in self.exclude else []
        # Filter out exclude paths that reference non-existent fields to avoid KeyError
        if exclude:
            schema_instance = self.schema()
            valid_exclude = []
            for exclude_path in exclude:
                # Check if the top-level field exists in the schema
                field_name = exclude_path.split('.')[0]
                if field_name in schema_instance.declared_fields:
                    valid_exclude.append(exclude_path)
            exclude = valid_exclude  # Keep as list, even if empty
        # Always pass a list to marshmallow (empty list if no excludes)
        schema = self.schema(many=True, only=only, exclude=exclude)
        if args is not None:
            records = self.model.get_list(
                args['page'], args['per_page'],
                args['sort_field'], args['sort_order'],
                filters
            )
        else:
            records = self.model.get_list(filter=filters)
        # Use minimal serialization to avoid JSON serialization issues
        try:
            return schema.dump(records)
        except Exception as e:
            # Fallback to basic serialization if schema fails
            return [{'id': record.id, 'name': getattr(record, 'name', '')} for record in records]

    def get_one(self, record_id):
        only = self.only["get_one"] if "get_one" in self.only else None
        exclude = self.exclude["get_one"] if "get_one" in self.exclude else []
        # Filter out exclude paths that reference non-existent fields to avoid KeyError
        if exclude:
            schema_instance = self.schema()
            valid_exclude = []
            for exclude_path in exclude:
                # Check if the top-level field exists in the schema
                field_name = exclude_path.split('.')[0]
                if field_name in schema_instance.declared_fields:
                    valid_exclude.append(exclude_path)
            exclude = valid_exclude  # Keep as list, even if empty
        # Always pass a list to marshmallow (empty list if no excludes)
        record = self.model.get_one(record_id)
        if record:
            schema = self.schema(only=only, exclude=exclude)
            try:
                result = schema.dump(record)
                return result
            except Exception as e:
                # Fallback to basic serialization if schema fails
                return {'id': record.id, 'name': getattr(record, 'name', '')}
        else:
            return None

    def create(self, data):
        import logging
        logger = logging.getLogger(__name__)
        try:
            logger.info(f"BaseService.create called for {self.model.__name__} with data: {data}")
            schema = self.schema()
            # Remove level from data if present, as it's calculated automatically
            if 'level' in data:
                data = {k: v for k, v in data.items() if k != 'level'}
            logger.info(f"Data after level removal: {data}")
            validated_data = validate_schema(data, schema)
            logger.info(f"Validated data: {validated_data}")
            if validated_data:
                try:
                    logger.info(f"Creating {self.model.__name__} record")
                    record = self.model.create(**validated_data)
                    logger.info(f"Record created with id: {record.id}")
                    result = schema.dump(record)
                    logger.info(f"BaseService.create returning result for {self.model.__name__}")
                    return result
                except ValueError as e:
                    # Convert ValueError (e.g., from get_level) to HTTPException
                    from flask_restful import abort
                    logger.error(f"ValueError in BaseService.create: {str(e)}")
                    # Extract the actual error message
                    error_msg = str(e)
                    if "PARENT_NOT_FOUND" in error_msg or "parent" in error_msg.lower():
                        abort(422, message=error_msg)
                    else:
                        abort(422, message=error_msg)
                except Exception as e:
                    logger.error(f"Exception in BaseService.create: {str(e)}", exc_info=True)
                    # Re-raise the exception so it can be caught by the controller
                    raise
            else:
                # This should not happen as validate_schema raises on error, but just in case
                logger.error(f"validate_schema returned None/empty for {self.model.__name__}")
                from flask_restful import abort
                from app.constants import messages
                abort(500, message=messages.NO_INPUT)
        except Exception as e:
            logger.error(f"Unexpected error in BaseService.create: {str(e)}", exc_info=True)
            raise

    def update(self, record_id, data, partial=False):
        schema = self.schema()
        validated_data = validate_schema(data, schema, partial=partial)
        if validated_data:
            record = self.model.get_one(record_id)
            if not record:
                abort(404, message=messages.NOT_FOUND)
            record = record.update(**validated_data)
            return schema.dump(record)

    def delete(self, record_id):
        record = self.model.get_one(record_id)
        schema = self.schema()
        result = schema.dump(record)
        if not record:
            return {'message': messages.NOT_FOUND}, 404
        if "is_deleted" in result:
            record.archive()
        else:
            record.delete()
        return result

    def delete_many(self, filter=dict()):
        self.model.delete_many(filter)

    def add_resources(self, blueprint):
        for item in self.resources:
            blueprint.add_resource(item['resource'], item['url'],
                                   resource_class_kwargs={'service': self})
