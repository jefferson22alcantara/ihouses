import logging

import httpx

from app.config import get_settings
from app.scraping.base import Listing

logger = logging.getLogger("ihouses.scraping.funda")


class FundaAdapterScraper:
    """Talks to the isolated funda-client service (services/funda-client/)
    over HTTP instead of importing pyfunda directly — see
    services/funda-client/NOTICE.md for why this is a separate process.
    """

    source = "Funda"

    def __init__(
        self,
        base_url: str | None = None,
        timeout: float = 15.0,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        settings = get_settings()
        self._base_url = base_url or settings.funda_client_url
        self._timeout = timeout
        self._transport = transport

    async def fetch_listings(self, city: str) -> list[Listing]:
        async with httpx.AsyncClient(
            base_url=self._base_url, timeout=self._timeout, transport=self._transport
        ) as client:
            try:
                response = await client.get("/listings", params={"city": city})
                response.raise_for_status()
            except httpx.HTTPError:
                logger.exception("funda-client request failed for city=%s", city)
                return []

        payload = response.json()
        listings: list[Listing] = []
        for item in payload.get("listings", []):
            try:
                listings.append(
                    Listing(
                        title=item["title"],
                        price=float(item["price"]),
                        description=item["description"],
                        url=item["url"],
                        city=item["city"],
                        source="Funda",
                    )
                )
            except (KeyError, TypeError, ValueError):
                logger.warning("Skipping malformed listing from funda-client: %r", item)
        return listings
