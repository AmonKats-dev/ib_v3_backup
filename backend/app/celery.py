from celery import Celery
from app.config import setup_config


def init_celery(celery, app):
    celery.conf.update(app.config)
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask


def create_celery(app_name=__name__):
    config = setup_config()
    return Celery(app_name, backend=config.backend, broker=config.broker)


celery = create_celery()
