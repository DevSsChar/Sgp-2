import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/connectDB.mjs";
import User from "@/models/user";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email })
    // .populate("latestScan", "createdAt")
    // .lean();

  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}