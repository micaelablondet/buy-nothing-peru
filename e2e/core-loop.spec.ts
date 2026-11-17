import { expect, test } from "@playwright/test";
import {
  createPido,
  createRegalo,
  respondToPost,
  stubSession,
} from "./helpers";

const BASE = "http://127.0.0.1:8787";

/** SPEC §12.2 — core loop Regalo and Pido (API e2e with stub auth). */
test.describe("core loop", () => {
  test("Regalo: post → respond → choose → WhatsApp both parties → Entregado", async ({
    playwright,
  }) => {
    const owner = await playwright.request.newContext({ baseURL: BASE });
    const responder = await playwright.request.newContext({ baseURL: BASE });

    await stubSession(owner, "user-mica");
    const postId = await createRegalo(owner, `E2E Regalo ${Date.now()}`);

    await stubSession(responder, "user-lucia");
    const responseId = await respondToPost(
      responder,
      postId,
      "Me interesa el e2e regalo",
    );

    await stubSession(owner, "user-mica");
    const choose = await owner.post(`/api/posts/${postId}/choose`, {
      data: { responseId },
    });
    expect(choose.ok()).toBeTruthy();
    expect((await choose.json()).status).toBe("chosen");

    const ownerHandoff = await owner.get(`/api/posts/${postId}/handoff`);
    expect(ownerHandoff.ok()).toBeTruthy();
    const ownerBody = await ownerHandoff.json();
    expect(ownerBody.waUrl).toMatch(/^https:\/\/wa\.me\//);
    expect(ownerBody.otherParty.whatsapp).toMatch(/^\+51/);

    await stubSession(responder, "user-lucia");
    const respHandoff = await responder.get(`/api/posts/${postId}/handoff`);
    expect(respHandoff.ok()).toBeTruthy();
    const respBody = await respHandoff.json();
    expect(respBody.waUrl).toMatch(/^https:\/\/wa\.me\//);
    expect(respBody.otherParty.whatsapp).toMatch(/^\+51/);

    await stubSession(owner, "user-mica");
    const delivered = await owner.post(`/api/posts/${postId}/delivered`);
    expect(delivered.ok()).toBeTruthy();
    expect((await delivered.json()).status).toBe("delivered");

    await owner.dispose();
    await responder.dispose();
  });

  test("Pido: post → respond → choose → WhatsApp both parties → Entregado", async ({
    playwright,
  }) => {
    const asker = await playwright.request.newContext({ baseURL: BASE });
    const giver = await playwright.request.newContext({ baseURL: BASE });

    await stubSession(asker, "user-lucia");
    const postId = await createPido(asker, `E2E Pido ${Date.now()}`);

    await stubSession(giver, "user-carlos");
    const responseId = await respondToPost(
      giver,
      postId,
      "Hola, yo tengo esto y te lo regalo.",
    );

    await stubSession(asker, "user-lucia");
    const choose = await asker.post(`/api/posts/${postId}/choose`, {
      data: { responseId },
    });
    expect(choose.ok()).toBeTruthy();
    expect((await choose.json()).status).toBe("chosen");

    const askerHandoff = await asker.get(`/api/posts/${postId}/handoff`);
    expect(askerHandoff.ok()).toBeTruthy();
    expect((await askerHandoff.json()).waUrl).toMatch(/^https:\/\/wa\.me\//);

    await stubSession(giver, "user-carlos");
    const giverHandoff = await giver.get(`/api/posts/${postId}/handoff`);
    expect(giverHandoff.ok()).toBeTruthy();
    expect((await giverHandoff.json()).waUrl).toMatch(/^https:\/\/wa\.me\//);

    // On a Pido, the chosen responder is the giver who marks Entregado.
    const delivered = await giver.post(`/api/posts/${postId}/delivered`);
    expect(delivered.ok()).toBeTruthy();
    expect((await delivered.json()).status).toBe("delivered");

    await asker.dispose();
    await giver.dispose();
  });
});
