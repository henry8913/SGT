from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./sgt.db"
    secret_key: str = "change-this-secret-key-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    admin__enable: bool = True
    admin__username: str = "admin@local.it"
    admin__password: str = "CambiaQuestaPassword!"


settings = Settings()
