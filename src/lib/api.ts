export type MeResponse = {
  id: string;
  displayName: string;
  email: string | null;
  districtId: string | null;
  whatsapp: string | null;
  inviteAcceptedAt: string | null;
  isAdmin: boolean;
  profileComplete: boolean;
};

export type AuthConfig = {
  googleConfigured: boolean;
  inviteRequired: boolean;
  stubAuth: boolean;
};

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function fetchAuthConfig(): Promise<AuthConfig> {
  const res = await fetch("/api/auth/config", { credentials: "include" });
  if (!res.ok) {
    throw new Error("config_failed");
  }
  return parseJson(res);
}

export async function fetchMe(): Promise<MeResponse | null> {
  const res = await fetch("/api/me", { credentials: "include" });
  if (res.status === 401) {
    return null;
  }
  if (!res.ok) {
    throw new Error("me_failed");
  }
  return parseJson<MeResponse>(res);
}

export async function startStubSession(): Promise<{
  user: MeResponse;
  next: string;
}> {
  const res = await fetch("/api/dev/session", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("session_failed");
  }
  const data = await parseJson<{ user: MeResponse; next?: string }>(res);
  return { user: data.user, next: data.next || "/app" };
}

export async function setAuthReturnPath(next: string): Promise<void> {
  await fetch("/api/auth/return-path", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ next }),
  });
}

export async function submitInviteCode(
  code: string,
): Promise<{ user: MeResponse; next: string }> {
  const res = await fetch("/api/auth/invite", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await parseJson<{
    user?: MeResponse;
    next?: string;
    message?: string;
    error?: string;
  }>(res);
  if (!res.ok) {
    throw new Error(data.message || data.error || "invite_failed");
  }
  return { user: data.user!, next: data.next || "/app" };
}

export async function updateProfile(input: {
  displayName: string;
  whatsapp: string;
  districtId: string;
}): Promise<MeResponse & { next?: string }> {
  const res = await fetch("/api/me/profile", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<MeResponse & { message?: string; next?: string }>(
    res,
  );
  if (!res.ok) {
    throw new Error(data.message || "profile_failed");
  }
  return data;
}

export async function deleteAccount(): Promise<void> {
  const res = await fetch("/api/me", { method: "DELETE", credentials: "include" });
  if (!res.ok) {
    throw new Error("delete_failed");
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export async function fetchDistricts(): Promise<{ id: string; name: string }[]> {
  const res = await fetch("/api/districts", { credentials: "include" });
  if (!res.ok) {
    throw new Error("districts_failed");
  }
  const data = await parseJson<{ districts: { id: string; name: string }[] }>(res);
  return data.districts;
}

export async function fetchHealth(): Promise<{
  ok: boolean;
  slice: string;
  googleConfigured?: boolean;
}> {
  const res = await fetch("/api/health");
  if (!res.ok) {
    throw new Error("health_failed");
  }
  return parseJson(res);
}

export async function fetchSeedStats(): Promise<{
  seeded: boolean;
  counts: {
    districts: number;
    users: number;
    posts: number;
    responses: number;
  } | null;
}> {
  const res = await fetch("/api/seed-stats", { credentials: "include" });
  if (!res.ok) {
    throw new Error("seed_stats_failed");
  }
  return parseJson(res);
}

export function googleAuthHref(next?: string | null): string {
  if (!next) {
    return "/api/auth/google";
  }
  return `/api/auth/google?next=${encodeURIComponent(next)}`;
}

/** Prefer full document load so `/p/{id}` hits Worker SSR (PUB-02), not the SPA. */
export function goAfterAuth(next: string): void {
  window.location.assign(next);
}

export async function recordShareClick(
  postId: string,
): Promise<{ url: string }> {
  const res = await fetch(`/api/posts/${postId}/share`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "fetch",
    },
  });
  if (!res.ok) {
    throw new Error("share_failed");
  }
  return parseJson<{ url: string }>(res);
}

export type PostType = "regalo" | "pido";

export type PostSummary = {
  id: string;
  type: PostType;
  status: string;
  title: string;
  description: string;
  category: string | null;
  districtId: string;
  districtName: string;
  authorName: string;
  createdAt: string;
  expiresAt: string | null;
  isOwner: boolean;
  photos: { id: string; position: number; url: string }[];
  actions: {
    canWithdraw: boolean;
    showOwnerResponses: boolean;
    showRespond: boolean;
    alreadyResponded: boolean;
    myResponseId: string | null;
    capped: boolean;
    activeResponseCount: number;
    showHandoff: boolean;
    statusOnly: boolean;
  } | null;
};

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch("/api/categories", { credentials: "include" });
  if (!res.ok) {
    throw new Error("categories_failed");
  }
  const data = await parseJson<{ categories: string[] }>(res);
  return data.categories;
}

export async function fetchFeed(input: {
  type: PostType;
  districtId?: string | null;
  category?: string | null;
}): Promise<PostSummary[]> {
  const params = new URLSearchParams({ type: input.type });
  if (input.districtId) {
    params.set("districtId", input.districtId);
  }
  if (input.category) {
    params.set("category", input.category);
  }
  const res = await fetch(`/api/feed?${params}`, { credentials: "include" });
  if (!res.ok) {
    throw new Error("feed_failed");
  }
  const data = await parseJson<{ posts: PostSummary[] }>(res);
  return data.posts;
}

export async function fetchMyPosts(): Promise<PostSummary[]> {
  const res = await fetch("/api/me/posts", { credentials: "include" });
  if (!res.ok) {
    throw new Error("my_posts_failed");
  }
  const data = await parseJson<{ posts: PostSummary[] }>(res);
  return data.posts;
}

export async function fetchPost(id: string): Promise<PostSummary> {
  const res = await fetch(`/api/posts/${id}`, { credentials: "include" });
  if (res.status === 404) {
    throw new Error("not_found");
  }
  if (!res.ok) {
    throw new Error("post_failed");
  }
  return parseJson(res);
}

export async function recordPostFormOpened(input: {
  type: PostType;
  formSessionId: string;
}): Promise<void> {
  await fetch("/api/events/post-form-opened", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function createPost(input: {
  type: PostType;
  title: string;
  description: string;
  category: string;
  photos: File[];
  formSessionId?: string;
}): Promise<PostSummary> {
  const form = new FormData();
  form.set("type", input.type);
  form.set("title", input.title);
  form.set("description", input.description);
  form.set("category", input.category);
  if (input.formSessionId) {
    form.set("formSessionId", input.formSessionId);
  }
  for (const photo of input.photos) {
    form.append("photos", photo);
  }
  const res = await fetch("/api/posts", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const data = await parseJson<PostSummary & { message?: string }>(res);
  if (!res.ok) {
    throw new Error(data.message || "create_failed");
  }
  return data;
}

export async function withdrawPost(id: string): Promise<PostSummary> {
  const res = await fetch(`/api/posts/${id}/withdraw`, {
    method: "POST",
    credentials: "include",
  });
  const data = await parseJson<PostSummary & { message?: string }>(res);
  if (!res.ok) {
    throw new Error(data.message || "withdraw_failed");
  }
  return data;
}

export type ResponseItem = {
  id: string;
  note: string | null;
  createdAt: string;
  name: string;
  districtName: string | null;
  photoUrl: string | null;
};

export async function fetchPostResponses(postId: string): Promise<ResponseItem[]> {
  const res = await fetch(`/api/posts/${postId}/responses`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("responses_failed");
  }
  const data = await parseJson<{ responses: ResponseItem[] }>(res);
  return data.responses;
}

export async function createResponse(input: {
  postId: string;
  note: string;
  photo?: File | null;
}): Promise<void> {
  const form = new FormData();
  form.set("note", input.note);
  if (input.photo) {
    form.set("photo", input.photo);
  }
  const res = await fetch(`/api/posts/${input.postId}/responses`, {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const data = await parseJson<{ message?: string }>(res);
  if (!res.ok) {
    throw new Error(data.message || "response_failed");
  }
}

export async function withdrawMyResponse(responseId: string): Promise<void> {
  const res = await fetch(`/api/responses/${responseId}/withdraw`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("withdraw_response_failed");
  }
}

export async function chooseResponse(
  postId: string,
  responseId: string,
): Promise<void> {
  const res = await fetch(`/api/posts/${postId}/choose`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ responseId }),
  });
  if (!res.ok) {
    throw new Error("choose_failed");
  }
}

export type HandoffPayload = {
  postId: string;
  title: string;
  type: PostType;
  status: string;
  tip: string;
  otherParty: { name: string; whatsapp: string };
  waUrl: string;
  prefilledText: string;
  canMarkDelivered: boolean;
  canMarkReceived: boolean;
  receivedConfirmed: boolean;
  discAnswer: string | null;
  showDiscSurvey: boolean;
  coverUrl: string | null;
  authorName: string;
};

export async function fetchHandoff(postId: string): Promise<HandoffPayload> {
  const res = await fetch(`/api/posts/${postId}/handoff`, {
    credentials: "include",
  });
  if (res.status === 403) {
    throw new Error("forbidden");
  }
  if (!res.ok) {
    throw new Error("handoff_failed");
  }
  return parseJson(res);
}

export async function markDelivered(postId: string): Promise<void> {
  const res = await fetch(`/api/posts/${postId}/delivered`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("delivered_failed");
  }
}

export async function markReceived(postId: string): Promise<void> {
  const res = await fetch(`/api/posts/${postId}/received`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("received_failed");
  }
}

export type InboxItem = {
  id: string;
  type: string;
  title: string;
  postId: string | null;
  postTitle: string | null;
  readAt: string | null;
  createdAt: string;
  href: string;
};

export async function fetchNotifications(): Promise<{
  notifications: InboxItem[];
  unread: number;
}> {
  const res = await fetch("/api/notifications", { credentials: "include" });
  if (!res.ok) {
    throw new Error("notifications_failed");
  }
  return parseJson(res);
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await fetch("/api/notifications/unread-count", {
    credentials: "include",
  });
  if (!res.ok) {
    return 0;
  }
  const data = await parseJson<{ unread: number }>(res);
  return data.unread;
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`/api/notifications/${id}/read`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchPushConfig(): Promise<{
  vapidPublicKey: string | null;
  pushConfigured: boolean;
}> {
  const res = await fetch("/api/push/config", { credentials: "include" });
  if (!res.ok) {
    return { vapidPublicKey: null, pushConfigured: false };
  }
  return parseJson(res);
}

export async function savePushSubscription(input: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<void> {
  await fetch("/api/push/subscribe", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function fetchReportReasons(): Promise<string[]> {
  const res = await fetch("/api/report-reasons", { credentials: "include" });
  if (!res.ok) {
    throw new Error("report_reasons_failed");
  }
  const data = await parseJson<{ reasons: string[] }>(res);
  return data.reasons;
}

export async function submitReport(input: {
  postId: string;
  responseId?: string | null;
  reason: string;
  text?: string;
}): Promise<void> {
  const res = await fetch("/api/reports", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ message?: string }>(res);
  if (!res.ok) {
    throw new Error(data.message || "report_failed");
  }
}

export async function submitDiscAnswer(
  postId: string,
  answer: string,
): Promise<void> {
  const res = await fetch(`/api/posts/${postId}/disc`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
  if (!res.ok) {
    throw new Error("disc_failed");
  }
}

export async function fetchAdminReports(): Promise<
  {
    id: string;
    postId: string;
    postTitle: string;
    responseId: string | null;
    reason: string;
    text: string | null;
    reporterName: string;
    createdAt: string;
  }[]
> {
  const res = await fetch("/api/admin/reports", { credentials: "include" });
  if (res.status === 403) {
    throw new Error("forbidden");
  }
  if (!res.ok) {
    throw new Error("admin_reports_failed");
  }
  const data = await parseJson<{
    reports: {
      id: string;
      postId: string;
      postTitle: string;
      responseId: string | null;
      reason: string;
      text: string | null;
      reporterName: string;
      createdAt: string;
    }[];
  }>(res);
  return data.reports;
}

export async function fetchAdminPosts(): Promise<
  {
    id: string;
    type: string;
    status: string;
    title: string;
    createdAt: string;
    districtName: string;
    authorName: string;
  }[]
> {
  const res = await fetch("/api/admin/posts", { credentials: "include" });
  if (!res.ok) {
    throw new Error("admin_posts_failed");
  }
  const data = await parseJson<{
    posts: {
      id: string;
      type: string;
      status: string;
      title: string;
      createdAt: string;
      districtName: string;
      authorName: string;
    }[];
  }>(res);
  return data.posts;
}

export async function adminRemovePost(id: string): Promise<void> {
  const res = await fetch(`/api/admin/posts/${id}/remove`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("remove_failed");
  }
}

export async function fetchAdminInvites(): Promise<
  {
    id: string;
    code: string;
    active: boolean;
    createdAt: string;
    deactivatedAt: string | null;
  }[]
> {
  const res = await fetch("/api/admin/invites", { credentials: "include" });
  if (!res.ok) {
    throw new Error("admin_invites_failed");
  }
  const data = await parseJson<{
    invites: {
      id: string;
      code: string;
      active: boolean;
      createdAt: string;
      deactivatedAt: string | null;
    }[];
  }>(res);
  return data.invites;
}

export async function createAdminInvite(code: string): Promise<void> {
  const res = await fetch("/api/admin/invites", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await parseJson<{ message?: string }>(res);
  if (!res.ok) {
    throw new Error(data.message || "invite_create_failed");
  }
}

export async function setAdminInviteActive(
  id: string,
  active: boolean,
): Promise<void> {
  const res = await fetch(`/api/admin/invites/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active }),
  });
  if (!res.ok) {
    throw new Error("invite_update_failed");
  }
}

export type AdminMetrics = {
  accounts: number;
  completedHandoffsThisWeek: number;
  responseRate48h: number | null;
  medianPostFormMs: number | null;
  discAnswers: Record<string, number>;
  inflationCheck: number | null;
  weekStart: string;
  weekEnd: string;
};

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const res = await fetch("/api/admin/metrics", { credentials: "include" });
  if (!res.ok) {
    throw new Error("admin_metrics_failed");
  }
  return parseJson(res);
}
