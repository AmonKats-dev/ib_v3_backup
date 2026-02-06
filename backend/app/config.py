import configparser
import json
import logging
import os
from functools import lru_cache


class Config:
    def __init__(self, **kwargs):
        self.brand_name = 'HMS REST API'
        self.secret_key = 'xs4G5ZD9SwNME6nWRWrK_aq6Yb9H8VJpdwCzkTErFPw='
        self.token_expiration = 3600
        self.database_url = None
        self.log_level = "DEBUG"
        self.track_modifications = False
        self.mail_server = ''
        self.mail_port = 25
        self.mail_username = ''
        self.mail_password = ''
        self.mail_use_tls = False
        self.mail_use_ssl = False
        self.mail_default_sender = ''


@lru_cache(maxsize=16)
def setup_schema():
    SCHEMA_FILE = os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        '../conf/schema.json')
    try:
        with open(SCHEMA_FILE, 'r') as schema:
            schema = json.load(schema)
            return schema
    except FileNotFoundError:
        logging.error("schema file not found.")
        return {}


def setup_config(app_env=None):
    config = Config()
    # or 'live' to load live
    APP_ENV = os.environ.get('APP_ENV') or app_env or 'local'
    INI_FILE = os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        '../conf/{}.ini'.format(APP_ENV))

    FEATURES_FILE = os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        '../conf/features.json')

    CONFIG = configparser.ConfigParser()
    CONFIG.read(INI_FILE)

    try:
        with open(FEATURES_FILE) as f:
            config.features_config = json.load(f)
    except FileNotFoundError:
        logging.error("features config not found.")
        config.features_config = {}

    if app_env != 'test':
        MYSQL = CONFIG['mysql']
        if MYSQL:
            DB_CONFIG = (MYSQL['user'], MYSQL['password'],
                         MYSQL['host'],  MYSQL['port'],
                         MYSQL['database'])
            config.database_url = "mysql+mysqlconnector://%s:%s@%s:%s/%s" % DB_CONFIG

        LOGGING = CONFIG['logging']
        config.log_level = LOGGING['level']

        JWT = CONFIG['jwt']
        config.token_expiration = int(JWT['token_expiration']) if int(
            JWT['token_expiration']) > 0 else False

        CELERY = CONFIG['celery']
        config.broker = CELERY['broker']
        config.backend = CELERY['backend']

        MAIL = CONFIG['mail']
        config.mail_server = MAIL['mail_server']
        config.mail_port = MAIL['mail_port']
        config.mail_username = MAIL['mail_username']
        config.mail_password = MAIL['mail_password']
        config.mail_default_sender = MAIL['mail_default_sender']
        config.mail_use_tls = True if MAIL['mail_use_tls'] == 'True' else False
        config.mail_use_ssl = True if MAIL['mail_use_ssl'] == 'True' else False

    if app_env == 'test':
        basedir = os.path.abspath(os.path.dirname(__file__))
        config.database_url = 'sqlite:////' + \
            os.path.join(basedir, '../tests/test_app.db')
    return config
