"use client";
import { useState } from "react";
import UserSelectDropdown from "./UserSelectDropdown";
import { axiosBaseURL } from "../../axios/axios.js";

export default function CreateDepartmentForm() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [deptEmail, setDeptEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deptName.trim()) {
      setMessage({ type: "error", text: "Department name is required!" });
      return;
    }
    if (!selectedUser) {
      setMessage({ type: "error", text: "Please select a department head!" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await axiosBaseURL.post(
        "/admin/add",
        {
          name: deptName,
          email: deptEmail,
          headUserId: selectedUser.id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage({ type: "success", text: "✅ Department created successfully!" });

      // Reset form
      setDeptName("");
      setDeptEmail("");
      setSelectedUser(null);
    } catch (err) {
      console.error("Error creating department:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "❌ Failed to create department",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form space-y-4">
      <h2 className="h2">Create Department</h2>

      {message && (
        <p
          className={`text-sm font-medium mb-2 ${
            message.type === "success" ? "scuccessMsg" : "errorMsg"
          }`}
        >
          {message.text}
        </p>
      )}

      <input
        type="text"
        placeholder="Department Name"
        value={deptName}
        onChange={(e) => setDeptName(e.target.value)}
        className="input"
      />

      <input
        type="email"
        placeholder="Department Email (optional)"
        value={deptEmail}
        onChange={(e) => setDeptEmail(e.target.value)}
        className="input"
      />

      <UserSelectDropdown onSelect={setSelectedUser} />

      {selectedUser && (
        <p className="text-sm text-green-600">
          Selected Head: {selectedUser.fullName} ({selectedUser.email})
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg text-white transition ${
          loading
            ? "loadingBtn cursor-not-allowed "
              : "btn hoverBtn"
        }`}
      >
        {loading ? "Creating..." : "Create Department"}
      </button>
    </form>
  );
}
