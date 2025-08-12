"use client"
import Login from "@/components/login";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import UserDashboard from "@/components/dashboard";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <UserDashboard />
    </div>
  );
}
