const MONTHS_ES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

export function formatMemberSince(isoDate: string): string {
  const d = new Date(isoDate);
  const month = MONTHS_ES[d.getMonth()] ?? "???";
  return `Miembro desde ${month} ${d.getFullYear()}`;
}

export function formatTimeAgoEs(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) {
    return minutes <= 1 ? "hace un momento" : `hace ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "hace 1 h" : `hace ${hours} h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return days === 1 ? "hace 1 día" : `hace ${days} días`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? "hace 1 mes" : `hace ${months} meses`;
}
