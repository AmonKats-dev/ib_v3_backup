from app.core import BaseService
from app.signals import user_created

from .model import Phase
from .resource import PhaseList, PhaseView
from .schema import PhaseSchema


class PhaseService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Phase
        self.schema = PhaseSchema
        self.resources = [
            {'resource': PhaseList, 'url': '/phases'},
            {'resource': PhaseView, 'url': '/phases/<int:record_id>'}
        ]

    def get_init_phase(self):
        phases = self.model.get_list(per_page=1, sort_field='sequence')
        return phases[0] if len(phases) > 0 else None

    def get_init_phase_id(self):
        init_phase = self.get_init_phase()
        return init_phase.id if init_phase is not None else None

    def get_last_phase(self):
        phases = self.model.get_list(
            per_page=1, sort_field='sequence', sort_order='DESC')
        return phases[0] if len(phases) > 0 else None

    def get_last_phase_id(self):
        last_phase = self.get_last_phase()
        return last_phase.id if last_phase is not None else None
