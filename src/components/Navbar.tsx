import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";


export async function Navbar(){
const user = await getCurrentUser();
return (
<header className="py-4">
<nav className="flex items-center justify-between gap-4">
<Link href="/" className="font-bold text-lg" style={{color:"#0042a1"}}>N</Link>
<ul className="flex items-center gap-5 text-sm">
<li><Link href="/events">Events</Link></li>
<li><Link href="/schedule">Schedule</Link></li>
<li><Link href="/announcements">Announcements</Link></li>
<li className="opacity-60">Role: {user.role}</li>
</ul>
</nav>
</header>
);
}