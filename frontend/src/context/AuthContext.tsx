import { createContext, useContext, useState, type ReactNode } from "react";
import { login as loginApi } from "../api/portfolioApi"
import { type LoginRequest } from "../api/requestTypes";

const TOKEN_STORAGE_KEY = "portfolio_admin_token";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );

  async function login(credentials: LoginRequest) {
    const response = await loginApi(credentials);
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setToken(response.token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: token !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}