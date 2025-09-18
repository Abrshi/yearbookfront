"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { axiosBaseURL } from "@/axios/axios";
import Detail from "@/components/student/Detail";

export default function ProfileDetailPage() {
  const params = useParams();
  const profileId = params.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosBaseURL.get(`/student/${profileId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [profileId]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!data) return <div className="p-6 text-red-500">Profile not found</div>;

  return <Detail profile={data.profile} photos={data.photos} />;
}
