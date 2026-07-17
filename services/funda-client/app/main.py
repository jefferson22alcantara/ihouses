import asyncio
import logging
import time

from fastapi import FastAPI, HTTPException, Query
from funda import Funda

from app.mapping import listing_to_dict

logger = logging.getLogger("funda-client")

MIN_REQUEST_INTERVAL_SECONDS = 2.0
REQUEST_TIMEOUT_SECONDS = 20.0


class RateLimiter:
    """Serializes outbound calls to Funda's API with a minimum gap between
    them, per NOTICE.md's operational commitment to not hammer an API we
    don't have explicit permission to use.
    """

    def __init__(self, min_interval: float) -> None:
        self._min_interval = min_interval
        self._lock = asyncio.Lock()
        self._last_call = 0.0

    async def wait(self) -> None:
        async with self._lock:
            elapsed = time.monotonic() - self._last_call
            if elapsed < self._min_interval:
                await asyncio.sleep(self._min_interval - elapsed)
            self._last_call = time.monotonic()


rate_limiter = RateLimiter(MIN_REQUEST_INTERVAL_SECONDS)

app = FastAPI(title="funda-client")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


def _search_sync(city: str, max_price: float | None) -> list:
    with Funda(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        kwargs: dict[str, object] = {"category": "rent", "sort": "newest"}
        if max_price is not None:
            kwargs["max_price"] = max_price
        return client.search(city, **kwargs)


@app.get("/listings")
async def get_listings(
    city: str = Query(..., min_length=1),
    max_price: float | None = None,
) -> dict[str, object]:
    await rate_limiter.wait()
    try:
        results = await asyncio.to_thread(_search_sync, city, max_price)
    except Exception:
        logger.exception("pyfunda search failed for city=%s", city)
        raise HTTPException(status_code=502, detail="funda upstream error") from None

    listings = [mapped for item in results if (mapped := listing_to_dict(item)) is not None]
    skipped = len(results) - len(listings)
    if skipped:
        logger.warning("Skipped %d malformed listing(s) for city=%s", skipped, city)

    return {"listings": listings}
