/** 3D icons from [Thiings](https://www.thiings.co/) — bundled under /public/splash for the demo. */
export const splashFloatingIcons = [
  {
    src: `${import.meta.env.BASE_URL}splash/weights-bench.png`,
    alt: "Banca de pesas",
    label: "Regalo",
    delay: "0s",
    x: "0%",
    y: "8%",
    zIndex: 30,
  },
  {
    src: `${import.meta.env.BASE_URL}splash/neon-windbreaker.png`,
    alt: "Cortavientos neón",
    label: "Regalo",
    delay: "0.35s",
    x: "68%",
    y: "12%",
    zIndex: 15,
  },
  {
    src: `${import.meta.env.BASE_URL}splash/desk-lamp.png`,
    alt: "Lámpara de escritorio",
    label: "Pido",
    delay: "0.7s",
    x: "54%",
    y: "34%",
    zIndex: 12,
  },
  {
    src: `${import.meta.env.BASE_URL}splash/monster-truck.png`,
    alt: "Camión monstruo de juguete",
    label: "Regalo",
    delay: "1.05s",
    x: "22%",
    y: "38%",
    zIndex: 14,
  },
] as const;

/** Draw order: lower z first; bench stays on top. */
export const splashFloatingIconsPaintOrder = [...splashFloatingIcons].sort(
  (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0),
);
