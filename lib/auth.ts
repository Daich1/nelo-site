import { NextAuthOptions, getServerSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub === process.env.ADMIN_DISCORD_ID) {
        (session.user as any).role = "Admin";
      } else {
        (session.user as any).role = "Guest";
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 👇 これを追加
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}
