"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ScanResultScreen from "./ScanResultScreen";

export default function ReportDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id;
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const breadcrumbSource = searchParams.get("from") === "scanner" ? "scanner" : "history";

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to load report: ${response.statusText}`);
        }
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="scan-result-canvas font-mono-cx lg:ml-80 mt-14 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cx-primary" />
          <p className="mt-4 text-cx-on-surface-variant">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="scan-result-canvas font-mono-cx lg:ml-80 mt-14 min-h-screen flex items-center justify-center p-8">
        <div className="hud-panel border p-8 flex flex-col items-center text-center max-w-md">
          <span className="material-symbols-outlined text-4xl text-cx-error mb-4">error</span>
          <h2 className="font-mono-cx text-xl font-semibold text-cx-on-surface mb-2">Report Not Found</h2>
          <p className="font-mono-cx text-sm text-cx-on-surface-variant mb-6">
            {error || "The accessibility report you're looking for couldn't be found."}
          </p>
          <Link
            href="/history"
            className="px-6 py-3 bg-cx-primary text-cx-on-primary font-mono-cx text-[11px] font-bold uppercase tracking-widest"
          >
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  return <ScanResultScreen report={report} breadcrumbSource={breadcrumbSource} />;
}
