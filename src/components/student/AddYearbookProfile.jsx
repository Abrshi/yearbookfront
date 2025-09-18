"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { axiosBaseURL } from "@/axios/axios";

export default function AddYearbookProfile() {
  const { user } = useAuth();
  const userId = user?.id; // auto-filled from context
  console.log("userId from context:", userId);

  const [batch, setBatch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [profileQuote, setProfileQuote] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState(Array(5).fill(null)); // store objects { file, preview }
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosBaseURL.get("/student/departments"); // your route
        setDepartments(res.data.data || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  // Handle photo selection
  const handlePhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newPhotos = [...photos];
    newPhotos[index] = {
      file,
      preview: URL.createObjectURL(file),
    };
    setPhotos(newPhotos);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("batch", batch);
      formData.append("departmentId", departmentId);
      formData.append("profileQuote", profileQuote);
      formData.append("description", description);

      photos.forEach((p) => {
        if (p?.file) {
          formData.append("photos", p.file);
        }
      });

      const res = await axiosBaseURL.post(
        "/student/addYearBookProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-50">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="h2">Add Yearbook Profile</h2>

        {/* Feedback */}
        {message && (
          <p
            className={`p-3 rounded-lg text-center ${
              message.startsWith("✅") ? "scuccessMsg" : "errorMsg"
            }`}
          >
            {message}
          </p>
        )}

        {/* hidden userId */}
        <input type="hidden" value={userId} readOnly />

        {/* Batch dropdown */}
        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="input"
          required
        >
          <option className="option" value="">
            Select Batch
          </option>
          <option className="option" value="2014">
            2014
          </option>
          <option className="option" value="2015">
            2015
          </option>
        </select>

        {/* Department dropdown */}
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="input"
          required
        >
          <option className="option" value="">
            Select Department
          </option>
          {departments.map((dept) => (
            <option className="option" key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Your Favorite Quote"
          value={profileQuote}
          onChange={(e) => setProfileQuote(e.target.value)}
          className="input"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="input"
        />

        {/* 5 Photo slots */}
        <div className="grid grid-cols-5 gap-2">
          {photos.map((photo, i) => (
            <label
              key={i}
              className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 relative"
            >
              {photo?.preview ? (
                <img
                  src={photo.preview}
                  alt={`preview-${i}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <PhotoIcon className="w-8 h-8 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e, i)}
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={` ${
            loading ? "loadingBtn cursor-not-allowed " : "btn hoverBtn"
          }`}
        >
          {loading ? "Submitting..." : "Submit Profile"}
        </button>
      </form>
    </div>
  );
}
