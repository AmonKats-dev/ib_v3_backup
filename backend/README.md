# Integrated Bank of Projects (IBP) API

## How to install and run on local machine

### Installation

```bash
rm -rf .venv
virtualenv -p python3 .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Running on local machine

```bash
source .venv/bin/activate
export FLASK_ENV=development
flask run
```

OR

```
FLASK_DEBUG=1 python -m flask run
```

OR

```
FLASK_ENV=development flask run
```

### Database Migration

To run existing migrations run

```bash
flask db upgrade
```

To create new migrations based on changes in database run

```bash
flask db migrate
```

### Task Queue

To run celery as a worker run

```bash
celery worker -A celery_worker.celery --loglevel=info
```

To monitor queue run

```bash
celery -A celery_worker.celery flower
```

and visit `http://localhost:5555`
