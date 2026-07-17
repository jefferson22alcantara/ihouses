from types import SimpleNamespace

from app.mapping import listing_to_dict


def _fake_listing(**overrides: object) -> SimpleNamespace:
    defaults = dict(
        address=SimpleNamespace(
            title="Jan Tooropstraat 7-K",
            street_name="Jan Tooropstraat",
            house_number="7-K",
            city="Amsterdam",
            neighbourhood="Overtoomse Veld-Zuid",
        ),
        price=SimpleNamespace(amount=1760.0),
        urls=SimpleNamespace(full="https://www.funda.nl/detail/huur/amsterdam/x/1/"),
        description=None,
        rooms=SimpleNamespace(total=3),
        areas=SimpleNamespace(living=74),
        property_details=SimpleNamespace(object_type="apartment", energy_label="A"),
    )
    defaults.update(overrides)
    return SimpleNamespace(**defaults)


def test_listing_to_dict_maps_core_fields() -> None:
    result = listing_to_dict(_fake_listing())

    assert result is not None
    assert result["title"] == "Jan Tooropstraat 7-K"
    assert result["city"] == "Amsterdam"
    assert result["price"] == 1760.0
    assert result["url"] == "https://www.funda.nl/detail/huur/amsterdam/x/1/"
    assert result["source"] == "Funda"


def test_listing_to_dict_synthesizes_description_when_missing() -> None:
    result = listing_to_dict(_fake_listing(description=None))

    assert result is not None
    assert "Amsterdam" in result["description"]
    assert "74 m2" in result["description"]


def test_listing_to_dict_uses_real_description_when_present() -> None:
    result = listing_to_dict(_fake_listing(description="Prachtig appartement met balkon."))

    assert result is not None
    assert result["description"] == "Prachtig appartement met balkon."


def test_listing_to_dict_returns_none_when_price_missing() -> None:
    result = listing_to_dict(_fake_listing(price=SimpleNamespace(amount=None)))

    assert result is None


def test_listing_to_dict_returns_none_when_city_missing() -> None:
    listing = _fake_listing()
    listing.address.city = None

    assert listing_to_dict(listing) is None


def test_listing_to_dict_returns_none_on_unexpected_shape() -> None:
    assert listing_to_dict(SimpleNamespace()) is None


def test_listing_to_dict_falls_back_to_street_address_for_title() -> None:
    listing = _fake_listing()
    listing.address.title = None

    result = listing_to_dict(listing)

    assert result is not None
    assert result["title"] == "Jan Tooropstraat 7-K"
