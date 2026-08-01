// Thin API client for the local REST server (default http://localhost:3000/).
// Endpoints are the customer-facing ones from the Postman collection —
// intentionally NO tenant/admin/superadmin routes.

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";
export const API_BASE = RAW_BASE.endsWith("/") ? RAW_BASE : RAW_BASE + "/";
export const TENANT_ID = import.meta.env.VITE_TENANT_ID || "skbags-001";

const TOKEN_KEY = "lb_token";
const USER_KEY = "lb_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getStoredUser<T = any>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
export function setStoredUser(u: unknown | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
}

type RequestOpts = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
};

export async function apiRequest<T = any>(path: string, opts: RequestOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  if (opts.auth) {
    const token = getToken();
    if (token) {
      // Server expects a `token` header (per Postman); also send Authorization for safety.
      headers["token"] = token;
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  const res = await fetch(API_BASE + path.replace(/^\//, ""), {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      (typeof data === "string" ? data : `Request failed (${res.status})`);
    throw new Error(message);
  }
  return data as T;
}

// ---- Types (best-effort; server responses may vary) ----
export type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string | string[];
  description?: string;
  isFeatured?: boolean;
  featured?: boolean;
  stock?: number;
  category?: string;
};

export type Banner = {
  _id: string;
  title?: string;
  link?: string;
  image?: string;
  isActive?: boolean;
  displayOrder?: number;
};

export type OrderItem = { product: string; quantity: number };
export type Order = {
  _id: string;
  items: Array<{
    product: string | Product;
    quantity: number;
    price?: number;
  }>;
  status?: string;
  total?: number;
  notes?: string;
  createdAt?: string;
};

// unwrap common shapes: {data: X}, {products: X}, {result: X}, or X directly
function pick<T = any>(res: any, keys: string[]): T {
  if (Array.isArray(res)) return res as T;
  if (res && typeof res === "object") {
    for (const k of keys) if (res[k] !== undefined) return res[k] as T;
    if (res.data) {
      const d = res.data;
      if (Array.isArray(d)) return d as T;
      for (const k of keys) if (d[k] !== undefined) return d[k] as T;
      return d as T;
    }
  }
  return res as T;
}

// ---- Banners ----
export async function fetchActiveBanners(): Promise<Banner[]> {
  const res = await apiRequest(`banner/active/${TENANT_ID}`);
  const list = pick<Banner[]>(res, ["banners", "items"]);
  return Array.isArray(list) ? list : [];
}

// ---- Products ----
export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const q = qs.toString();
  const res = await apiRequest(`product/get/${TENANT_ID}${q ? `?${q}` : ""}`);
  const list = pick<Product[]>(res, ["products", "items"]);
  return Array.isArray(list) ? list : [];
}
export async function fetchFeatureProducts(params?: {
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const q = qs.toString();
  const res = await apiRequest(`section/get/${TENANT_ID}/${q ? `?${q}` : ""}`, { auth: true });
  const list = pick<Product[]>(res, ["products", "items"]);
  return Array.isArray(list) ? list : [];
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  // No dedicated endpoint; derive from the product list.
  const all = await fetchFeatureProducts({ page: 1, limit: 20 });
  const featured = all.filter((p) => p.isFeatured || p.featured);
  return featured.length ? featured : all.slice(0, 4);
}

export async function fetchProduct(id: string): Promise<Product | null> {
  // Try list first (cheap fallback), since single-product endpoint isn't customer-facing.
  const all = await fetchProducts({ page: 1, limit: 100 });
  return all.find((p) => p._id === id) || null;
}

// ---- Auth ----
export type AuthResponse = {
  token?: string;
  user?: any;
  data?: { token?: string; user?: any };
};

export async function registerCustomer(input: { name: string; email: string; password: string }) {
  return apiRequest<AuthResponse>("auth/register/customer", {
    method: "POST",
    body: { ...input, tenantId: TENANT_ID },
  });
}

export async function login(input: { email: string; password: string }) {
  return apiRequest<AuthResponse>("auth/login", {
    method: "POST",
    body: { ...input, tenantId: TENANT_ID },
  });
}

// ---- Orders ----
export async function bookOrder(input: { customer: string; items: OrderItem[]; notes?: string }) {
  return apiRequest("order/book", {
    method: "POST",
    body: input,
    auth: true,
  });
}

export async function fetchMyOrders(): Promise<Order[]> {
  const res = await apiRequest("order/get/", { auth: true });
  const list = pick<Order[]>(res, ["orders", "items"]);
  return Array.isArray(list) ? list : [];
}

// ---- Helpers ----
export function primaryImage(p: Product): string {
  if (!p.images) return "";
  if (Array.isArray(p.images)) return p.images[0] || "";
  return p.images;
}
// export function formatPrice(n: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(n || 0);
// }

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}