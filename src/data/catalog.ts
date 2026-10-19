/** First launch district — seed data and facilitator tests use this distrito. */
export const PILOT_DISTRICT = "Barranco" as const;

export const districts = [
  PILOT_DISTRICT,
  "Miraflores",
  "San Isidro",
  "Santiago de Surco",
] as const;

export const categories = [
  "Hogar",
  "Ropa",
  "Electrónicos",
  "Libros",
  "Bebés",
  "Otros",
] as const;

/** Feed chip filter — Ropa includes ropa de bebé (categoría Bebés). */
export function postMatchesFeedCategory(
  postCategory: string,
  feedCategory: string | null,
): boolean {
  if (feedCategory === null) {
    return true;
  }
  if (feedCategory === "Ropa") {
    return postCategory === "Ropa" || postCategory === "Bebés";
  }
  return postCategory === feedCategory;
}

export const communityRules = [
  "Aquí nada se vende: todo se regala o se pide entre vecinos.",
  "Elige con calma a quién le das o prestas; no es por orden de llegada.",
  "Coordina la entrega por WhatsApp.",
  "Entrega segura: en persona, con el portero o vigilante de tu edificio, o en un lugar público — como les quede más cómodo.",
  "Si alguien pide plata, repórtalo. Aquí no hay transacciones.",
] as const;

export const pickupTips = [
  "Dejar con el portero del edificio",
  "Encontrarse en un parque o café cercano",
  "Dejar en recepción acordada",
] as const;
