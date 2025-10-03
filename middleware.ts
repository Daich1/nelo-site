export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // /signin は除外して、それ以外は全部保護
    "/((?!api|_next|signin).*)",
  ],
};
