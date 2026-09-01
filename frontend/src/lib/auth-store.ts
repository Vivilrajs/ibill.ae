const KEY = "ibill_admin_token";
let mem: string | null = null;

export function getToken(): string | null {
  if (mem) return mem;
  try {
    mem = localStorage.getItem(KEY);
  } catch {
    /* SSR / blocked storage */
  }
  return mem;
}

export function setToken(token: string) {
  mem = token;
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("ibill-auth"));
}

export function clearToken() {
  mem = null;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("ibill-auth"));
}
