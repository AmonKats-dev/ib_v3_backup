import base64
import os
from io import BytesIO
from string import Template

import pdfkit
from app.constants import PDF, WORD
from app.core import BaseService
from app.utils import validate_schema
from flask import current_app
from xhtml2pdf import pisa

from .resource import ExportView
from .schema import ExportSchema
from .template import WORD_TEMPLATE


class ExportService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.schema = ExportSchema
        self.resources = [
            {'resource': ExportView, 'url': '/export'},
        ]

    def export(self, data):
        validated_data = validate_schema(data, ExportSchema())
        if validated_data:
            if validated_data['export_type'] == PDF:
                return self.export_pdf(validated_data)
            if validated_data['export_type'] == WORD:
                return self.export_word(validated_data)

    def export_pdf(self, data):
        footer_file = 'footer.html'
        if 'instance' in data:
            footer_file = 'footer_{}.html'.format(data['instance'])
        filename = os.path.join(current_app.root_path,
                                'templates', footer_file)
        WKHTMLTOPDF_PATH = '/usr/local/bin/wkhtmltopdf'
        config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH)
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'custom-header': [
                ('Accept-Encoding', 'gzip')
            ],
            '--footer-html': 'file:///{}'.format(filename),
            'footer-font-size': '7'
        }

        html_styling = '<style>{}</style>'.format(data['style'])
        html_content = data['content']
        pdf = pdfkit.PDFKit(html_styling + html_content,
                            "string", configuration=config, options=options).to_pdf()
        file_content = base64.b64encode(pdf)
        return {'content': file_content, 'extension': 'pdf'}

    def export_word(self, data):
        result = BytesIO()
        word_content = Template(WORD_TEMPLATE).safe_substitute(
            html_style=data['style'],
            html_content=data['content'])
        return {'content': word_content.encode('utf-8'), 'extension': 'doc'}
