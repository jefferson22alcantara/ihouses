from app import dedup


class _FakeRedis:
    """Minimal stand-in for redis.asyncio.Redis.set(nx=..., ex=...):
    stores keys in memory and mirrors SET NX semantics (only succeeds if
    the key is absent).
    """

    def __init__(self) -> None:
        self._store: dict[str, str] = {}

    async def set(self, key: str, value: str, nx: bool = False, ex: int | None = None) -> bool:
        if nx and key in self._store:
            return False
        self._store[key] = value
        return True


async def test_is_new_listing_true_on_first_sighting() -> None:
    redis_client = _FakeRedis()
    assert await dedup.is_new_listing(redis_client, "https://example.com/listing/1") is True


async def test_is_new_listing_false_on_repeat_sighting() -> None:
    redis_client = _FakeRedis()
    url = "https://example.com/listing/1"

    assert await dedup.is_new_listing(redis_client, url) is True
    assert await dedup.is_new_listing(redis_client, url) is False


async def test_is_new_listing_distinguishes_urls() -> None:
    redis_client = _FakeRedis()
    assert await dedup.is_new_listing(redis_client, "https://example.com/1") is True
    assert await dedup.is_new_listing(redis_client, "https://example.com/2") is True
