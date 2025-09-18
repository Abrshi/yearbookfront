"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { axiosBaseURL } from "@/axios/axios";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return; // wait for user to load

    const fetchProfile = async () => {
      try {
        const res = await axiosBaseURL.get(`/student/me/${user.id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        // if err is ==Profile not found redirect tostudent/new
        if (err.response?.status === 404) {
          window.location.href = "/student/new";
        } else {
          setError(err.response?.data?.error || err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]); // run when user.id is available

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="errorMsg">{error}</div>;
  if (!data) return null;

  const { profile, photos } = data;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Profile Info */}
      <div className="flex flex-col items-center">
        {profile.profilePicture && (
          <img
            src={profile.profilePicture}
            alt={profile.user.fullName}
            className="w-28 h-28 rounded-full object-cover border"
          />
        )}
        <h1 className="text-2xl font-bold mt-3">{profile.user.fullName}</h1>
        <p className="text-gray-600">{profile.department?.name}</p>
        <p className="mt-1 text-center text-gray-500 max-w-md">
          {profile.profileQuote || "No quote yet"}
        </p>
      </div>

      {/* Album */}
      <div>
        <h2 className="text-xl font-semibold mb-3">My Album</h2>

        {photos.length === 0 ? (
          <p className="text-gray-500">No photos uploaded yet.</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            className="rounded-2xl overflow-hidden shadow"
          >
            {photos.map((photo) => (
              <SwiperSlide key={photo.id}>
                <img
                  src={photo.url}
                  alt={`Photo ${photo.id}`}
                  className="w-auto h-auto object-cover mx-auto px-auto"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
