import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async redirect({ baseUrl }: { baseUrl: string }) {
      // ログイン後は必ずホームに飛ばす
      return baseUrl + "/";
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
