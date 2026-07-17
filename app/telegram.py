import logging

import httpx

from app.config import get_settings

logger = logging.getLogger("ihouses.telegram")

TELEGRAM_API_BASE = "https://api.telegram.org"


async def send_alert(chat_id: str | None, message: str) -> bool:
    """Sends a listing alert to a user's Telegram chat.

    Returns False (and logs instead of sending) when no bot token or chat_id
    is configured, so the pipeline runs end-to-end without real credentials.
    """
    settings = get_settings()
    if not settings.telegram_bot_token or not chat_id:
        logger.info("Telegram alert (mock, not sent):\n%s", message)
        return False

    token = settings.telegram_bot_token.get_secret_value()
    url = f"{TELEGRAM_API_BASE}/bot{token}/sendMessage"

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            url,
            json={
                "chat_id": chat_id,
                "text": message,
                "parse_mode": "Markdown",
                "disable_web_page_preview": False,
            },
        )
        response.raise_for_status()
    return True
