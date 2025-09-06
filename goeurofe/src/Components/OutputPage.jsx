// src/pages/OutputPage.jsx
import React from "react";
import { useTripFormState } from "../store/TripFormContext";

export default function OutputPage() {
  const form = useTripFormState();

  const Item = ({ label, value }) => (
    <div style={{
      padding: "12px 14px",
      borderRadius: 10,
      border: "1px solid #eaeaea",
      background: "#fff"
    }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{value ?? "-"}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: "28px auto", padding: "0 16px" }}>
      <h2 style={{ margin: "0 0 12px" }}>Output Page</h2>
      <p style={{ margin: "0 0 20px", color: "#555" }}>
        지금까지 모아둔 입력값을 확인하세요.
      </p>

      {/* 주요 필드 카드형 요약 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
        marginBottom: 20
      }}>
        <Item label="출발지 (departure)" value={form.departure} />
        <Item label="도착지 (arrival)" value={form.arrival} />
        <Item label="여행일수 (date)" value={form.date || (form.startDay && form.endDay ? "-" : 0)} />
        <Item label="시작일 (startDay)" value={form.startDay} />
        <Item label="종료일 (endDay)" value={form.endDay} />
        <Item label="여행 목적 (purpose)" value={form.purpose} />
        <Item label="테마 (tema)" value={form.tema} />
        <Item label="동행 (people)" value={form.people} />
      </div>

      {/* 전체 원본 JSON */}
      <div style={{
        border: "1px solid #eaeaea",
        borderRadius: 10,
        background: "#f8f9fb",
        padding: 12
      }}>
        <div style={{ fontSize: 12, color: "#777", marginBottom: 6 }}>Raw JSON</div>
        <pre style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: 13,
          lineHeight: 1.5
        }}>
{JSON.stringify(form, null, 2)}
        </pre>
      </div>
    </div>
  );
}
