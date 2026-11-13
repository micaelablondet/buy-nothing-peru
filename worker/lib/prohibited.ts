/** SAFE-02 draft list (OQ-07 — Mica reviews final wording). */

export const PROHIBITED_ITEMS = [
  "Armas",
  "Drogas y alcohol",
  "Medicinas",
  "Animales vivos",
  "Objetos robados o ilegales",
  "Comida perecible o abierta",
] as const;

export type ProhibitedItem = (typeof PROHIBITED_ITEMS)[number];
