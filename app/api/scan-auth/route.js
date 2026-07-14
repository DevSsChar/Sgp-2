import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return unauthorized();

    const db = require("../../../actions/lib/db.js");
    const ScanAuthProfile = require("../../../models/scanAuthProfile.js");
    const { getOrigin, toPublicProfile } = require("../../../actions/lib/scanAuthStore.js");

    await db.connect();

    const { searchParams } = new URL(req.url);
    const originParam = searchParams.get("origin");
    const urlParam = searchParams.get("url");

    if (originParam || urlParam) {
      const origin = originParam || getOrigin(urlParam);
      if (!origin) {
        return NextResponse.json({ error: "Invalid origin or URL" }, { status: 400 });
      }
      const doc = await ScanAuthProfile.findOne({ user: userId, origin }).lean();
      if (!doc) {
        return NextResponse.json({ profile: null });
      }
      return NextResponse.json({ profile: toPublicProfile(doc) });
    }

    const profiles = await ScanAuthProfile.find({ user: userId })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      profiles: profiles.map(toPublicProfile),
    });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Failed to load auth profiles" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return unauthorized();

    const body = await req.json();
    const targetUrl = String(body?.url || body?.origin || "").trim();
    const { getOrigin } = require("../../../actions/lib/scanAuthStore.js");
    const origin = body?.origin || getOrigin(targetUrl);

    if (!origin) {
      return NextResponse.json({ error: "Valid URL or origin is required" }, { status: 400 });
    }

    const method = body?.method;
    if (!["credentials", "session"].includes(method)) {
      return NextResponse.json({ error: "method must be credentials or session" }, { status: 400 });
    }

    const db = require("../../../actions/lib/db.js");
    const ScanAuthProfile = require("../../../models/scanAuthProfile.js");
    const { toPublicProfile } = require("../../../actions/lib/scanAuthStore.js");
    const { buildStoredPayload } = require("../../../actions/lib/authSession.js");
    const { encryptPayload } = require("../../../utils/secureStorage.js");

    await db.connect();

    let authConfig;
    if (method === "credentials") {
      if (!body?.password) {
        return NextResponse.json({ error: "Password is required" }, { status: 400 });
      }
      authConfig = {
        method: "credentials",
        loginUrl: body.loginUrl || "",
        username: body.username || "",
        password: body.password,
        usernameSelector: body.usernameSelector || "",
        passwordSelector: body.passwordSelector || "",
        submitSelector: body.submitSelector || "",
      };
    } else {
      const cookies = body?.session?.cookies || body?.cookies;
      if (!Array.isArray(cookies) || cookies.length === 0) {
        return NextResponse.json({ error: "Session cookies are required" }, { status: 400 });
      }
      authConfig = {
        method: "session",
        session: {
          cookies,
          localStorage: body?.session?.localStorage || body?.localStorage || {},
          sessionStorage: body?.session?.sessionStorage || body?.sessionStorage || {},
        },
      };
    }

    const payload = buildStoredPayload(authConfig, authConfig.session || null);
    const encryptedPayload = encryptPayload(payload);

    const doc = await ScanAuthProfile.findOneAndUpdate(
      { user: userId, origin },
      {
        $set: {
          method,
          loginUrl: authConfig.loginUrl || "",
          encryptedPayload,
          lastAuthSuccessAt: new Date(),
          lastAuthError: "",
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      profile: toPublicProfile(doc),
      message: "Authentication saved securely",
    });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Failed to save authentication" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return unauthorized();

    const { searchParams } = new URL(req.url);
    const originParam = searchParams.get("origin");
    const urlParam = searchParams.get("url");
    const { getOrigin } = require("../../../actions/lib/scanAuthStore.js");
    const origin = originParam || getOrigin(urlParam);

    if (!origin) {
      return NextResponse.json({ error: "origin or url query param is required" }, { status: 400 });
    }

    const db = require("../../../actions/lib/db.js");
    const ScanAuthProfile = require("../../../models/scanAuthProfile.js");
    await db.connect();

    await ScanAuthProfile.deleteOne({ user: userId, origin });
    return NextResponse.json({ ok: true, message: "Authentication removed" });
  } catch (e) {
    return NextResponse.json({ error: e?.message || "Failed to delete authentication" }, { status: 500 });
  }
}
