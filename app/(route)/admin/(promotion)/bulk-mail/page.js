"use client";

import { useState } from "react";

export default function BulkEmailForm() {
  const [subject, setSubject] = useState("");
  const [messages, setMessages] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/sendBulkEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, messages }),
    });
    const data = await res.json();
    alert(`Emails sent: ${data.sent}`);
    setLoading(false);
  };

  const updateMessage = (index, value) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  const addMessageField = () => setMessages([...messages, ""]);
  const removeMessageField = (index) =>
    setMessages(messages.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] md:px-6 px-1 md:py-10 py-5">
      <div className="w-full max-w-2xl bg-[color:var(--card)] shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-[color:var(--accent)] mb-6">
          Send Bulk Emails
        </h2>

        {/* Subject Input */}
        <input
          className="w-full py-3 px-4 mb-6 border border-[color:var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
          placeholder="Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className="flex flex-col mb-6 border border-[color:var(--border)] rounded-lg p-4 bg-[color:var(--muted)]"
          >
            <textarea
              className="w-full py-3 px-4 mb-4 border border-[color:var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent resize-none"
              placeholder={`Message section #${i + 1}`}
              rows={4}
              value={msg}
              onChange={(e) => updateMessage(i, e.target.value)}
            />
            <button
              onClick={() => removeMessageField(i)}
              className="w-full py-2 px-4 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Remove Section
            </button>
          </div>
        ))}

        {/* Add Section */}
        <button
          onClick={addMessageField}
          className="w-full py-3 px-4 mb-6 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Add Section
        </button>

        {/* Send Emails */}
        <button
          onClick={handleSend}
          disabled={loading}
          className={`w-full py-3 px-4 text-lg font-semibold rounded-lg transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {loading ? "Sending..." : "Send Emails"}
        </button>
      </div>
    </div>
  );
}
