# Notice: AGPL-3.0 dependency and Funda ToS risk

This service (`services/funda-client/`) exists **only** to isolate
[`pyfunda`](https://github.com/0xMH/pyfunda) — an AGPL-3.0-licensed, reverse-engineered
client for Funda's internal mobile-app API — away from the proprietary Ihouses backend
(`app/`).

## Why this is a separate service, not a Python import in `app/`

`pyfunda` is licensed AGPL-3.0. Under AGPL section 13 ("Remote Network Interaction"),
running a modified or combined version of an AGPL program as a network service can
require offering the complete corresponding source of that combined program to every
user who interacts with it over the network.

`app/` is the proprietary part of Ihouses (matching logic, user data, LLM prompts,
monetization). To avoid pulling that code under AGPL obligations, `pyfunda` is only ever
imported here, in this standalone service, which:

- Has its own `requirements.txt`, `Dockerfile`, and this `LICENSE` (verbatim AGPL-3.0,
  copied from the upstream repository).
- Exposes a narrow internal HTTP API (`GET /listings`) — `app/` talks to it over the
  network via `httpx`, the same way it would talk to any third-party API. It never
  imports `pyfunda` directly.

This is a common, but **not legally guaranteed**, mitigation pattern. It has not been
reviewed by a lawyer. If you are relying on this isolation for a real business, get real
legal advice before shipping it to paying customers.

## Funda Terms of Service risk

`pyfunda` talks to Funda's undocumented, app-facing JSON API (`*.funda.io`), not their
public website. The library's own README states:

> Using this library may violate Funda's Terms of Service... This project is intended
> for personal use, research, and educational purposes only.

Funda has no public developer API and has pursued unauthorized scrapers before. Using
this data source in a commercial product carries real legal risk that has **not** been
independently assessed here.

## Decision record

- **2026-07-17**: the project owner (jefferson22alcantara@gmail.com) was shown both risks
  above (AGPL-3.0 copyleft exposure and Funda ToS violation risk) and explicitly accepted
  them, asking for `pyfunda` to be integrated behind this isolated service. See the
  `FUNDA_ENABLED` flag in `app/config.py` — it defaults to `false`, so this data source
  must be turned on deliberately in any environment.

## Operational note

Be a good citizen of the API you did not get permission to use: this service rate-limits
requests and only fetches rental (`category="rent"`) search results for cities that at
least one active `search_filters` row cares about — no bulk/background crawling of the
whole catalog.
