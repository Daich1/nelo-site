// src/config/roles.ts
export const roles: Record<string, "Admin" | "Nelo" | "Member"> = {
  // Admin
  "250831133388963850": "Admin", // あなた

  // Neloメンバー（追加したい人のIDを入れる）
  "111111111111111111": "Nelo",
  "222222222222222222": "Nelo",

  // Member（閲覧のみ）
  "333333333333333333": "Member",

  // Guest → 未登録ユーザー（自動判定されるのでここに書かなくてOK）
};
