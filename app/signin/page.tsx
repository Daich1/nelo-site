"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0042a1] to-[#f0558b]">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        {/* 👇 /public は不要 */}
<img 
  src="/logo.png" 
  alt="Nelo Logo" 
  width={100} 
  height={100} 
  className="mx-auto mb-6"
/>

        <h1 className="text-3xl font-extrabold text-[#0042a1] mb-3">Nelo Internal</h1>
        <p className="mb-8 text-gray-700">Discordでログインして続ける</p>
        <button
          onClick={() => signIn("discord", { callbackUrl: "/" })}
          className="px-6 py-3 w-full rounded-xl bg-[#5865F2] text-white font-semibold shadow-lg hover:bg-[#4752C4] transition"
        >
          Discordでログイン
        </button>
      </div>
    </div>
  );
}
