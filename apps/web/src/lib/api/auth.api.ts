import { API_URL } from "./config";
import { fetchWithAuth, parseJson } from "./http";

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: string;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export async function register(input: RegisterInput) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  return parseJson<{ accessToken: string }>(res);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  return parseJson<{ accessToken: string }>(res);
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function refresh() {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  return parseJson<{ accessToken: string }>(res);
}

export async function getCurrentUser(accessToken: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  return parseJson<AuthUser>(res);
}

export async function updateCurrentUser(input: {
  firstName: string;
  lastName: string;
}) {
  const res = await fetchWithAuth(`${API_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJson<AuthUser>(res);
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await fetchWithAuth(`${API_URL}/auth/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJson<{ success: boolean }>(res);
}
