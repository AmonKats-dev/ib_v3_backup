import logging

from app import create_app
from app.logger import error_handler, info_handler

application = create_app()

if __name__ == "__main__":
    application.run(debug=True)
