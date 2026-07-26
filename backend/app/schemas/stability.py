from pydantic import BaseModel


class StabilityParamBase(BaseModel):
    parametro: str
    valore: float | None = None
    descrizione: str | None = None


class StabilityParamCreate(StabilityParamBase):
    pass


class StabilityParamUpdate(BaseModel):
    parametro: str | None = None
    valore: float | None = None
    descrizione: str | None = None


class StabilityParamResponse(StabilityParamBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
