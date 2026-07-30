"use client";

import React, { useState } from "react";

export default function AdminNewsletterPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [passcode, setPasscode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message || !passcode) {
      setStatus("error");
      setFeedback("Please fill out all fields.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, passcode })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setFeedback(data.message || "Newsletter sent successfully!");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
        setFeedback(data.error || "Failed to send newsletter.");
      }
    } catch (err) {
      setStatus("error");
      setFeedback("Network error. Could not send.");
    }
  };

  return (
    <main className="flex-1 p-6 md:p-10 bg-[#fcf9f8] overflow-y-auto font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-[#001410] mb-2">Newsletter Broadcast</h1>
        <p className="text-zinc-500 mb-8">Draft and send emails to all Inner Circle subscribers.</p>

        <form onSubmit={handleSend} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-200">
          
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#001410] mb-2">Subject Line</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. 50% Off Diwali Rentals!"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#775a19] transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#001410] mb-2">Message Body</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Write your email content here..."
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#775a19] transition-colors resize-y"
            ></textarea>
            <p className="text-[11px] text-zinc-400 mt-2 italic">* Line breaks will be preserved in the sent email.</p>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#001410] mb-2">Admin Passcode</label>
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter the secure broadcast passcode"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#775a19] transition-colors"
            />
          </div>

          {feedback && (
            <div className={`p-4 rounded-lg mb-6 text-sm font-bold ${status === 'success' ? 'bg-[#c6ede2] text-[#001410]' : 'bg-red-50 text-red-600'}`}>
              {feedback}
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full bg-[#001410] text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-[#00261f] transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Blast Newsletter"}
          </button>
        </form>
      </div>
    </main>
  );
}
