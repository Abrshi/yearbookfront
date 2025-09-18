"use client";
import { useState } from "react";
import { axiosBaseURL } from "../../axios/axios.js";

export default function UserSelectDropdown({ onSelect }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axiosBaseURL.get("/admin/list", {
        params: { search },
      });
      console.log("Fetched users:", res.data); // 👈 log result
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search user by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
      />

      {/* Search & Log Button */}
      <button
        onClick={handleSearch}
        className="btn"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search & Log"}
      </button>

      {/* Dropdown List */}
      <div className="border rounded-lg max-h-60 overflow-y-auto bg-white shadow">
        {loading ? (
          <p className="p-2 text-gray-500">Loading...</p>
        ) : users.length === 0 ? (
          <p className="p-2 text-gray-500">No users found</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelect(user)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              <p className="font-medium">{user.fullName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
