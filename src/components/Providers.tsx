"use client";
import { ReactNode, useEffect, useState } from "react";


export function Providers({ children }: { children: ReactNode }){
// Light theme default; hook for future theme toggle
const [mounted, setMounted] = useState(false);
useEffect(()=>setMounted(true),[]);
if(!mounted) return <>{children}</>;
return <>{children}</>;
}