from app.core import BaseService
from app.signals import user_created

from .model import Cycle
from .resource import CycleList, CycleView
from .schema import CycleSchema


class CycleService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Cycle
        self.schema = CycleSchema
        self.resources = [
            {'resource': CycleList, 'url': '/cycles'},
            {'resource': CycleView, 'url': '/cycles/<int:record_id>'}
        ]

    def get_init_cycles(self):
        cycles = self.model.get_list(per_page=1, sort_field='sequence')
        return cycles[0] if len(cycles) > 0 else None

    def get_init_cycle_id(self):
        init_cycle = self.get_init_cycles()
        return init_cycle.id if init_cycle is not None else None
