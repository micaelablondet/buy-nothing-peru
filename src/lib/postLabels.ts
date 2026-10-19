import type { PostType } from "@/lib/types";

export const postTypeLabels: Record<PostType, string> = {
  regalo: "Regalo",
  pido: "Pido",
  presto: "Presto",
};

/** Home feed type tabs (plural — browsing listings). */
export const feedTypeTabLabels: Record<PostType, string> = {
  regalo: "Regalos",
  pido: "Pedidos",
  presto: "Prestos",
};

/** Badge / chip on a single post in feed and search (Pedido, not Pido). */
export const postCardTypeLabels: Record<PostType, string> = {
  regalo: "Regalo",
  pido: "Pedido",
  presto: "Presto",
};

export const postTypeDescriptions: Record<PostType, string> = {
  regalo: "Regalo algo que ya no uso",
  pido: "Pido algo que necesito",
  presto: "Presto por un tiempo",
};
