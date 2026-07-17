import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import redis.asyncio as redis
from fastapi import FastAPI

from app import db, pipeline
from app.config import get_settings

logger = logging.getLogger("ihouses.main")
settings = get_settings()

SCRAPE_INTERVAL_SECONDS = 30


async def _scrape_loop() -> None:
    while True:
        await asyncio.sleep(SCRAPE_INTERVAL_SECONDS)
        try:
            async with db.get_session() as session:
                created = await pipeline.run_scrape_cycle(session)
                if created:
                    logger.info("Scrape cycle produced %d alert(s)", len(created))
        except Exception:
            logger.exception("Scrape cycle failed")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    db.init_engine()
    redis_client = redis.from_url(str(settings.redis_url))
    app.state.redis = redis_client

    scrape_task = asyncio.create_task(_scrape_loop())

    yield

    scrape_task.cancel()
    await redis_client.aclose()
    await db.dispose_engine()


app = FastAPI(title="Ihouses", lifespan=lifespan)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/scrape/trigger")
async def trigger_scrape() -> dict[str, object]:
    """Manually runs one scrape cycle immediately, for local testing without
    waiting on the background interval.
    """
    async with db.get_session() as session:
        created = await pipeline.run_scrape_cycle(session)
    return {
        "matches": len(created),
        "alerts": [
            {
                "listing_title": alert.listing_title,
                "listing_price": float(alert.listing_price) if alert.listing_price else None,
                "sent_to_telegram": alert.sent_to_telegram,
            }
            for alert in created
        ],
    }
