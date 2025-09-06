// src/components/ItineraryTester.jsx
import React, { useState } from "react";
import axios from "axios";

const API_URL =
  "https://two025-seasonthon-team-47-be.onrender.com/api/itineraries/generate-and-save?userId=1";

export default function ItineraryTester() {
  const [payload, setPayload] = useState({
  "start": "서울",
  "end": "강릉",
  "days": 2,
  "startDate": "2025-10-03",
  "endDate": "2025-10-04",
  "purpose": "null",
  "theme": "null",
  "party": "null",
  "flightInfo": "null",
  "accommodationInfo": "null",
  "preferInfo": "null"
});

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok, status, data }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
        timeout: 60000, // 콜드스타트/지연 대비
        validateStatus: () => true,
      });
      setResult({
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        data: res.data,
      });
    } catch (err) {
      setResult({
        ok: false,
        status: err.response?.status ?? 0,
        data: err.response?.data ?? String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Itinerary API Tester</h1>

      <form onSubmit={onSubmit} style={styles.form}>
        <pre style={styles.pre}>{JSON.stringify(payload, null, 2)}</pre>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading ? "Requesting..." : "Send POST"}
          </button>
        </div>
      </form>

      {result && (
        <div style={styles.panels}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              Response {result.ok ? "✅" : "❌"} (HTTP {result.status})
            </div>
            <pre style={styles.pre}>
              {typeof result.data === "string"
                ? result.data
                : JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 760, margin: "32px auto", padding: 16, fontFamily: "system-ui, Arial" },
  h1: { margin: "0 0 16px" },
  form: { display: "grid", gap: 12, background: "#fafafa", padding: 16, borderRadius: 10, border: "1px solid #ddd" },
  pre: { margin: 0, padding: 12, fontSize: 13, lineHeight: 1.4, background: "#fff", border: "1px solid #eee", borderRadius: 8 },
  panels: { display: "grid", gap: 12, gridTemplateColumns: "1fr", marginTop: 16 },
  panel: { border: "1px solid #ddd", borderRadius: 10, overflow: "hidden", background: "#fff" },
  panelHeader: { padding: "10px 12px", borderBottom: "1px solid #eee", fontWeight: 600, background: "#f6f6f6" },
};
