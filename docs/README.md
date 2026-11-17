# Docs

These files carry context from one stage of the project to the next. Keep them current. When a requirement changes, update the docs first, then the code.

| File | What it is | Who keeps it current |
|---|---|---|
| `SRD.md` | The software requirements document. The source of truth for what we are building. | Mica (product) |
| `feature-prioritization.csv` | Every requirement ID, with priority, phase and status | Mica (product) |
| `handoff.md` | What stage the project is at, what is real or mocked, and what the next owner does first. Newest entry on top. | Whoever finishes a stage |
| `decisions.md` | Decisions, with reasons, including what we chose not to do (`DEC-*`) | Whoever decides |
| `assumptions-and-questions.md` | Risks and open questions (`R-*`, `OQ-*`) | Mica (product) |

Agent rules live in [`../AGENTS.md`](../AGENTS.md). Setup and launch ops stay in this folder (`m0-setup.md`, `phase0-launch.md`, `m10-admin-portal-setup.md`, `adr/`, `cursor-prompts.md`).

## The relay

For Barrio (solo + coding agents): product writes and maintains the SRD and feature plan; agents implement by requirement ID; whoever finishes a slice updates `handoff.md` before the next owner starts. Each stage reads the docs on arrival and updates them on departure.

## Stable IDs

- Requirements: `AUTH-*`, `PROF-*`, `POST-*`, `RESP-*`, `HAND-*`, `NOTIF-*`, `PUB-*`, `SAFE-*`, `ADMIN-*`, `LEGAL-*`, `ANLY-*`, `DISC-*` (in `SRD.md` and the CSV).
- Decisions: `DEC-*` (in `decisions.md`).
- Risks / open questions: `R-*`, `OQ-*` (in `assumptions-and-questions.md`).
