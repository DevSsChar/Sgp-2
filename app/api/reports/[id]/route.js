import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || session?.user?._id || null;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = require("../../../../actions/lib/db.js");
    const ScanReport = require("../../../../models/scanReport.js");
    await db.connect();

    // Using await to properly access params.id as recommended by Next.js
    const { id: reportId } = await params;
    if (!reportId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const doc = await ScanReport.findOne({ reportId, user: userId }).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
