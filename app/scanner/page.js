"use client";

import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ScannerPage from "@/components/scanner";

function ScannerContent() {
  return (
    <div className="font-mono-cx min-h-screen">
      <ScannerPage />
    </div>
  );
}

export default function ScannerRoute() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <Suspense fallback={<div className="min-h-screen pt-20 flex items-center justify-center font-mono-cx text-cx-on-surface-variant">Loading scanner...</div>}>
      <ScannerContent />
    </Suspense>
  );
}
