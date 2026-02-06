import base64
import os
from mimetypes import guess_extension, guess_type

from flask import current_app, send_from_directory


def get_extension(mime):
    extension = guess_extension(guess_type(mime)[0], strict=False)
    return extension


def upload_encoded_file(directory, filename, encoded_file):
    uploads_dir = os.path.join(current_app.root_path, directory)
    with open(uploads_dir + filename, 'wb') as fh:
        fh.write(base64.b64decode(encoded_file))


def remove_file(directory, filename):
    uploads_dir = os.path.join(current_app.root_path, directory)
    os.remove(uploads_dir + filename)


def retrieve_file(directory, filename):
    uploads_dir = os.path.join(current_app.root_path, directory)
    return send_from_directory(uploads_dir, filename, as_attachment=True)
