from pydantic import BaseModel


class MassBase(BaseModel):
    componente: str
    massa_kg: float | None = None
    braccio_m: float | None = None
    posizione: str | None = None
    utilizzato: bool = True


class MassCreate(MassBase):
    pass


class MassUpdate(BaseModel):
    componente: str | None = None
    massa_kg: float | None = None
    braccio_m: float | None = None
    posizione: str | None = None
    utilizzato: bool | None = None


class MassResponse(MassBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
