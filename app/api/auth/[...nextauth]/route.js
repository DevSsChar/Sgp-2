import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import connectDB from "@/db/connectDB.mjs";
import User from "@/models/user";

// Decide required vs optional based on models/user.js
// - Required: email (unique, lowercase), fullName
// - Optional: imageUrl
// - Defaults/managed: role ('user'), lastLoginAt, scansCount (0), latestScan (null)

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: "read:user user:email" } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",

  callbacks: {
    // Create or update user record on sign-in
    async signIn({ user, account, profile }) {
      await connectDB();

      const provider = account?.provider;

      // Normalize email
      let email =
        user?.email ||
        profile?.email ||
        (Array.isArray(profile?.emails) && profile.emails[0]?.email) ||
        null;

      // GitHub often hides email; fallback to a no-reply based on login
      if (!email && provider === "github" && profile?.login) {
        email = `${profile.login}@users.noreply.github.com`;
      }

      if (!email) {
        // Cannot satisfy required field "email"
        return false;
      }

      email = String(email).toLowerCase().trim();

      // Required fullName with safe fallbacks
      const fullName =
        user?.name ||
        profile?.name ||
        profile?.login ||
        email.split("@")[0] ||
        "User";

      // Optional avatar
      const imageUrl = user?.image || profile?.avatar_url || profile?.picture || null;

      // Upsert user, maintain required + managed fields
      const dbUser = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            lastLoginAt: new Date(),
            ...(imageUrl ? { imageUrl } : {}),
          },
          $setOnInsert: {
            fullName,
            role: "user",
            scansCount: 0,
            latestScan: null,
          },
        },
        { upsert: true, new: true }
      ).lean();

      // Attach to NextAuth's user object for jwt callback
      user.id = dbUser._id.toString();
      user.role = dbUser.role;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role || "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.userId;
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };