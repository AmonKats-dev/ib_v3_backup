from functools import wraps

from flask import current_app
from flask_restful import abort

FEATURES_CONFIG = "FEATURES_CONFIG"
EXTENSION_NAME = "Features"


class Feature(object):
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        app.config.setdefault(FEATURES_CONFIG, [])

        if not hasattr(app, 'extensions'):
            app.extensions = {}
        app.extensions[EXTENSION_NAME] = self

    def check(self, feature):
        if not current_app:
            return False
        try:
            return current_app.config[FEATURES_CONFIG][feature]
        except (AttributeError, KeyError):
            pass


def is_active(feature):
    """ Check if a feature is active """

    if current_app:
        feature_component = current_app.extensions.get(EXTENSION_NAME)
        if feature_component:
            return feature_component.check(feature)
        else:
            raise AssertionError(
                "Oops. This application doesn't have the Flask-FeatureFlag extention installed.")
    else:
        return False


def check_feature(feature):
    def _is_active_feature(func):
        @wraps(func)
        def wrapped(*args, **kwargs):
            if not is_active(feature):
                abort(404)
            return func(*args, **kwargs)
        return wrapped
    return _is_active_feature
