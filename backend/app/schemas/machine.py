from pydantic import BaseModel


class MachineCharacteristicsBase(BaseModel):
    sbraccio_max: float | None = None
    carico_punta_tiro2: float | None = None
    carico_punta_tiro24: float | None = None
    carico_max_tiro2: float | None = None
    escursione_carrello_tiro2: float | None = None
    carico_max_tiro24: float | None = None
    escursione_carrello_tiro24: float | None = None
    altezza_max: float | None = None
    diametro_funi_sollevamento: float | None = None
    diametro_fune_carrello: float | None = None


class MachineCharacteristicsCreate(MachineCharacteristicsBase):
    pass


class MachineCharacteristicsUpdate(MachineCharacteristicsBase):
    pass


class MachineCharacteristicsResponse(MachineCharacteristicsBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
