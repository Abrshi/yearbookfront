"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const { user } = useAuth() || {};
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const studentLinks = [
    { href: "/", label: "Home" },
    { href: "/student", label: "Student" },
    { href: "/student/new", label: "New" },
    { href: "/student/profile", label: "Profile" },
  ];

  const adminLinks = [
    { href: "/", label: "Home" },
    { href: "/admin", label: "Admin" },
    { href: "/admin/profile", label: "Profile" },
  ];

  const navLinks = user?.role === "ADMIN" ? adminLinks : studentLinks;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 w-full">
      {/* Full-width container */}
      <div className="flex items-center justify-between px-6 lg:px-12 h-16 w-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight"
        >
          Yearbook
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-gray-700 hover:text-purple-600 font-medium transition group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
              <FaUserCircle className="text-3xl text-purple-600" />
              <span className="text-gray-700 font-medium">
                {user.name || "User"}
              </span>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium shadow hover:shadow-lg transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-purple-50 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-lg shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <span className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Yearbook
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-700 hover:bg-purple-50 rounded-lg"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex flex-col mt-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-6 py-3 text-gray-700 hover:bg-purple-100 rounded-lg font-medium transition"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile User / Login */}
          <div className="mt-6 px-6">
            {user ? (
              <div className="flex items-center gap-3 py-3 px-4 bg-purple-50 rounded-lg">
                <FaUserCircle className="text-3xl text-purple-600" />
                <span className="font-medium text-gray-700">
                  {user.name || "User"}
                </span>
              </div>
            ) : (
              <Link
                href="/login"
                className="block text-center w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium shadow hover:shadow-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </header>
  );
}
