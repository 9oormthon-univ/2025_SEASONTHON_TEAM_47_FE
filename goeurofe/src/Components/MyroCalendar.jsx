// src/components/ItineraryTester.jsx
import React, { useState } from "react";
import axios from "axios";

// ✅ 프록시 제거: 절대 URL 사용
const API_URL = "https://two025-seasonthon-team-47-be.onrender.com/api/itineraries/generate";

export default function ItineraryTester() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(1);
  const [month, setMonth] = useState("");
  const [interests, setInterests] = useState("");
  const [pace, setPace] = useState("");
  const [budget, setBudget] = useState("");
  const [travelerType, setTravelerType] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok, status, data, request }

  const fillDemo = () => {
    setCity("Seoul");
    setDays(2);
    setMonth("October");
    setInterests("food, history, cafe");
    setPace("balanced");
    setBudget("medium");
    setTravelerType("friends");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      city: city || "string",
      days: Number(days) || 1,
      month: month || "string",
      interests: interests
        ? interests.split(",").map((s) => s.trim()).filter(Boolean)
        : ["string"],
      pace: pace || "string",
      budget: budget || "string",
      travelerType: travelerType || "string",
    };

    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,   // ✅ 쿠키/자격증명 미동봉 (431/CORS 예방)
        timeout: 15000,
        validateStatus: () => true, // 네트워크/서버 상태 그대로 보여주기
      });
      setResult({
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        data: res.data,
        request: payload,
      });
    } catch (err) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data ?? String(err);
      setResult({ ok: false, status, data, request: payload });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Itinerary API Tester</h1>

      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.row}>
          <label style={styles.label}>city</label>
          <input style={styles.input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Seoul" />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>days</label>
          <input
            type="number"
            min="1"
            style={styles.input}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="1"
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>month</label>
          <input style={styles.input} value={month} onChange={(e) => setMonth(e.target.value)} placeholder="e.g., October" />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>interests</label>
          <input
            style={styles.input}
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="comma separated, e.g., food, history, cafe"
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>pace</label>
          <input style={styles.input} value={pace} onChange={(e) => setPace(e.target.value)} placeholder="relaxed / balanced / packed" />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>budget</label>
          <input style={styles.input} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="low / medium / high" />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>travelerType</label>
          <input
            style={styles.input}
            value={travelerType}
            onChange={(e) => setTravelerType(e.target.value)}
            placeholder="solo / couple / family / friends"
          />
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={fillDemo} style={styles.secondaryBtn}>
            Fill Demo
          </button>
          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading ? "Requesting..." : "Send POST"}
          </button>
        </div>
      </form>

      {result && (
        <div style={styles.panels}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>Request Body</div>
            <pre style={styles.pre}>{JSON.stringify(result.request, null, 2)}</pre>
          </div>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              Response {result.ok ? "✅" : "❌"} (HTTP {result.status})
            </div>
            <pre style={styles.pre}>{safeStringify(result.data)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function safeStringify(v) {
  try {
    return typeof v === "string" ? v : JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

const styles = {
  wrap: { maxWidth: 760, margin: "32px auto", padding: 16, fontFamily: "system-ui, Arial" },
  h1: { margin: "0 0 16px" },
  form: { display: "grid", gap: 12, background: "#fafafa", padding: 16, borderRadius: 10, border: "1px solid #ddd" },
  row: { display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", gap: 8 },
  label: { fontSize: 14, color: "#333" },
  input: { padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", outline: "none" },
  actions: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 },
  primaryBtn: { padding: "10px 14px", borderRadius: 8, border: "1px solid #000", cursor: "pointer", background: "#000", color: "#fff" },
  secondaryBtn: { padding: "10px 14px", borderRadius: 8, border: "1px solid #aaa", cursor: "pointer", background: "#fff" },
  panels: { display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", marginTop: 16 },
  panel: { border: "1px solid #ddd", borderRadius: 10, overflow: "hidden", background: "#fff" },
  panelHeader: { padding: "10px 12px", borderBottom: "1px solid #eee", fontWeight: 600, background: "#f6f6f6" },
  pre: { margin: 0, padding: 12, fontSize: 13, lineHeight: 1.4, whiteSpace: "pre-wrap", wordBreak: "break-word" },
};
