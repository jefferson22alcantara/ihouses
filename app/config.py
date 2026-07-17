from functools import lru_cache

from pydantic import PostgresDsn, RedisDsn, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: str = "development"
    debug: bool = False

    database_url: PostgresDsn
    redis_url: RedisDsn

    telegram_bot_token: SecretStr | None = None
    telegram_webhook_secret: SecretStr | None = None

    anthropic_api_key: SecretStr | None = None
    openai_api_key: SecretStr | None = None

    scrape_interval_seconds: int = 30

    # See services/funda-client/NOTICE.md: pyfunda is AGPL-3.0 and its use may
    # violate Funda's Terms of Service. Off by default — only enable after
    # accepting that risk for the target environment.
    funda_enabled: bool = False
    funda_client_url: str = "http://funda-client:8000"


@lru_cache
def get_settings() -> Settings:
    return Settings()
