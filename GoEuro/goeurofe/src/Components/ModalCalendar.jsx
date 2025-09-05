// src/Components/CalendarModal.jsx
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";

export default function CalendarModal({
  open,
  range,
  nights,
  today,
  disabled,
  hoverRange,
  onSelect,
  onHoverEnter,
  onHoverLeave,
  onClear,
  onClose,
}) {
  if (!open) return null;

  return (
    <Backdrop onClick={(e) => e.target === e.currentTarget && onClose()}>
      <GlobalStyle />
      <Panel role="dialog" aria-modal="true" aria-label="여행 기간 선택">
        <Head>
          <h3>여행 기간 선택</h3>
          <HeadActions>
            <TextBtn type="button" onClick={onClear}>지우기</TextBtn>
            <CloseBtn type="button" onClick={onClose}>닫기</CloseBtn>
          </HeadActions>
        </Head>

        <PickerWrap>
          <DayPicker
            mode="range"
            numberOfMonths={1}
            locale={ko}
            selected={range}
            onSelect={onSelect}
            onDayMouseEnter={onHoverEnter}
            onDayMouseLeave={onHoverLeave}
            disabled={disabled}
            defaultMonth={range?.from || today}
            showOutsideDays
            modifiers={{
              hoverRange: hoverRange
                ? { from: hoverRange.from, to: hoverRange.to }
                : undefined,
            }}
            modifiersClassNames={{
              selected: "selected",
              range_start: "range_start",
              range_end: "range_end",
              range_middle: "range_middle",
              hoverRange: "hover_range",
              today: "today",
              disabled: "disabled",
            }}
          />
        </PickerWrap>

        <Foot>
          {range?.from && range?.to ? (
            <>
              <strong>
                {fmt(range.from)} ~ {fmt(range.to)} · {nights}박 {nights + 1}일
              </strong>
              <ApplyBtn type="button" onClick={onClose}>확인</ApplyBtn>
            </>
          ) : (
            <em>시작일과 종료일을 선택하세요</em>
          )}
        </Foot>
      </Panel>
    </Backdrop>
  );
}

/* ===== local utils ===== */
function fmt(d) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/* ===== styles ===== */
const GlobalStyle = createGlobalStyle`
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #1a73e8;
    --rdp-background-color: #eaf4ff;
  }

  .rdp-caption_label { font-weight: 700; font-size: 15px; }
  .rdp-head_cell { font-weight: 600; color: #666; font-size: 11px; }
  .rdp-day { border-radius: 10px; font-weight: 600; }
  .rdp-day:where([disabled]) { color: #bbb; }
  .rdp-day_today:not(.selected) { box-shadow: inset 0 0 0 2px rgba(0,0,0,.08); }

  .range_middle:not(.range_start):not(.range_end),
  .rdp-day.range_middle { background: #eaf4ff; color: #111; border-radius: 0; }
  .hover_range:not(.selected):not(.range_start):not(.range_end) { background: #f2f7ff; border-radius: 0; }
  .range_start, .range_end { background: #d8ebff; color: #111; }
  .range_start { border-top-left-radius: 999px; border-bottom-left-radius: 999px; }
  .range_end { border-top-right-radius: 999px; border-bottom-right-radius: 999px; }
  .range_start.range_end { border-radius: 999px !important; }
  .selected { background: #d8ebff; color: #111; }
  .rdp-day:hover { background: #f6f9ff; }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,.45);
`;

const Panel = styled.div`
  width: 360px;
  max-width: calc(100% - 32px);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 20px 40px rgba(0,0,0,.24);
  padding: 14px 14px 10px;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  h3 { margin: 0; font-size: 16px; }
`;
const HeadActions = styled.div` display: flex; gap: 6px; align-items: center; `;
const TextBtn = styled.button` background: none; border: none; color: #1a73e8; font-weight: 700; cursor: pointer; `;
const CloseBtn = styled.button` border: 1px solid #d0d7de; background: #fff; border-radius: 8px; padding: 6px 10px; cursor: pointer; `;
const ApplyBtn = styled.button` margin-left: 8px; padding: 6px 12px; border-radius: 8px; background: #1a73e8; color: #fff; border: 0; font-weight: 700; `;
const PickerWrap = styled.div` border-radius: 14px; background: #fff; `;
const Foot = styled.div` margin-top: 6px; text-align: center; font-size: 13px; color: #333; `;
