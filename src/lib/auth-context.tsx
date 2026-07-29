import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getStoredUser,
  getToken,
  login as apiLogin,
  registerCustomer as apiRegister,
  setStoredUser,
  setToken,
} from "./api";

type User = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  [k: string]: any;
};

type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

function extract(res: any): { token?: string; user?: User } {
  const token =
    res?.token ??
    res?.accessToken ??
    res?.data?.token ??
    res?.data?.accessToken;
  const user =
    res?.user ?? res?.data?.user ?? res?.data ?? res?.customer ?? null;
  return { token, user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTok] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTok(getToken());
    setUser(getStoredUser<User>());
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    const { token: t, user: u } = extract(res);
    if (!t) throw new Error("No token returned from server");
    setToken(t);
    setStoredUser(u ?? { email });
    setTok(t);
    setUser(u ?? { email });
  };

  const signUp = async (name: string, email: string, password: string) => {
    await apiRegister({ name, email, password });
    await signIn(email, password);
  };

  const signOut = () => {
    setToken(null);
    setStoredUser(null);
    setTok(null);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
