/** SAFE-01 report reasons. */

export const REPORT_REASONS = [
  "Artículo prohibido",
  "Estafa o engaño",
  "Comportamiento inapropiado",
  "Otro",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export function isReportReason(value: string): value is ReportReason {
  return (REPORT_REASONS as readonly string[]).includes(value);
}
