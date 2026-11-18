import type { NotificationType } from "../db/notifications";

export const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  nuevo_interesado: "Nuevo interesado",
  nueva_oferta: "Nueva oferta",
  te_eligieron: "Te eligieron",
  recordatorio: "Recordatorio",
};
