"use client";

import { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Login from "@/components/login";

function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  if (status === "authenticated") return null;

  return <Login />;
}

export default function LoginPage() {
  return (
    <div className="font-sans min-h-screen">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono-cx text-cx-on-surface-variant">Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
