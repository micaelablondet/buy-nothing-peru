/**
 * POST-08 retired (DEC-28): categories removed from the product UI.
 * The DB column remains; new posts store this fixed default.
 */

export const DEFAULT_POST_CATEGORY = "Otros";

/** Kept for legacy rows / seed data only — not exposed in UI. */
export const POST_CATEGORIES = [
  "Ropa",
  "Calzado",
  "Muebles",
  "Electrodomésticos",
  "Electrónica",
  "Libros y útiles",
  "Juguetes y bebé",
  "Hogar y cocina",
  "Plantas y jardín",
  "Otros",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export function isPostCategory(value: string): value is PostCategory {
  return (POST_CATEGORIES as readonly string[]).includes(value);
}
