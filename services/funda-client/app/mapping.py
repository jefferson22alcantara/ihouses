"""Maps pyfunda's Listing objects to the shared Listing contract used by the
Ihouses backend (app/scraping/base.py): title, price, description, url, city, source.
"""

from typing import Any


def listing_to_dict(item: Any) -> dict[str, object] | None:
    """Returns None for listings missing the fields the pipeline requires,
    so callers can skip them instead of propagating a malformed record.
    """
    try:
        address = item.address
        price = item.price
        urls = item.urls
        if not address or not address.city or price is None or price.amount is None or not urls or not urls.full:
            return None

        title = address.title or f"{address.street_name or ''} {address.house_number or ''}".strip()
        return {
            "title": title or "Woning",
            "city": address.city,
            "price": float(price.amount),
            "url": urls.full,
            "description": item.description or _synthesize_description(item),
            "source": "Funda",
        }
    except (AttributeError, TypeError, ValueError):
        return None


def _synthesize_description(item: Any) -> str:
    """pyfunda search results don't include a free-text description (only
    listing() detail calls do); we don't fetch details per-item to keep the
    request volume low, so build a compact one from structured fields.
    """
    address = item.address
    rooms = item.rooms
    areas = item.areas
    details = item.property_details

    parts: list[str] = []
    if details is not None and details.object_type:
        parts.append(details.object_type.capitalize())
    if address.neighbourhood:
        parts.append(f"in {address.neighbourhood}, {address.city}")
    else:
        parts.append(f"in {address.city}")
    if areas is not None and areas.living:
        parts.append(f"{areas.living} m2")
    if rooms is not None and rooms.total:
        parts.append(f"{rooms.total} rooms")
    if details is not None and details.energy_label:
        parts.append(f"energy label {details.energy_label}")

    return ", ".join(parts) + "." if parts else "Geen beschrijving beschikbaar."
