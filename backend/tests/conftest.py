import os

import pytest
from sqlalchemy import exc

from app import create_app
from app.shared import db


def create_test_app():
    """Return Flask's app object with test configuration"""
    open(os.path.join(os.path.dirname(__file__), "test_app.db"), "w+")
    app = create_app(app_env='test')
    return app


def set_up(app):
    """Create database tables according to the app models"""
    with open(os.path.join(os.path.dirname(__file__), "data_role.sql"), "rb") as f:
        _role_data_sql = f.read().decode("utf8")
    with open(os.path.join(os.path.dirname(__file__), "data_user.sql"), "rb") as f:
        _user_data_sql = f.read().decode("utf8")
    with open(os.path.join(os.path.dirname(__file__), "data_user_role.sql"), "rb") as f:
        _user_role_data_sql = f.read().decode("utf8")

    with app.app_context():
        try:
            db.session.execute(_role_data_sql)
            db.session.execute(_user_data_sql)
            db.session.execute(_user_role_data_sql)
            db.session.commit()
        except exc.SQLAlchemyError as e:
            pass


def tear_down(app):
    """Remove all tables from the database"""
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client():
    """Create Flask's test client to interact with the application"""
    app = create_test_app()
    client = app.test_client()
    set_up(app)
    yield client
    tear_down(app)
