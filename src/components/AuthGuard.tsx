"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("discord");
    }
  }, [status]);

  if (status === "loading") {
    return <p className="text-center mt-20">ログイン確認中...</p>;
  }

  return <>{children}</>;
}
