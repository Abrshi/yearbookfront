"use client";
import { useEffect, useState } from "react";
import { axiosBaseURL } from "@/axios/axios";
import { useRouter } from "next/navigation";

export default function Yearbook({
  profiles = [],
  singleView,
  showAllProfiles,
  currentUserId,
}) {
  const [allProfiles, setAllProfiles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Fetch profiles
  useEffect(() => {
    if (!showAllProfiles) return;

    const fetchProfiles = async () => {
      try {
        const res = await axiosBaseURL.get("/student/all");
        const others = res.data.filter((p) => p.user.id !== currentUserId);
        setAllProfiles(others);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };

    fetchProfiles();
  }, [showAllProfiles, currentUserId]);

  // Fetch departments
  useEffect(() => {
    if (!showAllProfiles) return;

    const fetchDepartments = async () => {
      try {
        const res = await axiosBaseURL.get("/student/departments");
        setDepartments(res.data.data || []); // ✅ consistent with AddYearbookProfile
      } catch (err) {
        console.error("Error fetching departments:", err);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [showAllProfiles]);

  // Filtering
  const filteredProfiles = allProfiles.filter((p) => {
    const matchDept = departmentId
      ? p.department?.id === Number(departmentId) // cast string → number
      : true;
    const matchSearch = search
      ? p.user.fullName.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchDept && matchSearch;
  });

  const displayProfiles = showAllProfiles ? filteredProfiles : profiles;

  if (displayProfiles.length === 0)
    return <p className="text-gray-500 text-center">No profiles found.</p>;

  return (
    <div className="space-y-6">
      {showAllProfiles && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4 max-w-64">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by name..."
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Department dropdown */}
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="input"
          >
            <option className="option" value="">
              All Departments
            </option>
            {departments.map((dept) => (
              <option className="option" key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mx-10">
        {displayProfiles.map((p) => (
          <div
            key={p.id}
            className="group cursor-pointer bg-white/80 rounded-2xl shadow hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200"
            onClick={() => showAllProfiles && router.push(`/student/${p.id}`)}
          >
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={p.profilePicture}
                alt={p.user.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
            </div>

            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition">
                {p.user.fullName}
              </h3>
              <p className="text-sm text-gray-500">{p.department?.name}</p>
              {p.profileQuote && (
                <p className="mt-2 text-sm italic text-gray-600">
                  “{p.profileQuote}”
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
