import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import type { ReactNode } from "react";

/** Read Django's default CSRF cookie (requires CSRF_COOKIE_HTTPONLY = False for JS access). */
export function getCsrfTokenFromCookies(): string | null {
  const prefix = "csrftoken=";
  const row = document.cookie.split("; ").find((p) => p.startsWith(prefix));
  if (!row) return null;
  return decodeURIComponent(row.slice(prefix.length));
}

type AuthContextValue = {
  user: string | null;
  csrfToken: string | null;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => Promise<void>;
  /** GET /api/get-csrf/ to set csrftoken cookie, then sync React state. Returns token or null. */
  getCSRF: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
  const isLoggedIn = Boolean(user && user !== "null");
  const sessionLength = 1800; // session lifespan in seconds
  const [csrfToken, setCsrfToken] = useState<string | null>(() =>
    getCsrfTokenFromCookies() ?? localStorage.getItem("csrfToken"),
  );
  const hasShownSessionExpiredAlert = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) {
      hasShownSessionExpiredAlert.current = false;
      return;
    }

    const status = () => {
      const sessionExpiry = Number(localStorage.getItem("sessionExpiry") || 0); 
      console.log(sessionExpiry);
      console.log((sessionExpiry - Date.now()) / 1000);
      if (sessionExpiry < Date.now()) {
        localStorage.removeItem("user");
        setUser(null);
        if (!hasShownSessionExpiredAlert.current) {
          hasShownSessionExpiredAlert.current = true;
          alert("Your session has expired.");
        }
      }
    };

    status();
    const intervalId = setInterval(status, 15000);
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  const getCSRF = useCallback(async (): Promise<string | null> => {
    const apiURL = localStorage.getItem("apiURL");
    if (!apiURL) return null;
    await axios.get(`${apiURL}get-csrf/`, { withCredentials: true });
    const token = getCsrfTokenFromCookies();
    console.log("Got Token: ", token);
    setCsrfToken(token);
    if (token) {
      localStorage.setItem("csrfToken", token);
    }
    return token;
  }, []);

  const login = useCallback((username: string) => {
    localStorage.setItem("user", username);
    const sessionExpiry = Date.now() + (1000 * sessionLength);
    localStorage.setItem("sessionExpiry", String(sessionExpiry));
    setUser(username);
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log("Token: ", csrfToken);
      await axios.post(localStorage.getItem("apiURL") + "logout/", {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFtoken": csrfToken,
          },
        });
    } catch (e: any) {
      console.log(e.response);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("csrfToken");
      setUser(null);
      setCsrfToken(null);
    }
  }, [csrfToken]);

  const value = useMemo(
    () => ({
      user,
      csrfToken,
      isLoggedIn,
      login,
      logout,
      getCSRF,
    }),
    [user, csrfToken, isLoggedIn, login, logout, getCSRF],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
