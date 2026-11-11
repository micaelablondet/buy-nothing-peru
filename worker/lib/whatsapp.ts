/** PROF-02: Peruvian mobile → E.164 (+51 + 9 digits starting with 9). */

export function normalizePeruWhatsApp(
  input: string,
): { ok: true; e164: string } | { ok: false; message: string } {
  const digits = input.replace(/\D/g, "");
  let local: string | null = null;

  if (digits.length === 9 && digits.startsWith("9")) {
    local = digits;
  } else if (
    digits.length === 11 &&
    digits.startsWith("51") &&
    digits[2] === "9"
  ) {
    local = digits.slice(2);
  } else if (
    digits.length === 12 &&
    digits.startsWith("519") // already includes country without +
  ) {
    local = digits.slice(2);
  }

  if (!local || local.length !== 9 || !local.startsWith("9")) {
    return {
      ok: false,
      message:
        "Usa un celular peruano: 9 dígitos que empiecen en 9 (ej. 987654321).",
    };
  }

  return { ok: true, e164: `+51${local}` };
}
