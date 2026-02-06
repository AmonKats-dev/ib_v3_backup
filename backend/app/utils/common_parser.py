from flask_restful import reqparse

common_parser = reqparse.RequestParser()
common_parser.add_argument('sort_field', location='args')
common_parser.add_argument('sort_order', location='args')
common_parser.add_argument('page', type=int, location='args')
common_parser.add_argument('per_page', type=int, location='args')
common_parser.add_argument('filter', location='args')
