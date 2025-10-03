"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0042a1] to-[#f0558b]">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Nelo Portal</h1>
        <p className="mb-4">ログインして続けてください</p>
        <button
          onClick={() => signIn("discord", { callbackUrl: "/" })}
          className="px-6 py-3 rounded-lg bg-[#5865F2] text-white font-bold hover:bg-[#4752c4]"
        >
          Discordでログイン
        </button>
      </div>
    </div>
  );
}
