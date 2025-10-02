import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";


export default async function Home(){
const user = await getCurrentUser();
return (
<div className="space-y-8">
<section className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-tr from-brand-primary to-brand-accent text-white">
<h1 className="text-3xl md:text-5xl font-bold">Nelo Internal</h1>
<p className="mt-2 opacity-90">イベント、スケジュール、アルバムを一括管理</p>
<div className="mt-6 flex gap-3">
<Link href="/events" className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl">イベント一覧を見る</Link>
<Link href="/schedule" className="bg-white text-neutral-900 hover:opacity-90 transition px-4 py-2 rounded-xl">年間スケジュール</Link>
</div>
</section>


<section className="grid md:grid-cols-3 gap-4">
<Link href="/announcements" className="card">
<h3 className="font-semibold">お知らせ</h3>
<p className="text-sm text-neutral-500">最新のお知らせ</p>
</Link>
<Link href="/events" className="card">
<h3 className="font-semibold">イベント</h3>
<p className="text-sm text-neutral-500">イベント詳細とアルバム</p>
</Link>
<Link href="/schedule" className="card">
<h3 className="font-semibold">年間スケジュール</h3>
<p className="text-sm text-neutral-500">月ごとの予定</p>
</Link>
</section>


<div className="text-sm text-neutral-500">権限: <span className="font-medium">{user.role}</span></div>
</div>
);
}