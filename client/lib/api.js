const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || "API request failed");
  }
  return payload.data;
}
