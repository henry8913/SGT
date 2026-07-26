from pydantic import BaseModel


class LoadCurveBase(BaseModel):
    tipo: str
    raggio_m: float
    carico_kg: float | None = None


class LoadCurveCreate(LoadCurveBase):
    pass


class LoadCurveUpdate(BaseModel):
    tipo: str | None = None
    raggio_m: float | None = None
    carico_kg: float | None = None


class LoadCurveResponse(LoadCurveBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
