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
  const removeMessageField = (index) => setMessages(messages.filter((_, i) => i !== index));

  return (
    <div
      style={{
        maxWidth: 650,
        margin: "40px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Send Bulk Emails</h2>

      <input
        style={{
          width: "100%",
          padding: "12px 15px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          outline: "none",
          transition: "border 0.2s",
        }}
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        onFocus={(e) => (e.target.style.borderColor = "#0070f3")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #eee",
            backgroundColor: "#fafafa",
          }}
        >
          <textarea
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
              resize: "vertical",
              minHeight: "80px",
              outline: "none",
            }}
            placeholder={`Message section #${i + 1}`}
            value={msg}
            onChange={(e) => updateMessage(i, e.target.value)}
          />
          <button
            onClick={() => removeMessageField(i)}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#ff7875")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4d4f")}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addMessageField}
        style={{
          padding: "10px 16px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#1890ff",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
          marginRight: "10px",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#40a9ff")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#1890ff")}
      >
        Add Section
      </button>

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: loading ? "#ccc" : "#52c41a",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          transition: "background-color 0.2s",
        }}
      >
        {loading ? "Sending..." : "Send Emails"}
      </button>
    </div>
  );
}
