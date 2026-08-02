from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class _StrictFloatMixin(BaseModel):
    model_config = ConfigDict(allow_inf_nan=False)


class CoefficientCreate(_StrictFloatMixin):
    modulo: str = Field(..., min_length=1, max_length=50, description="Modulo di calcolo (es. vento, stabilita_q)")
    nome: str = Field(..., min_length=1, max_length=100, description="Identificativo univoco nel modulo")
    descrizione: str | None = Field(None, max_length=255)
    valore: float = Field(..., description="Valore numerico (publicato) iniziale")


class CoefficientUpdate(_StrictFloatMixin):
    """Solo la bozza è modificabile: mai il valore pubblicato direttamente."""

    valore_bozza: float | None = Field(None, description="Valore di bozza, non ancora attivo")
    descrizione: str | None = Field(None, max_length=255)


class CoefficientResponse(BaseModel):
    id: int
    modulo: str
    nome: str
    descrizione: str | None
    valore_pubblicato: float
    valore_bozza: float | None
    modificato_da: str | None
    modificato_il: datetime | None
    storico: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PublishResponse(BaseModel):
    message: str
    coefficiente: CoefficientResponse
