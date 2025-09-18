// ./components/AuthForm.jsx
"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import {axiosBaseURL} from "../../axios/axios.js";
export default function AuthForm() {
  const { login, setAuth } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);

  try {
    if (mode === "login") {
      await login(email, password);
      setSuccess("Login successful! ✨");
    } else {
      const { data } = await axiosBaseURL.post("/auth/signup", {
        fullName,
        email,
        password,
      }, { withCredentials: true });

      setAuth({ accessToken: data.accessToken, user: data.user });
      setSuccess("Signup successful! Welcome ✨");
      setfullName("");
      setEmail("");
      setPassword("");
    }
  } catch (err) {
    // Axios errors have a different shape
    if (err.response) {
      setError(err.response.data.error || "Signup failed");
    } else {
      setError(err.message || "Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="form"
      >
        <h2 className="h2">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>

        {/* Success & Error */}
        {success && (
          <p className="scuccessMsg">
            {success}
          </p>
        )}
        {error && (
          <p className="errorMsg">
            {error}
          </p>
        )}

        {/* Inputs */}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
            className="input"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button
            type="button"
            className="absolute right-4 top-3 text-white/70 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={` ${
            loading
              ? "loadingBtn cursor-not-allowed "
              : "btn hoverBtn"
          }`}
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Signing up..."
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        <p className="text-center text-white/70 text-sm">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-purple-300 hover:text-purple-400 font-medium"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-purple-300 hover:text-purple-400 font-medium"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>
      </form>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }

        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade { animation: fade 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
