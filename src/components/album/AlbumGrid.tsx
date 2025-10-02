"use client";
import Image from "next/image";
import { clsx } from "clsx";
import { Lock } from "lucide-react";


export type Role = "Admin"|"Nelo"|"Member"|"Guest";


export function AlbumGrid({ images, role }: { images: string[]; role: Role }){
const canView = role !== "Guest";
return (
<div className="grid grid-cols-3 gap-3">
{images.map((src, i) => (
<div key={i} className={clsx("relative aspect-square overflow-hidden rounded-xl bg-neutral-100",
!canView && "filter blur-sm")}
>
<Image src={src} alt="album" fill className="object-cover" />
{!canView && (
<div className="absolute inset-0 grid place-items-center">
<div className="bg-black/50 text-white px-3 py-1 rounded-xl flex items-center gap-2 text-xs">
<Lock size={14}/> Members only
</div>
</div>
)}
</div>
))}
</div>
);
}