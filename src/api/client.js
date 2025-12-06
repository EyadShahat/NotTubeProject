const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

let authToken = "";

export function setAuthToken(token) {
  authToken = token || "";
  if (authToken) {
    try { localStorage.setItem("nt_token", authToken); } catch {}
  } else {
    try { localStorage.removeItem("nt_token"); } catch {}
  }
}

export function clearAuthToken() {
  authToken = "";
  try { localStorage.removeItem("nt_token"); } catch {}
}

export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  const isForm = body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || data.message || res.statusText;
    throw new Error(message);
  }
  return data;
}

export function getApiBase() {
  return API_URL;
}
