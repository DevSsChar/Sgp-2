"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Login from "@/components/login";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); 
    }
  }, [status, router]);

  if (status === "authenticated") return null; // prevent flicker

  return (
    <div className="font-sans min-h-screen">
      <Login />
    </div>
  );
}