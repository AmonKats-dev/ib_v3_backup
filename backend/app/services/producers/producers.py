import polling
from app.celery import celery
from celery.result import AsyncResult


def send_sync(task, **kwargs):
    result = celery.send_task(task, **kwargs)
    polling.poll(
        lambda: result.get(),
        step=1,
        timeout=10)

    data = result.get()
    result.forget()
    return data


def ai_add(x, y):
    return send_sync('api.common.add', kwargs=dict(x=x, y=y))


def test_task():
    result = celery.send_task('api.common.test')
    print(result.task_id)
    new_result = AsyncResult(result.task_id, app=celery)

    polling.poll(
        lambda: new_result.get(),
        step=1,
        timeout=10)
    data = new_result.get()
    new_result.forget()
    print(data)
    return data
