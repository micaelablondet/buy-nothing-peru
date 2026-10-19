import type { PostType } from "@/lib/types";

export const APP_NAME = "Barrio" as const;

/** MVP phase 1 — Buy Nothing style: Regalo + Pido only (see product brief § Roadmap). */
export const PROTOTYPE_POST_TYPES: PostType[] = ["regalo", "pido"];

export const isPrototypeMultiType = PROTOTYPE_POST_TYPES.length > 1;
