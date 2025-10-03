"use client";
import { useEffect, useState } from "react";
import ValorantStats from "@/components/ValorantStats";

export default function StatsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/valorant/stats")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <ValorantStats activePlayer="Daich1" active={{ summary: data }} />
    </div>
  );
}
