# Cloudflare free-plan limits (OQ-03 / R-07)

Verified against Cloudflare docs (Workers pricing & limits, D1 limits), November 2026. Re-check before Phase 1 if usage grows.

## Workers Free

| Limit | Free plan |
| --- | --- |
| Requests | **100,000 / day** |
| CPU time | **10 ms** per invocation (HTTP); cron also constrained |
| Memory | 128 MB |
| Subrequests / invocation | 50 |
| Workers per account | 100 |
| Cron Triggers | 5 |

## D1 Free

| Limit | Free plan |
| --- | --- |
| Rows read | 5 million / day |
| Rows written | 100,000 / day |
| Storage | 5 GB total (≈500 MB max per DB on Free) |
| Databases | 10 |
| Queries per Worker invocation | 50 |

## R2 Free (typical Workers-linked allowance)

| Limit | Free plan |
| --- | --- |
| Storage | ~10 GB-month |
| Class A ops | ~1M / month |
| Class B ops | ~10M / month |
| Egress | Free |

## Implications for Barrio Phase 0

- Building pilot (~32 apartments) stays well under request and D1 caps if queries stay indexed and light.
- Prefer `SELECT` columns you need; index `district_id` + `status` (already in `0001_foundation.sql`).
- Photo uploads: client-side resize before R2 (SPEC §11) to protect Class A ops and storage.
- Cron (expiry + nudge): at most a few runs/day; keep jobs idempotent (SPEC / AGENTS).

If the Worker hits Error **1027**, the daily request quota was exceeded.
