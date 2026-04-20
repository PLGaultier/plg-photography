"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-700 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent border-b border-neutral-700 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Message</label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="w-full bg-transparent border-b border-neutral-700 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
          placeholder="Tell me about your project..."
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="text-xs tracking-widest uppercase text-white border border-neutral-700 px-8 py-3 hover:border-white transition-colors disabled:opacity-40"
      >
        {status === "sending" ? "Sending..." : "Send"}
      </button>
      {status === "sent" && (
        <p className="text-xs tracking-widest uppercase text-neutral-500">Message sent.</p>
      )}
      {status === "error" && (
        <p className="text-xs tracking-widest uppercase text-red-500">Something went wrong.</p>
      )}
    </form>
  );
}
