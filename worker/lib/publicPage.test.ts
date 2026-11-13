import { describe, expect, it } from "vitest";
import type { PostRow } from "../db/posts";
import {
  buildWhatsAppShareUrl,
  renderPublicPostHtml,
} from "./publicPage";

function samplePost(overrides: Partial<PostRow> = {}): PostRow {
  return {
    id: "post-1",
    author_id: "user-1",
    type: "regalo",
    status: "open",
    title: "Silla de madera",
    description: "Buena para el balcón. Sin manchas.",
    category: "Muebles",
    district_id: "dist-barranco",
    created_at: "2026-01-01T00:00:00.000Z",
    expires_at: null,
    chosen_response_id: null,
    chosen_at: null,
    delivered_at: null,
    withdrawn_at: null,
    received_confirmed_at: null,
    author_display_name: "Micaela Blondet",
    author_first_name: "Micaela",
    district_name: "Barranco",
    ...overrides,
  };
}

describe("renderPublicPostHtml (PUB-01/02)", () => {
  it("includes OG tags and first name, never WhatsApp or email", () => {
    const html = renderPublicPostHtml({
      post: samplePost(),
      photos: [{ id: "ph1", r2_key: "photos/a.jpg", position: 1 }],
      baseUrl: "https://barrio.example",
      signedIn: false,
    });

    expect(html).toContain('property="og:title" content="Silla de madera"');
    expect(html).toContain(
      'property="og:image" content="https://barrio.example/api/photos/photos/a.jpg"',
    );
    expect(html).toContain('property="og:description"');
    expect(html).toContain("de Micaela");
    expect(html).toContain("Compartir en WhatsApp");
    expect(html).toContain("/entrar?next=");
    expect(html).not.toContain("@");
    expect(html).not.toContain("+51");
    expect(html).not.toContain("wa.me");
    expect(html).not.toContain("Micaela Blondet");
  });

  it("links signed-in users into the app to respond", () => {
    const html = renderPublicPostHtml({
      post: samplePost(),
      photos: [],
      baseUrl: "https://barrio.example",
      signedIn: true,
    });
    expect(html).toContain("/app/p/post-1?responder=1");
    expect(html).toContain("Me interesa");
  });

  it("shows unavailable copy for removed posts", () => {
    const html = renderPublicPostHtml({
      post: samplePost({ status: "removed" }),
      photos: [],
      baseUrl: "https://barrio.example",
      signedIn: false,
    });
    expect(html).toContain("Esta publicación ya no está disponible");
    expect(html).not.toContain("Silla de madera");
  });
});

describe("buildWhatsAppShareUrl (PUB-03)", () => {
  it("encodes title and public link", () => {
    const url = buildWhatsAppShareUrl(
      "Silla",
      "https://barrio.example/p/post-1",
    );
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1]!)).toBe(
      "Silla https://barrio.example/p/post-1",
    );
  });
});
