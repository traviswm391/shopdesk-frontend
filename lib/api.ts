const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shopdesk-backend.up.railway.app";

async function apiFetch(path: string, options: RequestInit = {}, clerkToken?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (clerkToken) {
    headers["Authorization"] = "Bearer " + clerkToken;
    const payload = JSON.parse(atob(clerkToken.split(".")[1] || "e30="));
    if (payload.sub) headers["x-clerk-user-id"] = payload.sub;
    if (payload.email) headers["x-clerk-user-email"] = payload.email;
  }
  const res = await fetch(API_URL + path, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Request failed: " + res.status);
  }
  return res.json();
}

export const api = {
  // Shop owner endpoints
  getShop: (token: string) => apiFetch("/api/shops/me", {}, token),
  createShop: (token: string, data: object) =>
    apiFetch("/api/shops/", { method: "POST", body: JSON.stringify(data) }, token),
  updateShop: (token: string, data: object) =>
    apiFetch("/api/shops/me", { method: "PATCH", body: JSON.stringify(data) }, token),
  getCalls: (token: string, limit = 50) =>
    apiFetch("/api/calls/?limit=" + limit, {}, token),
  getCall: (token: string, id: string) => apiFetch("/api/calls/" + id, {}, token),
  getCallStats: (token: string) => apiFetch("/api/calls/stats/summary", {}, token),
  createCheckout: (token: string) =>
    apiFetch("/api/shops/billing/checkout", { method: "POST" }, token),
  getBillingPortal: (token: string) =>
    apiFetch("/api/shops/billing/portal", { method: "POST" }, token),

  // Admin endpoints — platform-wide
  adminStats: (token: string) => apiFetch("/api/admin/stats", {}, token),
  adminShops: (token: string) => apiFetch("/api/admin/shops", {}, token),
  adminCalls: (token: string) => apiFetch("/api/admin/calls", {}, token),

  // Admin endpoints — per-shop
  adminGetShop: (token: string, shopId: string) =>
    apiFetch(`/api/admin/shops/${shopId}`, {}, token),
  adminGetShopCalls: (token: string, shopId: string, limit = 100) =>
    apiFetch(`/api/admin/shops/${shopId}/calls?limit=${limit}`, {}, token),
  adminUpdateShop: (token: string, shopId: string, data: object) =>
    apiFetch(
      `/api/admin/shops/${shopId}`,
      { method: "PATCH", body: JSON.stringify(data) },
      token
    ),
};
