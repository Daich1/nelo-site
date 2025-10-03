"use client";

import { signIn, useSession } from "next-auth/react";

export default function SignInPage() {
  const session = useSession();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0042a1] to-[#f0558b]">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        {!session?.data ? (
          <button
            onClick={() => signIn("discord")}
            className="bg-[#0042a1] text-white px-6 py-3 rounded-lg hover:bg-[#003080]"
          >
            Discord でログイン
          </button>
        ) : (
          <p>ログイン済み: {session.data.user?.name}</p>
        )}
      </div>
    </div>
  );
}
