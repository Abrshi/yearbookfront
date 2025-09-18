"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

export default function ProfileById() {
  const { id } = useParams(); // grab :id from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5500/api/v1/admin/profiles/${id}`
        );
        setProfile(data.profile);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{profile.user.fullName}</h1>
      <p className="text-gray-600 mb-2">
        <strong>Email:</strong> {profile.user.email}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Department:</strong> {profile.department?.name || "—"}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Status:</strong> {profile.approvalStatus}
      </p>

      {profile.profilePictures?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Pictures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile.profilePictures.map((pic) => (
              <div
                key={pic.id}
                className="relative w-full h-48 rounded-xl overflow-hidden shadow"
              >
                <Image
                  src={pic.url}
                  alt="Profile Picture"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
