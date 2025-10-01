import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub!,
          },
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
