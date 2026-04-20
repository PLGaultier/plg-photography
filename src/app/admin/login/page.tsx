"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">
        <h1 className="text-xs tracking-[0.3em] uppercase text-neutral-500">Admin</h1>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Password"
            className="w-full bg-transparent border-b border-neutral-700 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors"
          />
          {error && <p className="mt-2 text-xs text-red-500">Incorrect password</p>}
        </div>
        <button
          type="submit"
          className="text-xs tracking-widest uppercase text-white border border-neutral-700 px-8 py-3 hover:border-white transition-colors w-full"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
