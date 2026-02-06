from app.core import BaseList, BaseView, feature
from app.core.cerberus import check_permission


class CountryList(BaseList):
    method_decorators = {'get': [check_permission('list_countries')],
                         'post': [check_permission('create_country')]}

    # @feature.check_feature('unfinished_feature')
    # def get(self, access_key='some_data'):
    #     return access_key
    #     if(feature.is_active('unfinished_feature')):
    #         return 'hello'
    #     else:
    #         return 'bye'


class CountryView(BaseView):
    method_decorators = {'get': [check_permission('view_country')],
                         'put': [check_permission('edit_country')],
                         'patch': [check_permission('edit_country')],
                         'delete': [check_permission('delete_country')]}
