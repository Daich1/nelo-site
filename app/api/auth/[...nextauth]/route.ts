import NextAuth, { NextAuthOptions } from "next-auth";
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
      // Discord の user.id は token.sub に入る
      if (token.sub === process.env.ADMIN_DISCORD_ID) {
        (session.user as any).role = "Admin";
      } else {
        (session.user as any).role = "Guest";
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin", // 👈 カスタムログインページを指定
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
