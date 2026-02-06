import string
import random
import uuid


def generate_random_string(string_length=20):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


def generate_random_alphanumeric_string(string_length=20):
    return uuid.uuid4().hex[:string_length]
