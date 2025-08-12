"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReportDetailPage from "@/components/report";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

//   if (status === "authenticated") return null; // prevent flicker

  return (
    <div className="font-sans min-h-screen">
      <ReportDetailPage />
    </div>
  );
}