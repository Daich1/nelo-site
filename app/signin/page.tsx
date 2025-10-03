"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0042a1] to-[#f0558b]">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <button
          onClick={() => signIn("discord")}
          className="px-4 py-2 bg-[#0042a1] text-white rounded-lg hover:bg-[#003080]"
        >
          Discord でログイン
        </button>
      </div>
    </div>
  );
}
