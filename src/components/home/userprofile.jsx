"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, accessToken, loading, logout } = useAuth();

  if (loading) return <p>Loading session...</p>;
  if (!user) return <Link href="/auth">Please login</Link>;

  return (

    <div >
     
   <h1>Welcome {user.full_name}</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
</div>

  );
}
