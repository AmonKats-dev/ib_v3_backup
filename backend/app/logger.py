import logging
from datetime import datetime

from flask_jwt_extended import get_jwt_identity

from app.utils import convert_dict_to_string


class LogLevelFilter(object):
    def __init__(self, level):
        self.level = logging._checkLevel(level)

    def filter(self, record):
        return record.levelno == self.level


def log_message(app, action, table_name, **kwargs):
    try:
        user = get_jwt_identity()
    except Exception:
        user = None
    
    if user is not None:
        # Handle both dict and int user types
        if isinstance(user, dict):
            user_id = user.get('id', 'Unknown')
            user_name = user.get('full_name', 'Unknown')
        else:
            # user is an integer (user ID)
            user_id = user
            user_name = f"User ID {user_id}"
        
        if action == 'update':
            app.logger.info("[%s] An update occurred in a table: %s by %s (ID: %s)\n Values: %s",
                            datetime.today(), table_name, user_name, user_id, convert_dict_to_string(**kwargs))
        elif action == 'insert':
            app.logger.info("[%s] An insert occurred in a table: %s by %s (ID: %s)\n Values: %s",
                            datetime.today(), table_name, user_name, user_id, convert_dict_to_string(**kwargs))
        elif action == 'delete':
            app.logger.info("[%s] Record ID: %s was deleted in a table: %s by %s (ID: %s)",
                            datetime.today(), kwargs.get('id'), table_name, user_name, user_id)
        elif action == 'archive':
            app.logger.info("[%s] Record ID: %s was archived in a table: %s by %s (ID: %s)",
                            datetime.today(), kwargs.get('id'), table_name, user_name, user_id)


info_handler = logging.handlers.TimedRotatingFileHandler(
    'logs/info.log', when="midnight", interval=1)
error_handler = logging.handlers.TimedRotatingFileHandler(
    'logs/error.log', when="midnight", interval=1)
info_handler.suffix = "%Y%m%d"
error_handler.suffix = "%Y%m%d"

info_handler.addFilter(LogLevelFilter(logging.INFO))
error_handler.addFilter(LogLevelFilter(logging.ERROR))
