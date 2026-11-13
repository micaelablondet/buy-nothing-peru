/**
 * SPEC §12.3 authorization contracts — pure rules that gate private data.
 * Route handlers must call these; UI hiding is not enough (AGENTS.md §3).
 */
import { describe, expect, it } from "vitest";
import { applyPostTransition } from "./domain/postStateMachine";
import { applyResponseTransition } from "./domain/responseStateMachine";
import { isAdminEmail } from "./lib/admin";
import { canRevealWhatsApp } from "./lib/handoff";
import { renderPublicPostHtml } from "./lib/publicPage";
import type { PostRow } from "./db/posts";

function samplePost(overrides: Partial<PostRow> = {}): PostRow {
  return {
    id: "post-1",
    author_id: "user-a",
    type: "regalo",
    status: "open",
    title: "Silla",
    description: "Buena",
    category: "Muebles",
    district_id: "dist-barranco",
    created_at: "2026-01-01T00:00:00.000Z",
    expires_at: null,
    chosen_response_id: null,
    chosen_at: null,
    delivered_at: null,
    withdrawn_at: null,
    received_confirmed_at: null,
    disc_answer: null,
    author_display_name: "Ana Pérez",
    author_first_name: "Ana",
    district_name: "Barranco",
    ...overrides,
  };
}

describe("authorization contracts (SPEC §12.3)", () => {
  it("non-admins are rejected by allowlist (admin routes)", () => {
    expect(isAdminEmail("vecino@example.test", "mica@valere.io")).toBe(false);
    expect(isAdminEmail("mica@valere.io", "mica@valere.io")).toBe(true);
  });

  it("only the author may withdraw (owner check is required before transition)", () => {
    // Illegal for non-open after withdraw — transition itself is status-gated;
    // actor check lives in withdrawPost (author_id === actorId).
    expect(applyPostTransition("open", "withdraw").ok).toBe(true);
    expect(applyPostTransition("delivered", "withdraw").ok).toBe(false);
  });

  it("only active responses may withdraw; choose is owner-gated in chooseResponse", () => {
    expect(applyResponseTransition("active", "withdraw").ok).toBe(true);
    expect(applyResponseTransition("chosen", "withdraw").ok).toBe(false);
    expect(applyResponseTransition("active", "choose").ok).toBe(true);
  });

  it("strangers never get WhatsApp on open or chosen posts", () => {
    expect(
      canRevealWhatsApp({
        postStatus: "open",
        viewerId: "stranger",
        authorId: "user-a",
        chosenResponderId: null,
      }),
    ).toBe(false);
    expect(
      canRevealWhatsApp({
        postStatus: "chosen",
        viewerId: "stranger",
        authorId: "user-a",
        chosenResponderId: "user-b",
      }),
    ).toBe(false);
  });

  it("public HTML never includes email, phone, or full display name", () => {
    const html = renderPublicPostHtml({
      post: samplePost({
        author_display_name: "Ana Pérez",
        author_first_name: "Ana",
      }),
      photos: [],
      baseUrl: "https://barrio.example",
      signedIn: false,
    });
    expect(html).toContain("de Ana");
    expect(html).not.toContain("Ana Pérez");
    expect(html).not.toContain("@");
    expect(html).not.toContain("+51");
    expect(html).not.toContain("wa.me");
  });

  it("admin remove is a legal transition from open", () => {
    expect(applyPostTransition("open", "remove")).toMatchObject({
      ok: true,
      to: "removed",
    });
    expect(applyPostTransition("removed", "remove").ok).toBe(false);
  });
});
