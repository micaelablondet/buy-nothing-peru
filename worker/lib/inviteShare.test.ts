import { describe, expect, it } from "vitest";
import {
  inviteShareLink,
  inviteShareMessage,
  inviteShareWhatsAppUrl,
  shouldShowInviteShare,
} from "./inviteShare";

describe("inviteShare (AUTH-05)", () => {
  const base = "https://barrio.example";

  it("builds entrar?codigo link when a code is present", () => {
    expect(inviteShareLink(base, "BARRIO-PILOTO")).toBe(
      "https://barrio.example/entrar?codigo=BARRIO-PILOTO",
    );
    expect(inviteShareMessage(base, "BARRIO-PILOTO")).toContain(
      "entrar?codigo=BARRIO-PILOTO",
    );
    expect(inviteShareWhatsAppUrl(base, "BARRIO-PILOTO")).toMatch(
      /^https:\/\/wa\.me\/\?text=/,
    );
    expect(
      decodeURIComponent(inviteShareWhatsAppUrl(base, "BARRIO-PILOTO")),
    ).toContain("BARRIO-PILOTO");
  });

  it("omits codigo when invite is off / no code", () => {
    expect(inviteShareLink(base, null)).toBe("https://barrio.example/entrar");
    expect(inviteShareMessage(base, null)).not.toContain("codigo=");
  });

  it("hides the menu item only when invites are required and there is no code", () => {
    expect(shouldShowInviteShare(true, "BARRIO-PILOTO")).toBe(true);
    expect(shouldShowInviteShare(true, null)).toBe(false);
    expect(shouldShowInviteShare(false, null)).toBe(true);
  });
});
