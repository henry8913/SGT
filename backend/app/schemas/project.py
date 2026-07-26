from datetime import datetime

from pydantic import BaseModel


class ProjectBase(BaseModel):
    name: str
    notes: str | None = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = None
    notes: str | None = None


class ProjectResponse(ProjectBase):
    id: int
    user_id: int | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectList(BaseModel):
    id: int
    name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
