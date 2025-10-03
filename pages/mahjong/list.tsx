import { getSheetsClient, SPREADSHEET_ID } from "@/lib/googleSheets";

export default async function MahjongList() {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "MAHJONG!A:K",
  });

  const rows = res.data.values || [];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">麻雀戦績一覧</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">日付</th>
            <th className="p-2 border">タイプ</th>
            <th className="p-2 border">Daich1点</th>
            <th className="p-2 border">Daich1順位</th>
            <th className="p-2 border">Hamupetit点</th>
            <th className="p-2 border">Hamupetit順位</th>
            <th className="p-2 border">nakapixis点</th>
            <th className="p-2 border">nakapixis順位</th>
            <th className="p-2 border">つばちゃんだよ点</th>
            <th className="p-2 border">つばちゃんだよ順位</th>
            <th className="p-2 border">コメント</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => (
                <td key={i} className="p-2 border text-center">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
