'use client';
import React, { useEffect, useState, useMemo } from "react";
import { axiosBaseURL } from "@/axios/axios";
import { useAuth } from "../../context/AuthContext";
// Responsive Profiles Approval Page
// Place this file in `pages/profiles.jsx` (Next.js pages router) or adapt into app router.

export default function ProfilesPage() {
  // UI state
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [search, setSearch] = useState("");

  // Pagination / sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // small UI helpers
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [actionComment, setActionComment] = useState("");
  const [departments, setDepartments] = useState([]);
  // context
  const { user } = useAuth();
   const currentUser = user; // auto-filled from context
  console.log("userId from context:", user);

  // get current user (approverId) from localStorage if present
  // const currentUser = useMemo(() => {
  //   try {
  //     if (typeof window === "undefined") return null;
  //     const u = localStorage.getItem("user");
  //     return u ? JSON.parse(u) : null;
  //   } catch (e) {
  //     return null;
  //   }
  // }, []);

  const approverId = currentUser?.id || null;
  console.log("Current user:", currentUser );
  
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId, status, graduationYear, search, page, limit, sortBy, order]);

  async function fetchDepartments() {
    // optional: try to fetch department list for filter dropdown
    try {
      const res = await axiosBaseURL.get(`/student/departments`);
      setDepartments(res.data.data || []);
    } catch (err) {
      // ignore silently; departments are optional
      console.warn("Could not load departments", err?.message || err);
    }
  }

  async function fetchProfiles() {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit,
        sortBy,
        order,
      };
      if (departmentId) params.departmentId = departmentId;
      if (status) params.status = status;
      if (graduationYear) params.graduationYear = graduationYear;
      if (search) params.search = search;

      const res = await axiosBaseURL.get("/admin/", { params });
      setProfiles(res.data.profiles || []);
      setTotal(res.data.total || 0);
      console.log("Fetched profiles:", res.data.profiles);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(profileId, comment = "") {
    if (!approverId) return alert("You must be logged in as an approver to perform this action.");
    if (!window.confirm("Approve this profile?")) return;

    try {
      await axiosBaseURL.post("/admin/approve", {
        profileId,
        approverId,
        comment,
      });
      // refresh
      fetchProfiles();
      alert("Profile approved");
    } catch (err) {
      console.error(err);
      alert("Failed to approve: " + (err?.response?.data?.error || err.message));
    }
  }

  async function handleReject(profileId, comment = "") {
    if (!approverId) return alert("You must be logged in as an approver to perform this action.");
    if (!window.confirm("Reject this profile?")) return;

    try {
      await axiosBaseURL.post("/admin/reject", {
        profileId,
        approverId,
        comment,
      });
      fetchProfiles();
      alert("Profile rejected");
    } catch (err) {
      console.error(err);
      alert("Failed to reject: " + (err?.response?.data?.error || err.message));
    }
  }

  async function handleApproveAll() {
    if (!approverId) return alert("You must be logged in as an approver to perform this action.");
    if (!departmentId) return alert("Choose a department before approving all.");
    if (!window.confirm("Approve ALL pending profiles in this department?")) return;

    try {
      const res = await axiosBaseURL.post("/admin/approve-all", {
        departmentId: Number(departmentId),
        approverId,
      });
      fetchProfiles();
      alert(res.data?.message || "Approved all");
    } catch (err) {
      console.error(err);
      alert("Failed to approve all: " + (err?.response?.data?.error || err.message));
    }
  }

  function handleSearchKey(e) {
    if (e.key === "Enter") {
      setPage(1);
      fetchProfiles();
    }
  }

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10  bg-white/10">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h2>Profile Approvals</h2>
          <div className="text-sm text-gray-600">Approver: {currentUser?.fullName || "(not logged)"}</div>
        </header>

        {/* Filters */}
        <section className="bg-white/10 p-4 rounded-lg shadow-sm mb-6 border-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="label">Department</label>
              <select
                value={departmentId}
                onChange={(e) => { setDepartmentId(e.target.value); setPage(1); }}
                className="input"
              >
                <option className="option" value="">All departments</option>
                {departments.map((d) => (
                  <option className="option" key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="input "
              >
                <option className="option" value="">All</option>
                <option className="option" value="PENDING">PENDING</option>
                <option className="option" value="APPROVED">APPROVED</option>
                <option className="option" value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div>
              <label className="label">Graduation Year</label>
              <input
                value={graduationYear}
                onChange={(e) => { setGraduationYear(e.target.value); setPage(1); }}
                type="number"
                placeholder="e.g. 2025"
                className="input"
              />
            </div>

            <div>
              <label className="label">Search (name or email)</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKey}
                placeholder="Type and press Enter"
                className="input"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <label className="label">Sort</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
                <option className="option" value="createdAt">Created At</option>
                <option className="option" value="graduationYear">Graduation Year</option>
                <option className="option" value="batch">Batch</option>
              </select>

              <select value={order} onChange={(e) => setOrder(e.target.value)} className="input">
                <option className="option" value="desc">Desc</option>
                <option className="option" value="asc">Asc</option>
              </select>

              <label className="label">Per page</label>
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="input">
                <option className="option" value={6}>6</option>
                <option className="option" value={12}>12</option>
                <option className="option" value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => { setSearch(""); setDepartmentId(""); setStatus(""); setGraduationYear(""); setPage(1); }}
                className="text-sm px-3 py-1 border rounded">Reset</button>

              <button
                onClick={handleApproveAll}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded shadow-sm hover:opacity-90"
              >Approve all in department</button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section>
          {loading ? (
            <div className="text-center py-20">Loading…</div>
          ) : error ? (
            <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20 text-gray-600">No profiles found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((p) => (
                <article key={p.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      {p.profilePicture ? (
                        <img src={p.profilePicture} alt={p.user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm text-gray-500">No image</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{p.user.fullName}</h3>
                      <div className="text-xs text-gray-500">{p.user.email}</div>
                      <div className="text-xs text-gray-500">Department: {p.department?.name || "-"}</div>
                      <div className="text-xs text-gray-500">Grad year: {p.graduationYear || "-"}</div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-700 flex-1">{p.description || p.profileQuote || "—"}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs font-semibold px-2 py-1 rounded bg-gray-100">{p.approvalStatus}</div>

                    <div className="flex items-center space-x-2">
                      {p.approvalStatus === "PENDING" && (
                        <>
                          <button
                            onClick={() => { setSelectedProfileId(p.id); const c = prompt('Optional approval comment'); handleApprove(p.id, c || ""); }}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                          >Approve</button>

                          <button
                            onClick={() => { setSelectedProfileId(p.id); const c = prompt('Reason for rejection'); if (c === null) return; handleReject(p.id, c || ""); }}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                          >Reject</button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          // quick view — open profile page or modal
                          window.open(`/admin/profile/${p.id}`, "_blank");
                        }}
                        className="px-3 py-1 text-sm border rounded"
                      >View</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">{total} profiles total</div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >Prev</button>

              <div className="px-3 py-1 border rounded">Page {page} / {totalPages}</div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >Next</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
