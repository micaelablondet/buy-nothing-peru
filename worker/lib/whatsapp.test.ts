import { describe, expect, it } from "vitest";
import { normalizePeruWhatsApp } from "./whatsapp";

describe("normalizePeruWhatsApp (PROF-02)", () => {
  it("accepts 9-digit local and +51 forms", () => {
    expect(normalizePeruWhatsApp("987654321")).toEqual({
      ok: true,
      e164: "+51987654321",
    });
    expect(normalizePeruWhatsApp("+51987654321")).toEqual({
      ok: true,
      e164: "+51987654321",
    });
    expect(normalizePeruWhatsApp("51 987 654 321")).toEqual({
      ok: true,
      e164: "+51987654321",
    });
  });

  it("rejects short or invalid numbers", () => {
    expect(normalizePeruWhatsApp("12345").ok).toBe(false);
    expect(normalizePeruWhatsApp("812345678").ok).toBe(false);
  });
});
