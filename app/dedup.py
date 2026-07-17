import redis.asyncio as redis

_TTL_SECONDS = 7 * 24 * 3600
_KEY_PREFIX = "ihouses:listing:"


async def is_new_listing(redis_client: redis.Redis, url: str) -> bool:
    """Atomically marks `url` as seen and reports whether it was new.

    Uses SET NX EX so concurrent scrape cycles can't both treat the same
    listing as new — the goal is 0% duplicate alerts.
    """
    was_set = await redis_client.set(f"{_KEY_PREFIX}{url}", "1", nx=True, ex=_TTL_SECONDS)
    return bool(was_set)
