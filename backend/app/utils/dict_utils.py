def clean_dict(obj, bad_key=""):
    if isinstance(obj, dict):
        # the call to `list` is useless for py2 but makes
        # the code py2/py3 compatible
        for key in list(obj.keys()):
            if key == bad_key or obj[key] is None:
                del obj[key]
            else:
                clean_dict(obj[key], bad_key)
    elif isinstance(obj, list):
        for i in reversed(range(len(obj))):
            if obj[i] == bad_key:
                del obj[i]
            else:
                clean_dict(obj[i], bad_key)

    else:
        # neither a dict nor a list, do nothing
        pass


def replace_key_dict(obj, prev_key, new_key):
    if isinstance(obj, dict):
        for key in list(obj.keys()):
            if obj[key] is None:
                del obj[key]
            elif key == prev_key:
                obj[new_key] = obj[key]
                del obj[key]
            else:
                replace_key_dict(obj[key], prev_key, new_key)
    elif isinstance(obj, list):
        for i in reversed(range(len(obj))):
            replace_key_dict(obj[i], prev_key, new_key)
    else:
        pass


def get_key_by_value_dict(keyword, data=dict()):
    for key, value in data.items():
        if value == keyword:
            return key


def convert_dict_to_string(**kwargs):
    return ", ".join(f"{key}={value}" for key, value in kwargs.items())
