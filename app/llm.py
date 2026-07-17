from functools import lru_cache

import anthropic

from app.config import get_settings
from app.models import UserProfile
from app.scraping import Listing

MODEL = "claude-opus-4-8"

SYSTEM_PROMPT = """\
Je bent een Nederlandse verhuurmakelaar-assistent die perfecte, overtuigende
motivatiebrieven schrijft voor huurders die reageren op een woning.

Regels:
- Schrijf uitsluitend in vloeiend, grammaticaal perfect Nederlands.
- Toon: beleefd, professioneel, warm — nooit overdreven of wanhopig.
- Lengte: 120-180 woorden, 3-4 alinea's.
- Verwerk expliciet: beroep, (netto) maandinkomen, leefstijl, en of er
  huisdieren zijn, alleen wanneer relevant voor deze specifieke woning.
- Verwijs naar minstens één concreet detail uit de woningomschrijving om te
  laten zien dat de kandidaat de advertentie echt heeft gelezen.
- Sluit af met een korte, natuurlijke uitnodiging voor een bezichtiging.
- Geen placeholders, geen Engels, geen opsommingstekens.
"""


def _fallback_letter(profile: UserProfile, listing: Listing) -> str:
    pets_line = (
        "Ik heb geen huisdieren, wat het onderhoud van de woning eenvoudig houdt."
        if not profile.has_pets
        else "Mijn huisdier is rustig en volledig huisgetraind."
    )
    income = f"{profile.income_monthly:.0f}" if profile.income_monthly else "een stabiel"
    return (
        f"Geachte verhuurder,\n\n"
        f"Met veel interesse heb ik uw advertentie voor \"{listing.title}\" gelezen. "
        f"De ligging in {listing.city} en de beschrijving spreken mij zeer aan.\n\n"
        f"Ik ben werkzaam als {profile.profession or 'professional'} met een maandinkomen "
        f"van circa {income} euro. {pets_line} {profile.lifestyle or ''}\n\n"
        f"Graag zou ik de woning bezichtigen en maak ik mijn sollicitatie compleet met alle "
        f"benodigde documenten. Ik kijk uit naar uw reactie.\n\n"
        f"Met vriendelijke groet"
    ).strip()


@lru_cache
def _client() -> anthropic.Anthropic | None:
    settings = get_settings()
    if not settings.anthropic_api_key:
        return None
    return anthropic.Anthropic(api_key=settings.anthropic_api_key.get_secret_value())


def generate_motivation_letter(profile: UserProfile, listing: Listing) -> str:
    client = _client()
    if client is None:
        return _fallback_letter(profile, listing)

    user_content = (
        f"Kandidaatprofiel:\n"
        f"- Beroep: {profile.profession or 'onbekend'}\n"
        f"- Maandinkomen: {profile.income_monthly or 'onbekend'} euro\n"
        f"- Huisdieren: {'ja' if profile.has_pets else 'nee'}\n"
        f"- Leefstijl: {profile.lifestyle or 'onbekend'}\n\n"
        f"Woning:\n"
        f"- Titel: {listing.title}\n"
        f"- Stad: {listing.city}\n"
        f"- Huurprijs: {listing.price:.0f} euro per maand\n"
        f"- Omschrijving: {listing.description}\n\n"
        f"Schrijf de motivatiebrief."
    )

    response = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        thinking={"type": "adaptive"},
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_content}],
    )
    return next(block.text for block in response.content if block.type == "text")
