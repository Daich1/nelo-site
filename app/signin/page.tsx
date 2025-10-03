"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0042a1] to-[#f0558b]">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nelo サイトにログイン</h1>
        <p className="mb-6 text-gray-600">Discord アカウントでサインインしてください</p>

        <button
          onClick={() => signIn("discord")}
          className="w-full bg-[#5865F2] text-white py-3 rounded-xl font-semibold hover:bg-[#4752C4] transition-colors"
        >
          Discord でログイン
        </button>
      </div>
    </div>
  );
}
