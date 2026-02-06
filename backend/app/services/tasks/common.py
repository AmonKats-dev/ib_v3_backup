from app.celery import celery
import time


@celery.task(name='api.common.add')
def add(x, y):
    return x+y


@celery.task(name='api.common.test')
def test(**kwargs):
    time.sleep(20)
    return "good"
