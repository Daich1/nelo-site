export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // ここでログイン必須にしたいパスを指定
    "/((?!api/auth).*)", // 認証関連以外は全部
  ],
};
