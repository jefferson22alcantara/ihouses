import random
import uuid
from dataclasses import dataclass

_LISTING_TEMPLATES = [
    {
        "title": "Lichte 2-kamer appartement aan de Amstel",
        "city": "Amsterdam",
        "base_price": 1650,
        "description": "Gerenoveerd appartement met balkon, 5 minuten fietsen van het centrum.",
        "source": "Funda",
    },
    {
        "title": "Studio nabij Vondelpark",
        "city": "Amsterdam",
        "base_price": 1200,
        "description": "Compacte studio, ideaal voor een student of starter, gedeelde tuin.",
        "source": "Kamernet",
    },
    {
        "title": "Ruim appartement in Utrecht Oost",
        "city": "Utrecht",
        "base_price": 1450,
        "description": "3 kamers, eigen parkeerplaats, dicht bij station Utrecht Centraal.",
        "source": "Pararius",
    },
    {
        "title": "Gezellige benedenwoning in Rotterdam Noord",
        "city": "Rotterdam",
        "base_price": 1350,
        "description": "Met tuin, huisdieren toegestaan, per direct beschikbaar.",
        "source": "Funda",
    },
    {
        "title": "Modern appartement bij Den Haag HS",
        "city": "Den Haag",
        "base_price": 1550,
        "description": "Nieuwbouw, energielabel A, dakterras met zeezicht.",
        "source": "Pararius",
    },
]


@dataclass(frozen=True, slots=True)
class Listing:
    title: str
    price: float
    description: str
    url: str
    city: str
    source: str


def fetch_new_listing() -> Listing:
    """Simulates a single newly-scraped listing from a Dutch housing platform.

    Structured as a drop-in seam: swap the body for a real Playwright/BeautifulSoup
    scraper later without touching callers.
    """
    template = random.choice(_LISTING_TEMPLATES)
    price = template["base_price"] + random.choice([-50, 0, 50, 100])
    listing_id = uuid.uuid4().hex[:8]
    return Listing(
        title=template["title"],
        price=float(price),
        description=template["description"],
        url=f"https://www.{template['source'].lower()}.nl/listing/{listing_id}",
        city=template["city"],
        source=template["source"],
    )
