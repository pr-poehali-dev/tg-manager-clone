const AUTH_URL = "https://functions.poehali.dev/f2d5d6ed-289f-4c8f-bcd9-25a7f76a41b3";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  status: string;
}

async function call(body: object): Promise<{ data?: unknown; error?: string; status: number }> {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { data, error: data.error, status: res.status };
}

export async function register(name: string, username: string, email: string, password: string) {
  return call({ action: "register", name, username, email, password });
}

export async function login(loginVal: string, password: string) {
  return call({ action: "login", login: loginVal, password });
}

export function getSession(): { token: string; user: User } | null {
  try {
    const raw = localStorage.getItem("pulse_session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: User) {
  localStorage.setItem("pulse_session", JSON.stringify({ token, user }));
}

export function clearSession() {
  localStorage.removeItem("pulse_session");
}
