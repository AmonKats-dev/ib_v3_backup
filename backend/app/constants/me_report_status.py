from enum import Enum


class MEReportStatus(Enum):
    DRAFT = 'DRAFT'
    SUBMITTED = 'SUBMITTED'
    APPROVED = 'APPROVED'
    REVISED = 'REVISED'
    COMPLETED = 'COMPLETED'
    ASSIGNED = 'ASSIGNED'
