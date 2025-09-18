// ./context/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState({ user: null, accessToken: null });
  const router = useRouter();

  // helper: save to localStorage
  const setAuth = (data) => {
    setAuthState(data);
    if (data?.accessToken) {
      localStorage.setItem("auth", JSON.stringify(data));
    } else {
      localStorage.removeItem("auth");
    }
  };

  // restore on first load
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) setAuthState(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500"}/auth/login`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    setAuth({ user: data.user, accessToken: data.accessToken });

    // 🔑 Redirect based on role
    if (data.user.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/student");
    }
  };

  const logout = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500"}/api/v1/auth/logout`,
      { method: "POST", credentials: "include" }
    );
    setAuth({ user: null, accessToken: null });
    router.push("/"); // redirect to home after logout
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
