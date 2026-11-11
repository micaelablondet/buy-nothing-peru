/** Relative age in Spanish (Peru) for post detail. */

export function formatPostAge(iso: string, now = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return "";
  }
  const minutes = Math.max(0, Math.floor((now - then) / 60_000));
  if (minutes < 1) {
    return "hace un momento";
  }
  if (minutes < 60) {
    return minutes === 1 ? "hace 1 minuto" : `hace ${minutes} minutos`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "hace 1 hora" : `hace ${hours} horas`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? "hace 1 día" : `hace ${days} días`;
  }
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "hace 1 semana" : `hace ${weeks} semanas`;
}
