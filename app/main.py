import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import redis.asyncio as redis
from fastapi import FastAPI
from pydantic import BaseModel

from app import db, llm, pipeline
from app.config import get_settings
from app.scraping import Listing

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


class MotivationLetterProfile(BaseModel):
    profession: str | None = None
    income_monthly: float | None = None
    has_pets: bool = False
    lifestyle: str | None = None


class MotivationLetterListing(BaseModel):
    title: str
    price: float
    description: str
    city: str
    url: str = ""
    source: str = ""


class MotivationLetterRequest(BaseModel):
    profile: MotivationLetterProfile
    listing: MotivationLetterListing


class MotivationLetterResponse(BaseModel):
    letter: str


@app.post("/motivation-letter")
async def create_motivation_letter(
    payload: MotivationLetterRequest,
) -> MotivationLetterResponse:
    """Generates a Dutch motivation letter for a listing a user applies to
    directly from the dashboard (the "Easy Apply" flow), reusing the same
    prompt and fallback template as the background scrape pipeline.
    """
    listing = Listing(
        title=payload.listing.title,
        price=payload.listing.price,
        description=payload.listing.description,
        url=payload.listing.url,
        city=payload.listing.city,
        source=payload.listing.source,
    )
    letter = await asyncio.to_thread(
        llm.generate_motivation_letter, payload.profile, listing
    )
    return MotivationLetterResponse(letter=letter)


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
