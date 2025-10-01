import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextRequest } from "next/server";

// ★ callbacks の引数に any を使わない
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // token/account/profile は型付き
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile && "email" in profile && typeof profile.email === "string") {
        token.email = profile.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error augment
        session.accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// 型を使う例（不要なら削除OK）
export type AuthRequest = NextRequest;
