from pydantic import BaseModel


class WindAreaBase(BaseModel):
    parte: str
    parametro: str
    valore: float | None = None
    coordinata_x: float | None = None
    coordinata_y: float | None = None


class WindAreaCreate(WindAreaBase):
    pass


class WindAreaUpdate(BaseModel):
    parte: str | None = None
    parametro: str | None = None
    valore: float | None = None
    coordinata_x: float | None = None
    coordinata_y: float | None = None


class WindAreaResponse(WindAreaBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True
