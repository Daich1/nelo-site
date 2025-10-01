import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { roles } from "@/config/roles";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const userId = token.sub!; // Discordの一意ID
        (session.user as any).id = userId;

        // roles.ts からロールを参照、なければ Guest
        (session.user as any).role = roles[userId] || "Guest";
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
