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


@lru_cache
def get_settings() -> Settings:
    return Settings()
