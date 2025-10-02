export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!api/auth|signin).*)", // 👈 /signin を除外
  ],
};
