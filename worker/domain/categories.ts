/** POST-08: fixed category list (code-only edits). */

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
