export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",               // ホーム
    "/events/:path*",  // イベント
    "/announcements/:path*", // お知らせ
    "/diary/:path*",   // 日記
    "/schedule",       // スケジュール
    "/mahjong/:path*", // 麻雀
  ],
};
