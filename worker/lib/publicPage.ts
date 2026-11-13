import type { PostRow } from "../db/posts";
import { escapeHtml, truncate } from "./html";

const STATUS_LABEL: Record<string, string> = {
  open: "Abierto",
  chosen: "Elegido",
  delivered: "Entregado",
  withdrawn: "Retirado",
  expired: "Venció",
  removed: "Removido",
  closed: "Cerrado",
};

export type PublicPageInput = {
  post: PostRow;
  photos: { id: string; r2_key: string; position: number }[];
  baseUrl: string;
  signedIn: boolean;
};

export function publicFirstName(post: PostRow): string {
  return post.author_first_name.trim() || "Vecino";
}

export function buildWhatsAppShareUrl(title: string, pageUrl: string): string {
  const text = `${title} ${pageUrl}`.trim();
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** PUB-01 / PUB-02: SSR HTML with Open Graph tags; no WhatsApp, email, or responders. */
export function renderPublicPostHtml(input: PublicPageInput): string {
  const { post, photos, baseUrl, signedIn } = input;
  const pageUrl = `${baseUrl.replace(/\/$/, "")}/p/${post.id}`;
  const firstName = publicFirstName(post);
  const statusLabel = STATUS_LABEL[post.status] ?? post.status;
  const typeLabel = post.type === "regalo" ? "Regalo" : "Pido";
  const ogDescription = truncate(post.description, 160);
  const firstPhoto = photos[0];
  const ogImage = firstPhoto
    ? `${baseUrl.replace(/\/$/, "")}/api/photos/${firstPhoto.r2_key}`
    : "";

  if (post.status === "removed") {
    return documentShell({
      title: "Publicación no disponible · Barrio",
      ogTitle: "Barrio",
      ogDescription: "Esta publicación ya no está disponible",
      ogImage: "",
      pageUrl,
      body: `
        <main class="public">
          <p class="public__brand">Barrio</p>
          <h1 class="public__title">Esta publicación ya no está disponible</h1>
          <p class="public__meta">Puede haber sido retirada por la persona que la publicó o por moderación.</p>
          <a class="btn-primary" href="/entrar">Entrar a Barrio</a>
        </main>`,
    });
  }

  const photoHtml =
    photos.length > 0
      ? `<div class="public__photos">${photos
          .map(
            (p) =>
              `<img src="${escapeHtml(`${baseUrl.replace(/\/$/, "")}/api/photos/${p.r2_key}`)}" alt="" />`,
          )
          .join("")}</div>`
      : "";

  const respondHref = signedIn
    ? `/app/p/${escapeHtml(post.id)}?responder=1`
    : `/entrar?next=${encodeURIComponent(`/p/${post.id}`)}`;
  const respondLabel =
    post.type === "regalo" ? "Me interesa" : "Yo tengo";
  const showRespond = post.status === "open";

  const actions = `
    <form method="POST" action="/api/posts/${escapeHtml(post.id)}/share">
      <button type="submit" class="btn-primary">Compartir en WhatsApp</button>
    </form>
    ${
      showRespond
        ? `<a class="btn-secondary" href="${respondHref}">${respondLabel}</a>`
        : `<p class="public__status">${escapeHtml(statusLabel)}</p>`
    }
    <a class="public__home" href="${signedIn ? "/app" : "/entrar"}">Ir a Barrio</a>
  `;

  return documentShell({
    title: `${post.title} · Barrio`,
    ogTitle: post.title,
    ogDescription,
    ogImage,
    pageUrl,
    body: `
      <main class="public">
        <p class="public__brand">Barrio</p>
        ${photoHtml}
        <p class="public__eyebrow">${escapeHtml(typeLabel)} · ${escapeHtml(statusLabel)}</p>
        <h1 class="public__title">${escapeHtml(post.title)}</h1>
        <p class="public__meta">
          ${escapeHtml(post.category ?? "")} · ${escapeHtml(post.district_name)}
          <br />de ${escapeHtml(firstName)}
        </p>
        <p class="public__body">${escapeHtml(post.description)}</p>
        <div class="public__actions">${actions}</div>
      </main>`,
  });
}

export function renderPublicNotFoundHtml(baseUrl: string): string {
  const pageUrl = `${baseUrl.replace(/\/$/, "")}/`;
  return documentShell({
    title: "No encontrada · Barrio",
    ogTitle: "Barrio",
    ogDescription: "No encontramos esa publicación.",
    ogImage: "",
    pageUrl,
    body: `
      <main class="public">
        <p class="public__brand">Barrio</p>
        <h1 class="public__title">No encontramos esa publicación</h1>
        <a class="btn-primary" href="/entrar">Entrar a Barrio</a>
      </main>`,
  });
}

function documentShell(input: {
  title: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  pageUrl: string;
  body: string;
}): string {
  const ogImageTag = input.ogImage
    ? `<meta property="og:image" content="${escapeHtml(input.ogImage)}" />`
    : "";
  return `<!DOCTYPE html>
<html lang="es-PE">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.title)}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(input.ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(input.ogDescription)}" />
  <meta property="og:url" content="${escapeHtml(input.pageUrl)}" />
  ${ogImageTag}
  <meta name="twitter:card" content="summary_large_image" />
  <style>
    :root {
      --color-surface: #f7f6f2;
      --color-ink: #1b4332;
      --color-ink-muted: #52796f;
      --color-brand: #2d6a4f;
      --color-border: #e4e6e3;
      --color-on-brand: #ffffff;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --font-sans: "Segoe UI", system-ui, -apple-system, sans-serif;
      --text-md: 1rem;
      --text-sm: 0.875rem;
      --text-xl: 1.25rem;
      --text-2xl: 1.5rem;
      --radius-md: 0.75rem;
      --touch-min: 2.75rem;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: var(--font-sans);
      background: var(--color-surface);
      color: var(--color-ink);
      font-size: var(--text-md);
      line-height: 1.5;
    }
    .public {
      max-width: 28rem;
      margin: 0 auto;
      padding: var(--space-6) var(--space-4) var(--space-8);
    }
    .public__brand {
      font-weight: 700;
      color: var(--color-brand);
      margin: 0 0 var(--space-4);
    }
    .public__photos img {
      width: 100%;
      border-radius: var(--radius-md);
      margin-bottom: var(--space-3);
      display: block;
    }
    .public__eyebrow, .public__meta, .public__status {
      color: var(--color-ink-muted);
      font-size: var(--text-sm);
      margin: 0 0 var(--space-2);
    }
    .public__title {
      font-size: var(--text-2xl);
      line-height: 1.25;
      margin: 0 0 var(--space-3);
    }
    .public__body { margin: 0 0 var(--space-6); white-space: pre-wrap; }
    .public__actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: var(--touch-min);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--text-md);
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
      width: 100%;
    }
    .btn-primary {
      background: var(--color-brand);
      color: var(--color-on-brand);
    }
    .btn-secondary {
      background: transparent;
      color: var(--color-brand);
      border: 1px solid var(--color-border);
    }
    .public__home {
      text-align: center;
      color: var(--color-ink-muted);
      font-size: var(--text-sm);
    }
  </style>
</head>
<body>
${input.body}
</body>
</html>`;
}
