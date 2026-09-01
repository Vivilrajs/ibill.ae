import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "./api";
import { getToken, setToken, clearToken } from "./auth-store";

export function useAuth() {
  const [authed, setAuthed] = useState<boolean>(() => !!getToken());

  useEffect(() => {
    const sync = () => setAuthed(!!getToken());
    window.addEventListener("ibill-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ibill-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    authed,
    async login(email: string, password: string) {
      const { token } = await api<{ token: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(token);
    },
    logout() {
      clearToken();
    },
  };
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { authed } = useAuth();
  const location = useLocation();
  if (!authed) {
    return (
      <Navigate
        to={`/admin/login?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }
  return <>{children}</>;
}
