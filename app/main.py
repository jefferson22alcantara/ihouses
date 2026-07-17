import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import redis.asyncio as redis
from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app import db, llm, pipeline
from app.config import get_settings
from app.scraping import FundaAdapterScraper, Listing, fetch_new_listing

logger = logging.getLogger("ihouses.main")
settings = get_settings()


async def _collect_listings(session: AsyncSession) -> list[Listing]:
    if not settings.funda_enabled:
        return [fetch_new_listing()]

    cities = await pipeline.active_search_cities(session)
    if not cities:
        return []

    scraper = FundaAdapterScraper()
    collected: list[Listing] = []
    for city in cities:
        try:
            collected.extend(await scraper.fetch_listings(city))
        except Exception:
            logger.exception("Funda scraper failed for city=%s", city)
    return collected


async def _scrape_loop() -> None:
    while True:
        await asyncio.sleep(settings.scrape_interval_seconds)
        try:
            async with db.get_session() as session:
                listings = await _collect_listings(session)
                created = await pipeline.run_scrape_cycle(
                    session, listings=listings, redis_client=app.state.redis
                )
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
    """Manually runs one scrape cycle immediately (using the same real/mock
    source selection as the background loop), for testing without waiting
    on the interval.
    """
    async with db.get_session() as session:
        listings = await _collect_listings(session)
        created = await pipeline.run_scrape_cycle(session, listings=listings, redis_client=app.state.redis)
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
