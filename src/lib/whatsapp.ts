export function buildWhatsAppDmLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppShareLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function buildHandoffMessage(params: {
  senderName: string;
  itemTitle: string;
  district: string;
}): string {
  return `Hola, soy ${params.senderName} de Barrio (${params.district}). Te escribo por: ${params.itemTitle}. ¿Cuándo te viene bien coordinar la entrega?`;
}

/** Person who has the item → DM to whoever posted the Pido. */
export function buildPidoOfferMessage(params: {
  senderName: string;
  district: string;
  askTitle: string;
}): string {
  return `Hola, soy ${params.senderName} de Barrio (${params.district}). Vi tu pedido «${params.askTitle}». Yo tengo — te mando foto por aquí para que veas y coordinamos la entrega.`;
}

export function getPostPublicUrl(postId: string): string | undefined {
  const base = import.meta.env.VITE_APP_PUBLIC_URL?.replace(/\/$/, "");
  if (!base) {
    return undefined;
  }
  return `${base}/feed/${postId}`;
}

export function buildPostShareMessage(params: {
  typeLabel: string;
  title: string;
  district: string;
  postUrl?: string;
}): string {
  const lead = `${params.typeLabel} en ${params.district}: ${params.title}`;
  if (params.postUrl) {
    return `${lead} — ${params.postUrl}`;
  }
  return `${lead} — mira en Barrio.`;
}
