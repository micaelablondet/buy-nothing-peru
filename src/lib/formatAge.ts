/** Relative age for feed cards (POST-04): hace X min / hace X h / hace 1 día / hace X días. */

export function formatPostAge(iso: string, now = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return "";
  }
  const minutes = Math.max(0, Math.floor((now - then) / 60_000));
  if (minutes < 60) {
    const m = Math.max(1, minutes);
    return `hace ${m} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `hace ${hours} h`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? "hace 1 día" : `hace ${days} días`;
}
