/** Demo photos: local assets + verified Unsplash IDs (404-safe). */
const base = import.meta.env.BASE_URL;

const local = (path: string) => `${base}${path}`;

const u = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?w=640&h=480&fit=crop&q=80`;

export const seedImageUrls = {
  microwave: [local("seed/microondas.webp")],
  babyClothes: [local("seed/ropa-bebe.webp")],
  desk: [u("photo-1593062096033-9a26b09da705")],
  books: [u("photo-1544947950-fa07a98d237f")],
  diningChairs: [u("photo-1549497538-303791108f95")],
  jacket: [u("photo-1556821840-3a63f95609a7")],
  cookingPot: [u("photo-1556911220-e15b29be8c8f")],
  floorLamp: [local("seed/lampara-de-pie.webp")],
  pomosConTapa: [local("seed/pomos-con-tapa.jpg")],
  defaultPost: [local("seed/pomos-con-tapa.jpg")],
} as const;

/** Bump when seed image URLs change so persisted demos refresh. */
export const SEED_IMAGES_VERSION = 11;
