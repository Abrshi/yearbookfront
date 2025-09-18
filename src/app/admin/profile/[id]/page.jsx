"use client";

import { useEffect, useState } from "react";
import { axiosBaseURL } from "@/axios/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProfilePage({ params }) {
  const { id } = params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewer, setViewer] = useState(null); // 👈 selected photo

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosBaseURL.get(`admin/${id}`);
        setProfile(data.profile);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) return <p className="p-4 text-gray-500">Loading profile…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!profile) return <p className="p-4 text-gray-500">Profile not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
     {/* --- Profile header --- */}
<div className="flex flex-col sm:flex-row items-center gap-8 mb-12 ">
  {/* Profile Picture */}
  <div className="relative w-44 h-44 rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-300">
    <img
      src={profile.profilePicture}
      alt={profile.user?.fullName || "Profile"}
      className="w-full h-full object-cover"
    />
    {/* Premium badge */}
    
  </div>

  {/* Profile Info */}
  <div className="flex-1 flex flex-col gap-3">
    <h2 >{profile.user?.fullName}</h2>
    
    <div className="flex flex-wrap gap-2 text-sm text-gray-600">
      <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
        Email: {profile.user?.email}
      </span>
      <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
        Department: {profile.department?.name || "—"}
      </span>
      <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
        Status: {profile.approvalStatus}
      </span>
    </div>

    <p className="mt-4 text-white italic">"{profile.profileQuote || "No quote provided"}"</p>
    <p className="mt-2 text-white">{profile.description || "No description available."}</p>
  </div>
</div>


      {/* --- Gallery --- */}
      {profile.photos?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="rounded-xl shadow-lg"
          >
            {profile.photos.map((pic) => (
              <SwiperSlide key={pic.id}>
                <div
                  className="relative w-full h-64 overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => setViewer(pic)} // 👈 open viewer
                >
                  <img
                    src={pic.url}
                    alt="Profile Gallery"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* --- Viewer Modal --- */}
      {viewer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setViewer(null)}
        >
          <div className="relative max-w-3xl w-full p-4">
            <img
              src={viewer.url}
              alt="Full view"
              className="w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setViewer(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
