"use client";

import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReportDetailPage from "@/components/report";

function ReportLoading() {
  return (
    <div className="scan-result-canvas font-mono-cx lg:ml-80 mt-14 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cx-primary" />
        <p className="mt-4 text-cx-on-surface-variant">Loading report details...</p>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <div className="font-sans min-h-screen">
      <Suspense fallback={<ReportLoading />}>
        <ReportDetailPage />
      </Suspense>
    </div>
  );
}
