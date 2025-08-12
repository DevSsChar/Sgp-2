import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
export const runtime = "nodejs";

export async function GET(req) {
  try {
  const session = await getServerSession(authOptions);
    const userId = session?.user?.id || session?.user?._id || null;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = require("../../../actions/lib/db.js");
    const ScanReport = require("../../../models/scanReport.js");
    await db.connect();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ScanReport.find({ user: userId })
        .select({
          reportId: 1,
          baseUrl: 1,
          startedAt: 1,
          finishedAt: 1,
          summary: 1,
          "pages.url": 1,
        })
        .sort({ createdAt: -1, finishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ScanReport.countDocuments({ user: userId }),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
