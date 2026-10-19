import { categories } from "@/data/catalog";

type Category = (typeof categories)[number];

const rules: { pattern: RegExp; category: Category }[] = [
  { pattern: /beb[eé]|pa[ñn]al|body|romper|bebe/i, category: "Bebés" },
  { pattern: /libro|novela|lectura|comic/i, category: "Libros" },
  {
    pattern: /ropa|chaqueta|camis|pantal|zapat|vestido|polera/i,
    category: "Ropa",
  },
  {
    pattern: /microond|monitor|hdmi|laptop|celular|electr|televisor|tablet/i,
    category: "Electrónicos",
  },
  {
    pattern: /planta|maceta|jard[ií]n|flor|silla|mesa|escritorio|l[aá]mpara|olla|hogar|mueble/i,
    category: "Hogar",
  },
];

/** Prototype: guess category from title + description (no user picker). */
export function inferCategory(title: string, description: string): Category {
  const text = `${title} ${description}`;
  for (const { pattern, category } of rules) {
    if (pattern.test(text)) {
      return category;
    }
  }
  return "Otros";
}
