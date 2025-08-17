"use client"
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Demo from "@/components/demo";

export default function Home() {
//   if (status === "authenticated") return null; // prevent flicker

  return (
    <div className="font-sans min-h-screen">
      <Demo />
    </div>
  );
}