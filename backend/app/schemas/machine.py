from pydantic import BaseModel, Field


class MachineCharacteristicsBase(BaseModel):
    sbraccio_max: float | None = Field(None, ge=10, le=100, description="Sbraccio massimo (10-100 m)")
    carico_punta_tiro2: float | None = Field(None, ge=0, le=50000)
    carico_punta_tiro24: float | None = Field(None, ge=0, le=50000)
    carico_max_tiro2: float | None = Field(None, ge=0, le=100000)
    escursione_carrello_tiro2: float | None = Field(None, ge=0, le=50)
    carico_max_tiro24: float | None = Field(None, ge=0, le=100000)
    escursione_carrello_tiro24: float | None = Field(None, ge=0, le=50)
    altezza_max: float | None = Field(None, ge=5, le=200)
    diametro_funi_sollevamento: float | None = Field(None, ge=0, le=100)
    diametro_fune_carrello: float | None = Field(None, ge=0, le=100)


class MachineCharacteristicsCreate(MachineCharacteristicsBase):
    pass


class MachineCharacteristicsUpdate(MachineCharacteristicsBase):
    pass


class MachineCharacteristicsResponse(MachineCharacteristicsBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
