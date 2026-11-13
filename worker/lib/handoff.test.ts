import { describe, expect, it } from "vitest";
import {
  buildWhatsAppUrl,
  canRevealWhatsApp,
  handoffPrefill,
  isGiver,
  isReceiver,
} from "./handoff";

describe("handoff reveal (HAND-02)", () => {
  it("reveals only to poster and chosen responder on chosen/delivered", () => {
    expect(
      canRevealWhatsApp({
        postStatus: "open",
        viewerId: "a",
        authorId: "a",
        chosenResponderId: "b",
      }),
    ).toBe(false);
    expect(
      canRevealWhatsApp({
        postStatus: "chosen",
        viewerId: "a",
        authorId: "a",
        chosenResponderId: "b",
      }),
    ).toBe(true);
    expect(
      canRevealWhatsApp({
        postStatus: "chosen",
        viewerId: "b",
        authorId: "a",
        chosenResponderId: "b",
      }),
    ).toBe(true);
    expect(
      canRevealWhatsApp({
        postStatus: "chosen",
        viewerId: "c",
        authorId: "a",
        chosenResponderId: "b",
      }),
    ).toBe(false);
  });

  it("assigns giver/receiver by post type (HAND-03)", () => {
    expect(
      isGiver({
        postType: "regalo",
        viewerId: "poster",
        authorId: "poster",
        chosenResponderId: "resp",
      }),
    ).toBe(true);
    expect(
      isGiver({
        postType: "pido",
        viewerId: "resp",
        authorId: "poster",
        chosenResponderId: "resp",
      }),
    ).toBe(true);
    expect(
      isReceiver({
        postType: "regalo",
        viewerId: "resp",
        authorId: "poster",
        chosenResponderId: "resp",
      }),
    ).toBe(true);
  });

  it("builds wa.me link with prefilled text (HAND-01)", () => {
    const text = handoffPrefill("Lucía", "Microondas");
    expect(text).toContain("Lucía");
    expect(text).toContain("«Microondas»");
    expect(buildWhatsAppUrl("+51987654321", text)).toBe(
      `https://wa.me/51987654321?text=${encodeURIComponent(text)}`,
    );
  });
});
