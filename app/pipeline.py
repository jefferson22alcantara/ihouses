import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app import llm, telegram
from app.matching import matches
from app.models import AlertHistory, SearchFilter, User
from app.scraping import Listing, fetch_new_listing

logger = logging.getLogger("ihouses.pipeline")


async def run_scrape_cycle(session: AsyncSession, listing: Listing | None = None) -> list[AlertHistory]:
    """Simulates one scraping pass: fetch a listing, match it against every
    active filter, generate a motivation letter for each match, alert the
    user on Telegram, and record the result.
    """
    listing = listing or fetch_new_listing()

    result = await session.execute(
        select(SearchFilter)
        .where(SearchFilter.is_active.is_(True))
        .options(selectinload(SearchFilter.user).selectinload(User.profile))
    )
    active_filters = result.scalars().all()

    created: list[AlertHistory] = []
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
