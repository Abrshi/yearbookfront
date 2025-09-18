"use client";
import { useEffect, useState } from "react";
import Yearbook from "@/components/student/Yearbook";
import CurrentUser from "@/components/student/CurrentUser";
import { axiosBaseURL } from "@/axios/axios";
import { useAuth } from "@/context/AuthContext";

export default function StudentPage() {
  const { user } = useAuth();
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchCurrentUser = async () => {
      try {
        const res = await axiosBaseURL.get(`/student/${user.id}`);
        setCurrentUserProfile(res.data.profile);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [user?.id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!currentUserProfile) return null;

  return (
    <div className="">
      
        <CurrentUser profiles={[currentUserProfile]} singleView />
        

      {/* All other profiles */}
      <Yearbook showAllProfiles currentUserId={user.id} />
    </div>
  );
}
