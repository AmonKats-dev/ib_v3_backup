from flask_restful import abort

from app.constants import messages


def get_children(record, children=None):
    if children is None:
        children = []
    if record is None:
        return []
    if len(record.children) > 0:
        for child in record.children:
            get_children(child, children)
    else:
        children.append(record)
    return children


def get_children_ids(record):
    if record is None:
        return [0]
    children = get_children(record)
    children_ids = []
    for child in children:
        children_ids.append(child.id)
    return children_ids


def get_all_parents(record, parents=None):
    if parents is None:
        parents = []
    if record is None:
        return []
    if record.parent is not None:
        parents.append(record.parent)
        get_all_parents(record.parent, parents)
    return parents


def get_all_parents_dict(record, parents=None):
    if parents is None:
        parents = []
    if record is None:
        return []
    if record['parent'] is not None:
        parents.append(record['parent'])
        get_all_parents_dict(record['parent'], parents)
    return parents


def get_level(model, parent_id=None):
    """
    Calculate the level for a record based on its parent.
    Raises ValueError if parent_id is provided but parent is not found.
    This allows proper error handling in service layer instead of abort() in event listeners.
    """
    if parent_id is not None:
        # Convert parent_id to int if it's a string
        if isinstance(parent_id, str):
            try:
                parent_id = int(parent_id)
            except (ValueError, TypeError):
                raise ValueError(f"Invalid parent_id: {parent_id}. {messages.PARENT_NOT_FOUND}")
        
        parent = model.get_one(parent_id)
        if parent is None:
            raise ValueError(f"Parent with id {parent_id} not found. {messages.PARENT_NOT_FOUND}")
        # Ensure parent is a model instance, not a dict
        if isinstance(parent, dict):
            level = parent.get('level', 1) + 1
        else:
            level = parent.level + 1
    else:
        level = 1
    return level
