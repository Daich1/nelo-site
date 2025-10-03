// =======================
// 型定義
// =======================

export type MatchMember = {
  player: string;
  agent: string;
};

export type Match = {
  date: string;                        // 日付
  map: string;                         // マップ
  startFaction?: "攻め" | "守り";      // スタート陣営（アタッカー/ディフェンダー → 攻め/守り）
  allyScore: number;                   // 味方スコア
  enemyScore: number;                  // 敵スコア
  result: "Win" | "Lose" | "Draw";     // 勝敗
  members: MatchMember[];              // メンバー5人
  memo?: string;                       // メモ
};

export type CountWin = { plays: number; wins: number };

export type PlayerSummary = {
  player: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
};

export type Aggregation = {
  overall: PlayerSummary[];
  players: Record<string, {
    summary: PlayerSummary;
    byAgent: Record<string, CountWin>;
    byMap: Record<string, CountWin>;
  }>;
  maps: Record<string, CountWin>;
  agents: Record<string, CountWin>;
  sides: Record<string, CountWin>;
  totals: { games: number; wins: number; losses: number; draws: number; winRate: number };
  fullParty: { games: number; wins: number; losses: number; draws: number; winRate: number };
  daily: { date: string; games: number; wins: number; winRate: number }[];
};

// =======================
// ユーティリティ
// =======================

function toInt(v: any): number {
  const n = parseInt(String(v || "").replace(/[^0-9\\-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function toResult(v: string, ally: number, enemy: number): "Win"|"Lose"|"Draw" {
  const s = (v||"").toLowerCase();
  if (["勝ち","win","w","〇","○"].some(x => s.includes(x))) return "Win";
  if (["負け","lose","l","×","✕"].some(x => s.includes(x))) return "Lose";
  if (["引き分け","draw","d"].some(x => s.includes(x))) return "Draw";
  if (ally > enemy) return "Win";
  if (ally < enemy) return "Lose";
  return "Draw";
}

function normalizeFaction(v: string): "攻め" | "守り" {
  if (["アタッカー","攻め","attack","atk","a"].some(x => v.includes(x))) return "攻め";
  if (["ディフェンダー","守り","defense","def","d"].some(x => v.includes(x))) return "守り";
  return "攻め";
}

// =======================
// パース処理
// =======================

export function parseMatches(values: any[][]): Match[] {
  if (!values || values.length === 0) return [];
  const headers = values[0].map(v => (v ?? "").toString().trim());
  const rows = values.slice(1);

  const idx = {
    date: headers.indexOf("日付"),
    map: headers.indexOf("マップ"),
    startFaction: headers.indexOf("スタート陣営"),
    allyScore: headers.indexOf("味方スコア"),
    enemyScore: headers.indexOf("敵スコア"),
    result: headers.indexOf("勝敗"),
    memo: headers.indexOf("メモ"),
  };

  const memberIdx: number[] = [];
  const agentIdx: number[] = [];
  for (let i=1;i<=5;i++){
    memberIdx.push(headers.indexOf(`メンバー${i}`));
    agentIdx.push(headers.indexOf(`エージェント${i}`));
  }

  const matches: Match[] = [];

  for (const r of rows) {
    if (!r || r.length===0) continue;

    const ally = idx.allyScore>=0 ? toInt(r[idx.allyScore]) : 0;
    const enemy = idx.enemyScore>=0 ? toInt(r[idx.enemyScore]) : 0;

    const members: MatchMember[] = [];
    for (let i=0;i<5;i++){
      const p = memberIdx[i]>=0 ? (r[memberIdx[i]]||"").toString().trim() : "";
      const a = agentIdx[i]>=0 ? (r[agentIdx[i]]||"").toString().trim() : "";
      if (p) members.push({player:p, agent:a});
    }
    if (members.length===0) continue;

    matches.push({
      date: idx.date>=0 ? (r[idx.date]||"").toString() : "",
      map: idx.map>=0 ? (r[idx.map]||"").toString() : "",
      startFaction: idx.startFaction>=0 ? normalizeFaction((r[idx.startFaction]||"").toString()) : undefined,
      allyScore: ally,
      enemyScore: enemy,
      result: toResult(idx.result>=0 ? (r[idx.result]||"").toString() : "", ally, enemy),
      members,
      memo: idx.memo>=0 ? (r[idx.memo]||"").toString() : undefined,
    });
  }
  return matches;
}

// =======================
// 集計処理
// =======================

export function aggregate(matches: Match[]): Aggregation {
  const overallMap: Record<string, PlayerSummary> = {};
  const playerAgent: Record<string, Record<string, CountWin>> = {};
  const playerMap: Record<string, Record<string, CountWin>> = {};

  const globalMaps: Record<string, CountWin> = {};
  const globalAgents: Record<string, CountWin> = {};
  const sides: Record<string, CountWin> = {};
  const dailyMap: Record<string, {games:number; wins:number}> = {};

  let totalGames=0, totalWins=0, totalLosses=0, totalDraws=0;
  let fpGames=0, fpWins=0, fpLosses=0, fpDraws=0;

  for (const m of matches) {
    totalGames++;
    if (m.result==="Win") totalWins++;
    else if (m.result==="Lose") totalLosses++;
    else totalDraws++;

    // フルパ判定
    if (m.members.length===5){
      fpGames++;
      if (m.result==="Win") fpWins++;
      else if (m.result==="Lose") fpLosses++;
      else fpDraws++;
    }

    // サイド集計
    if (m.startFaction){
      const side = m.startFaction;
      if (!sides[side]) sides[side]={plays:0,wins:0};
      sides[side].plays++;
      if (m.result==="Win") sides[side].wins++;
    }

    // 日別
    const d = m.date.split(" ")[0];
    if (!dailyMap[d]) dailyMap[d]={games:0,wins:0};
    dailyMap[d].games++;
    if (m.result==="Win") dailyMap[d].wins++;

    // 各メンバー
    for (const mm of m.members) {
      const p = mm.player;
      if (!overallMap[p]) overallMap[p]={player:p,games:0,wins:0,losses:0,draws:0,winRate:0};
      overallMap[p].games++;
      if (m.result==="Win") overallMap[p].wins++;
      else if (m.result==="Lose") overallMap[p].losses++;
      else overallMap[p].draws++;

      // byAgent
      if (mm.agent){
        if (!playerAgent[p]) playerAgent[p]={};
        if (!playerAgent[p][mm.agent]) playerAgent[p][mm.agent]={plays:0,wins:0};
        playerAgent[p][mm.agent].plays++;
        if (m.result==="Win") playerAgent[p][mm.agent].wins++;

        if (!globalAgents[mm.agent]) globalAgents[mm.agent]={plays:0,wins:0};
        globalAgents[mm.agent].plays++;
        if (m.result==="Win") globalAgents[mm.agent].wins++;
      }

      // byMap
      if (m.map){
        if (!playerMap[p]) playerMap[p]={};
        if (!playerMap[p][m.map]) playerMap[p][m.map]={plays:0,wins:0};
        playerMap[p][m.map].plays++;
        if (m.result==="Win") playerMap[p][m.map].wins++;

        if (!globalMaps[m.map]) globalMaps[m.map]={plays:0,wins:0};
        globalMaps[m.map].plays++;
        if (m.result==="Win") globalMaps[m.map].wins++;
      }
    }
  }

  const overall = Object.values(overallMap).map(s=>({...s, winRate: s.games? s.wins/s.games:0}))
    .sort((a,b)=> b.winRate - a.winRate);

  const players: Aggregation["players"] = {};
  for (const p of Object.keys(overallMap)){
    players[p] = {
      summary: overall.find(o=>o.player===p)!,
      byAgent: playerAgent[p]||{},
      byMap: playerMap[p]||{}
    };
  }

  const totals = {games:totalGames,wins:totalWins,losses:totalLosses,draws:totalDraws,winRate: totalGames? totalWins/totalGames:0};
  const fullParty = {games:fpGames,wins:fpWins,losses:fpLosses,draws:fpDraws,winRate: fpGames? fpWins/fpGames:0};
  const daily = Object.entries(dailyMap).map(([date,v])=>({date,games:v.games,wins:v.wins,winRate:v.wins/v.games}))
    .sort((a,b)=> new Date(a.date).getTime()-new Date(b.date).getTime());

  return {overall, players, maps:globalMaps, agents:globalAgents, sides, totals, fullParty, daily};
}
