import logging
import uuid
from datetime import datetime, timezone

import redis.asyncio as redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app import dedup, llm, telegram
from app.matching import matches
from app.models import AlertHistory, SearchFilter, User
from app.scraping import Listing, fetch_new_listing

logger = logging.getLogger("ihouses.pipeline")


async def active_search_cities(session: AsyncSession) -> list[str]:
    """Cities at least one active search filter cares about — used to scope
    real scraper calls instead of crawling blindly.
    """
    result = await session.execute(
        select(SearchFilter.city).where(SearchFilter.is_active.is_(True)).distinct()
    )
    return [city for (city,) in result.all()]


async def run_scrape_cycle(
    session: AsyncSession,
    listings: list[Listing] | None = None,
    redis_client: redis.Redis | None = None,
) -> list[AlertHistory]:
    """Runs one scraping pass: for each new (post-dedup) listing, match it
    against every active filter, generate a motivation letter for each
    match, alert the user on Telegram, and record the result.
    """
    listings = listings if listings is not None else [fetch_new_listing()]

    if redis_client is not None:
        listings = [listing for listing in listings if await dedup.is_new_listing(redis_client, listing.url)]

    if not listings:
        return []

    result = await session.execute(
        select(SearchFilter)
        .where(SearchFilter.is_active.is_(True))
        .options(selectinload(SearchFilter.user).selectinload(User.profile))
    )
    active_filters = result.scalars().all()

    created: list[AlertHistory] = []
    for listing in listings:
        for search_filter in active_filters:
            if not matches(listing, search_filter):
                continue

            user = search_filter.user
            profile = user.profile
            if profile is None:
                logger.warning("Skipping match for user %s: no profile configured", user.id)
                continue

            letter = llm.generate_motivation_letter(profile, listing)
            message = (
                f"*Nieuwe match!* {listing.title}\n"
                f"{listing.city} — €{listing.price:.0f}/maand ({listing.source})\n"
                f"{listing.url}\n\n"
                f"Motivatiebrief:\n{letter}"
            )
            sent = await telegram.send_alert(user.telegram_chat_id, message)

            alert = AlertHistory(
                id=uuid.uuid4(),
                user_id=user.id,
                listing_title=listing.title,
                listing_price=listing.price,
                listing_url=listing.url,
                listing_source=listing.source,
                motivation_letter=letter,
                sent_to_telegram=sent,
                created_at=datetime.now(timezone.utc),
            )
            session.add(alert)
            created.append(alert)

    if created:
        await session.commit()
    return created
