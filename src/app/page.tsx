import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";


export default async function Home(){
const user = await getCurrentUser();
return (
<div className="space-y-8">
<section className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-tr from-brand-primary to-brand-accent text-white">
<h1 className="text-3xl md:text-5xl font-bold">Nelo Internal</h1>
<p className="mt-2 opacity-90">Events, schedules, and albums — all in one.</p>
<div className="mt-6 flex gap-3">
<Link href="/events" className="bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl">Browse Events</Link>
<Link href="/schedule" className="bg-white text-neutral-900 hover:opacity-90 transition px-4 py-2 rounded-xl">Annual Schedule</Link>
</div>
</section>


<section className="grid md:grid-cols-3 gap-4">
<Link href="/announcements" className="card">
<h3 className="font-semibold">Announcements</h3>
<p className="text-sm text-neutral-500">Latest internal notes</p>
</Link>
<Link href="/events" className="card">
<h3 className="font-semibold">Events</h3>
<p className="text-sm text-neutral-500">Find event details & inline albums</p>
</Link>
<Link href="/schedule" className="card">
<h3 className="font-semibold">Annual Schedule</h3>
<p className="text-sm text-neutral-500">Plan by month</p>
</Link>
</section>


<div className="text-sm text-neutral-500">Signed in as: <span className="font-medium">{user.role}</span></div>
</div>
);
}