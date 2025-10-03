import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Valorant Stats API
 * JSON を返すだけ（JSXは書かない）
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 本来ここでDBやシートからデータを取得する
  // いったんダミーデータで返す
  const stats = {
    games: 20,
    winRate: 0.55,
  };

  res.status(200).json(stats);
}
