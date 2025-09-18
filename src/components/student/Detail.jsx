"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Detail({ profile, photos }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
        <p className="mt-1 text-center text-gray-500 max-w-md">{profile.profileQuote}</p>
        <p className="mt-2 text-center text-gray-700">{profile.description}</p>
      </div>

      {photos.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1}
          className="rounded-2xl overflow-hidden shadow mt-4"
        >
          {photos.map((ph) => (
            <SwiperSlide key={ph.id}>
              <img src={ph.url} alt={`Photo ${ph.id}`} className="w-auto h-auto object-cover mx-auto px-auto"/>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
