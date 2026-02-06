from enum import Enum


class MEReportAction(Enum):
    CREATE = 'CREATE'
    SUBMIT = 'SUBMIT'
    APPROVE = 'APPROVE'
    REVISE = 'REVISE'
    COMPLETE = 'COMPLETE'
