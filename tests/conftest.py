import pytest


@pytest.fixture(autouse=True)
def _required_env(monkeypatch: pytest.MonkeyPatch) -> None:
    """app.config.Settings requires database_url/redis_url with no default;
    tests here never touch a real database or Redis, so dummy values are
    enough to let Settings() construct.
    """
    monkeypatch.setenv("DATABASE_URL", "postgresql+asyncpg://test:test@localhost:5432/test")
    monkeypatch.setenv("REDIS_URL", "redis://localhost:6379/0")
