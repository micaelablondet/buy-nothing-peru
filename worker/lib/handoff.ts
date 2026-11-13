/** HAND-01 / HAND-02: WhatsApp link + who may see numbers. */

export function canRevealWhatsApp(input: {
  postStatus: string;
  viewerId: string;
  authorId: string;
  chosenResponderId: string | null;
}): boolean {
  if (input.postStatus !== "chosen" && input.postStatus !== "delivered") {
    return false;
  }
  if (!input.chosenResponderId) {
    return false;
  }
  return (
    input.viewerId === input.authorId ||
    input.viewerId === input.chosenResponderId
  );
}

/** Who taps Entregado: Regalo poster; Pido chosen offerer. */
export function isGiver(input: {
  postType: "regalo" | "pido";
  viewerId: string;
  authorId: string;
  chosenResponderId: string | null;
}): boolean {
  if (input.postType === "regalo") {
    return input.viewerId === input.authorId;
  }
  return Boolean(
    input.chosenResponderId && input.viewerId === input.chosenResponderId,
  );
}

export function isReceiver(input: {
  postType: "regalo" | "pido";
  viewerId: string;
  authorId: string;
  chosenResponderId: string | null;
}): boolean {
  if (input.postType === "regalo") {
    return Boolean(
      input.chosenResponderId && input.viewerId === input.chosenResponderId,
    );
  }
  return input.viewerId === input.authorId;
}

export function buildWhatsAppUrl(e164: string, text: string): string {
  const digits = e164.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function handoffPrefill(otherName: string, postTitle: string): string {
  return `Hola ${otherName}, te escribo por «${postTitle}» en Barrio. ¿Coordinamos el recojo?`;
}
