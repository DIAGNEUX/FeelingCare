import { API_URL } from "./config";

let refreshPromise: Promise<string> | null = null;

export function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("accessToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (refreshRes) => {
        if (!refreshRes.ok) {
          const details = await refreshRes.text();

          console.error("[auth] Refresh failed", {
            status: refreshRes.status,
            details,
          });

          throw new Error(
            `Session expired: refresh failed (${refreshRes.status}) ${details}`
          );
        }

        const data = (await refreshRes.json()) as { accessToken: string };
        localStorage.setItem("accessToken", data.accessToken);

        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    ...(init.headers || {}),
    ...getAuthHeaders(),
  };

  let res = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      console.warn("[auth] Access token rejected, trying refresh", {
        request: String(input),
      });

      const accessToken = await refreshAccessToken();

      res = await fetch(input, {
        ...init,
        headers: {
          ...(init.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("[auth] Unable to refresh session", error);
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  return res;
}

export async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}
