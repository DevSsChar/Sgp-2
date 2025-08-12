"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UserDashboard({ user: userProp = null, reports: reportsProp = [] }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(userProp);
  const [reports, setReports] = useState(reportsProp);
  const [loading, setLoading] = useState(!userProp);

  // Optional: try to fetch richer user data if an API exists (safe fallback if 404)
  useEffect(() => {
    if (userProp) return;
    let abort = false;
    async function load() {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (!res.ok) throw new Error("no api");
        const data = await res.json();
        if (!abort) {
          setUser(data?.user || null);
          setReports(data?.reports || []);
        }
      } catch {
        // Fallback to session info only
        if (!abort) {
          setUser({
            fullName: session?.user?.name || "User",
            email: session?.user?.email || "",
            scansCount: 0,
            lastLoginAt: null,
          });
        }
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => { abort = true; };
  }, [session, userProp]);

  const stats = useMemo(() => {
    return [
      { label: "Total Scans", value: user?.scansCount ?? 0 },
      {
        label: "Last Login",
        value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "—",
      },
      {
        label: "Last Report",
        value: reports?.length ? new Date(reports[0]?.createdAt).toLocaleString() : "—",
      },
    ];
  }, [user, reports]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-poppins text-2xl md:text-3xl font-bold text-[#00483a]">
              Welcome{user?.fullName ? `, ${user.fullName}` : ""} 👋
            </h1>
            <p className="font-roboto text-gray-600">
              View your accessibility scans and reports.
            </p>
          </div>
          <Link
            href="/scanner"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/90 shadow-md transition-all h-10 px-4"
          >
            Start New Scan
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-xl bg-white shadow-card hover:shadow-elegant transition-all p-5"
            >
              <div className="text-sm text-gray-500">{s.label}</div>
              <div className="mt-1 font-poppins text-xl text-gray-900">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Reports */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins text-lg font-semibold text-gray-900">Recent Reports</h2>
            <Link href="/dashboard/reports" className="text-sm text-[#00d4ff] hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-md bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : reports?.length ? (
            <ul className="divide-y divide-gray-100">
              {reports.slice(0, 5).map((r) => (
                <li key={r._id} className="py-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{r.targetUrl}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(r.createdAt).toLocaleString()} • {r.summary?.issuesTotal ?? 0} issues
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/reports/${r._id}`}
                    className="text-sm text-[#00d4ff] hover:underline"
                  >
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p className="font-roboto text-gray-600">No reports yet.</p>
              <Link
                href="/scanner"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-[#00d4ff] text-white font-semibold hover:bg-[#00d4ff]/90 shadow-md transition-all h-10 px-4"
              >
                Run your first scan
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}