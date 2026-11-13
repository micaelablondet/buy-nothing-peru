/** DISC-01 post-handoff micro-survey options. */

export const DISC_ANSWERS = [
  "Por el grupo de WhatsApp",
  "No lo habría hecho",
  "De otra forma",
] as const;

export type DiscAnswer = (typeof DISC_ANSWERS)[number];

export function isDiscAnswer(value: string): value is DiscAnswer {
  return (DISC_ANSWERS as readonly string[]).includes(value);
}
