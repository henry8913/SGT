from datetime import datetime

from pydantic import BaseModel


class FormulaBase(BaseModel):
    step: str
    sheet: str
    campo: str
    label: str | None = None
    cell_type: str | None = "formula"
    formula: str
    default_value: str | None = None
    dipende_da: str | None = None


class FormulaCreate(FormulaBase):
    pass


class FormulaUpdate(BaseModel):
    step: str | None = None
    sheet: str | None = None
    campo: str | None = None
    label: str | None = None
    cell_type: str | None = None
    formula: str | None = None
    default_value: str | None = None
    dipende_da: str | None = None


class FormulaResponse(FormulaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
