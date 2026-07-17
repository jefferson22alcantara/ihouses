from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True, slots=True)
class Listing:
    title: str
    price: float
    description: str
    url: str
    city: str
    source: str


class BaseScraper(Protocol):
    """A source of listings for a given city. Implementations must be
    defensive: a malformed record from the upstream source should be
    skipped (and logged), never raised past `fetch_listings`.
    """

    source: str

    async def fetch_listings(self, city: str) -> list[Listing]: ...
