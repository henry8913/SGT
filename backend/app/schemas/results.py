from datetime import datetime

from pydantic import BaseModel


class ResultBase(BaseModel):
    step: str
    dati: str


class ResultCreate(ResultBase):
    pass


class ResultResponse(ResultBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True
