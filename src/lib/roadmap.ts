/**
 * Product phases — see Barrio — Product Brief.md § Roadmap
 */

/** Phase 1 (now): Buy Nothing — Regalo + Pido in the clickable prototype. */
export const PHASE_BUY_NOTHING = "buynothing" as const;

/** Phase 2 (next): lend physical items (Presto cosas). */
export const PHASE_PRESTO_COSAS = "presto_cosas" as const;

/** Phase 3 (later): service barter (Presto Servicios). */
export const PHASE_PRESTO_SERVICIOS = "presto_servicios" as const;

export type ProductPhase =
  | typeof PHASE_BUY_NOTHING
  | typeof PHASE_PRESTO_COSAS
  | typeof PHASE_PRESTO_SERVICIOS;

/** Neighbors offer a service in exchange for something else — no cash. */
export const FUTURE_LANE_PRESTO_SERVICIOS = "presto_servicios" as const;

export interface PrestoServiciosDraft {
  lane: typeof FUTURE_LANE_PRESTO_SERVICIOS;
  serviceTitle: string;
  serviceCategory: string;
  exchangeOffer: string;
  district: string;
}
