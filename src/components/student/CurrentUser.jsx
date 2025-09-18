"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { axiosBaseURL } from "@/axios/axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function CurrentUser() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosBaseURL.get(`/student/me/${user.id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
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
  }, [user?.id]);

  if (loading) return <div className="p-6 text-center animate-pulse">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!data) return null;

  const { profile, photos } = data;

  return (
    <div className="max-w-[100vw] mx-auto px-6 py-12">
      {/* Album Section - Now on Top */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-12"
      >
       
        {photos.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            No photos uploaded yet.
          </p>
        ) : (
          <div className="rounded-3xl shadow-2xl overflow-hidden border border-gray-200 bg-white/40 backdrop-blur-xl ">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={30}
              slidesPerView={1}
              className="rounded-3xl"
            >
              {photos.map((photo) => (
                <SwiperSlide key={photo.id}>
                  <motion.img
                    src={photo.url}
                    alt={`Photo ${photo.id}`}
                    className="w-auto h-[80vh] object-cover mx-auto rounded-3xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </motion.div>

      {/* Profile Card - Below Album */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative "
      >
        {/* Gradient background */}
        
       <div className="relative p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-xl shadow-xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {profile.user?.fullName || "Anonymous"}
            </h2>

            <p className="text-lg text-gray-600 font-medium mt-1">
              {profile.department?.name || "No department"}
            </p>
          <div className="mt-6 flex gap-6">
            <p className="mt-4 text-xl italic text-yellow-700 max-w-2xl mx-auto">
              {profile.profileQuote || "“No quote yet”"}
            </p>

            <p className="mt-4 text-amber-900 max-w-2xl mx-auto leading-relaxed">
              {profile.description || "No description available."}
            </p>

           
            </div>
          </div>
      </motion.div>
    </div>
  );
}
