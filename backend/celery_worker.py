from app.celery import celery, init_celery
from app import create_app
from app.services.tasks import *

app = create_app(celery_worker=True)
init_celery(celery, app)
