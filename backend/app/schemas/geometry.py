from pydantic import BaseModel


class BeamGeometryBase(BaseModel):
    modulo: str | None = None
    elemento: str | None = None
    profilo: str | None = None
    sezione_tipo: str | None = None
    interasse_vert_sx: float | None = None
    interasse_vert_dx: float | None = None
    interasse_oriz_sx: float | None = None
    interasse_oriz_dx: float | None = None
    lunghezza: float | None = None
    coordinata_x: float | None = None
    coordinata_y: float | None = None
    coordinata_z: float | None = None
    note: str | None = None


class BeamGeometryCreate(BeamGeometryBase):
    pass


class BeamGeometryUpdate(BeamGeometryBase):
    pass


class BeamGeometryResponse(BeamGeometryBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
