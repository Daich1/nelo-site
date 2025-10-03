"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session?.user?.role !== "Admin") {
      alert("権限がありません");
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") return <div className="p-6">Loading...</div>;
  if (session?.user?.role !== "Admin") return null;

  return <>{children}</>;
}
