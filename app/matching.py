from app.models import SearchFilter
from app.scraping import Listing


def matches(listing: Listing, search_filter: SearchFilter) -> bool:
    if listing.city.lower() != search_filter.city.lower():
        return False
    return listing.price <= float(search_filter.max_budget)
