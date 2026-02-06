from app.config import setup_schema
from app.shared import ma
from marshmallow import EXCLUDE, fields, validate


class AuditSchema(ma.Schema):
    created_by = fields.Int(dump_only=True)
    created_on = fields.DateTime(dump_only=True)
    modified_by = fields.Int(dump_only=True)
    modified_on = fields.DateTime(dump_only=True)


class AdditionalSchema(ma.Schema):
    additional_data = fields.Raw(required=False, allow_none=True)


class ArchiveSchema(ma.Schema):
    is_deleted = fields.Boolean(required=False, allow_none=True)


class BaseSchema(ma.Schema):
    id = fields.Int(dump_only=True)

    class Meta:
        unknown = EXCLUDE
        ordered = True


class CustomField:
    def __init__(self, **kwargs):
        self.required = kwargs.pop('required')
        self.min = kwargs.get('min_length', 0)
        self.max = kwargs.get('max_length')
        self.data_type = "string"
        self.validate = None
        self.set_validation()

    def set_validation(self):
        if self.max is not None:
            self.validate = validate.Length(min=self.min, max=self.max)

    def generate_options(self):
        return {"required": self.required, "validate": self.validate}

    def generate(self):
        if self.data_type == "integer":
            field_type = "Integer"
        else:
            field_type = "Str"
        return getattr(fields, field_type)(**self.generate_options())


def generate_schema(module_name, schema):
    app_schema = setup_schema()
    if module_name in app_schema:
        module_schema = app_schema[module_name]
        for field_options in module_schema:
            custom_field = CustomField(**field_options)
            schema[field_options["key"]] = custom_field.generate()
    return schema
