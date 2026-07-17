import httpx
import pytest

from app.scraping.funda_adapter import FundaAdapterScraper


def _transport(handler) -> httpx.MockTransport:
    return httpx.MockTransport(handler)


async def test_fetch_listings_maps_valid_payload() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.params["city"] == "amsterdam"
        return httpx.Response(
            200,
            json={
                "listings": [
                    {
                        "title": "Jan Tooropstraat 7-K",
                        "city": "Amsterdam",
                        "price": 1760.0,
                        "url": "https://www.funda.nl/detail/huur/amsterdam/x/1/",
                        "description": "Apartment, 74 m2, 3 rooms.",
                        "source": "Funda",
                    }
                ]
            },
        )

    scraper = FundaAdapterScraper(base_url="http://funda-client", transport=_transport(handler))
    listings = await scraper.fetch_listings("amsterdam")

    assert len(listings) == 1
    assert listings[0].title == "Jan Tooropstraat 7-K"
    assert listings[0].price == 1760.0
    assert listings[0].source == "Funda"


async def test_fetch_listings_skips_malformed_items() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={
                "listings": [
                    {"title": "Missing price", "city": "Amsterdam", "url": "https://x", "description": "d"},
                    {
                        "title": "Valid",
                        "city": "Amsterdam",
                        "price": 1500,
                        "url": "https://y",
                        "description": "d",
                    },
                ]
            },
        )

    scraper = FundaAdapterScraper(base_url="http://funda-client", transport=_transport(handler))
    listings = await scraper.fetch_listings("amsterdam")

    assert len(listings) == 1
    assert listings[0].title == "Valid"


async def test_fetch_listings_returns_empty_on_upstream_error() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(502)

    scraper = FundaAdapterScraper(base_url="http://funda-client", transport=_transport(handler))
    listings = await scraper.fetch_listings("amsterdam")

    assert listings == []


@pytest.mark.parametrize("empty_payload", [{"listings": []}, {}])
async def test_fetch_listings_handles_empty_results(empty_payload: dict) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json=empty_payload)

    scraper = FundaAdapterScraper(base_url="http://funda-client", transport=_transport(handler))
    listings = await scraper.fetch_listings("amsterdam")

    assert listings == []
