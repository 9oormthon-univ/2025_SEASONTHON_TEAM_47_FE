// src/Components/ItineraryDays.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneMockup from "../Frame/PhoneMockup";

import TopHeroImg from "../assets/venive_top.png";
import IcBookmark from "../assets/icons/check.png";
import IcShare from "../assets/icons/share.png";
import IcEdit from "../assets/icons/edit_green.png";
import IcDelete from "../assets/icons/trash_red.png";

import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

/* ===== 서버 URL ===== */
const BASE = "https://two025-seasonthon-team-47-be.onrender.com";
const daysURL = (itineraryId) => `${BASE}/api/itineraries/${itineraryId}/days`;

/* 세션 키 (다음 API 호출 때 다시 사용할 ID들을 보관) */
const SS_LAST_ITINERARY_ID = "last_itinerary_id";
const SS_LAST_DAY_IDS = "last_day_ids"; // JSON array

const Global = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap');
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function ItineraryDays() {
  const bootRef = useRef(false); // React 18 개발모드 중복 방지
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1) itineraryId 우선순위: URL 쿼리 → 세션 → 기본값 "1"
  const qItinId = searchParams.get("itineraryId");
  const initialItineraryId = useMemo(() => {
    if (qItinId && !Number.isNaN(Number(qItinId))) return String(qItinId);
    const ss = sessionStorage.getItem(SS_LAST_ITINERARY_ID);
    return ss || "1";
  }, [qItinId]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itineraryId, setItineraryId] = useState(initialItineraryId);
  const [city, setCity] = useState("");
  const [days, setDays] = useState([]); // [{ day_id, planned_date }]

  const fetchDays = async (id) => {
    if (!id) {
      setError("itineraryId가 없습니다. URL에 ?itineraryId=숫자 를 추가하거나 이전 단계에서 세션 저장을 확인하세요.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const url = daysURL(id);
      const res = await axios.get(url, {
        withCredentials: false,
        timeout: 30000,
        validateStatus: () => true,
      });

      if (res.status >= 200 && res.status < 300) {
        const data = res.data || {};
        // 기대 스키마:
        // { itinerary_id: number, city: "string", days: [ { day_id: number, planned_date: "YYYY-MM-DD" } ] }
        const itinId = String(data.itinerary_id ?? id);
        const c = data.city ?? "";
        const arr = Array.isArray(data.days) ? data.days : [];

        setItineraryId(itinId);
        setCity(c);
        setDays(arr);

        // ✅ 다음 API용으로 보관
        try {
          sessionStorage.setItem(SS_LAST_ITINERARY_ID, itinId);
          sessionStorage.setItem(SS_LAST_DAY_IDS, JSON.stringify(arr.map(d => d.day_id)));
        } catch {}

        if (arr.length === 0) {
          setError("일차 목록이 비어 있습니다.");
        }
      } else {
        setError(`GET 실패 (HTTP ${res.status}) ${peek(res.data)}`);
        setDays([]);
      }
    } catch (e) {
      setError(String(e?.message || e));
      setDays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    fetchDays(initialItineraryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialItineraryId]);

  // 🔘 퀵버튼: itineraryId를 20으로 고정 세팅하고 즉시 다시 불러오기
  const forceLoadTwenty = () => {
    setItineraryId("20");
    sessionStorage.setItem(SS_LAST_ITINERARY_ID, "20");
    fetchDays("20");
  };

  // ✅ "여행 일정" 클릭 시 resultpage2로 이동
  const goResultPage2 = () => {
    // 필요하면 itineraryId를 쿼리로 넘겨도 됨: `/resultpage2?itineraryId=${itineraryId}`
    navigate("/resultpage2");
  };

  return (
    <>
      <Global />
      <Stage>
        <PhoneMockup
          width={375}
          height={851}
          bgColor="transparent"
          borderColor="#000"
          strokeWidth={1}
          radius={36}
          notch
        >
          <Screen>
            <TopHero aria-label="top-hero" />

            <HeadingWrap>
              <Heading
                role="button"
                tabIndex={0}
                onClick={goResultPage2}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goResultPage2()}
                title="결과 페이지로 이동"
              >
                여행 일정
              </Heading>
              <Divider />
            </HeadingWrap>

            {/* ⛔ 요청: '다시 불러오기' 버튼 제거 */}
            <Controls>
              <ItinIdBox>
                <span className="label">itinerary_id</span>
                <span className="value">{itineraryId || "-"}</span>
              </ItinIdBox>

              {/* 필요 시 유지: ID=20 로드 버튼 */}
              <ForceBtn onClick={forceLoadTwenty} disabled={loading}>
                ID=20로 불러오기
              </ForceBtn>
            </Controls>

            <ListArea>
              {days.map((d, idx) => (
                <DayCard key={d.day_id ?? idx}>
                  <DayHeader>
                    <DayTitle>{idx + 1}일차</DayTitle>
                    <Bookmark src={IcBookmark} alt="bookmark" />
                  </DayHeader>

                  <DayBody>
                    <City>{city}</City>
                    <PlannedDate>{fmtDate(d.planned_date)}</PlannedDate>
                  </DayBody>

                  <CardActions aria-label="actions">
                    <MetaRow>
                      <Meta>
                        <MetaKey>day_id</MetaKey>
                        <MetaVal>{d.day_id}</MetaVal>
                      </Meta>
                      <Meta>
                        <MetaKey>itinerary_id</MetaKey>
                        <MetaVal>{itineraryId}</MetaVal>
                      </Meta>
                    </MetaRow>

                    <ActionButtons>
                      <IconBtn title="공유"><SmallIcon src={IcShare} alt="share" /></IconBtn>
                      <IconBtn title="수정"><SmallIcon src={IcEdit} alt="edit" /></IconBtn>
                      <IconBtn title="삭제"><SmallIcon src={IcDelete} alt="delete" /></IconBtn>
                    </ActionButtons>
                  </CardActions>
                </DayCard>
              ))}

              {/* 스켈레톤 / 에러 */}
              {loading && days.length === 0 && (
                <DayCard>
                  <DayHeader>
                    <DayTitle data-empty="true">로딩</DayTitle>
                  </DayHeader>
                  <DayBody>
                    <City data-empty="true">로딩</City>
                    <PlannedDate data-empty="true">로딩</PlannedDate>
                  </DayBody>
                </DayCard>
              )}

              {error && <ErrorHint>오류: {error}</ErrorHint>}
            </ListArea>

            <BottomNav role="navigation" aria-label="Main">
              <NavBtn className="active" aria-label="Home"><NavIcon src={IconHome} alt="Home" /></NavBtn>
              <NavBtn aria-label="Calendar"><NavIcon src={IconCalendar} alt="Calendar" /></NavBtn>
              <NavBtn aria-label="Profile"><NavIcon src={IconProfile} alt="Profile" /></NavBtn>
            </BottomNav>
          </Screen>
        </PhoneMockup>
      </Stage>
    </>
  );
}

/* ===== 유틸 ===== */
function fmtDate(s) {
  if (!s) return "";
  const m = String(s).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return String(s);
}
function peek(v, max = 200) {
  try {
    const s = typeof v === "string" ? v : JSON.stringify(v);
    return s.length > max ? s.slice(0, max) + "..." : s;
  } catch {
    return String(v);
  }
}

/* ===== 스타일 ===== */
const Stage = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #f5f5f7;
`;
const Screen = styled.section`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  padding-bottom: 90px;
`;
const TopHero = styled.div`
  width: 412px;
  height: 123px;
  flex-shrink: 0;
  margin: 0 auto;
  background: url(${TopHeroImg}) lightgray -0.037px -190.274px / 100% 418.699% no-repeat;
`;

const HeadingWrap = styled.div` margin-top: 17px; padding: 0 16px; `;
const Heading = styled.h2`
  margin: 0;
  color: #000;
  font-family: "Do Hyeon", system-ui;
  font-size: 40px;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  user-select: none;
  &:active { opacity: .7; }
`;
const Divider = styled.div`
  margin: 8px auto 0;
  width: calc(100% - 32px);
  height: 1px;
  background: rgba(0,0,0,0.2);
`;

const Controls = styled.div`
  padding: 10px 16px 0;
  display: flex; gap: 8px; align-items: center; justify-content: center;
  flex-wrap: wrap;
`;
const ItinIdBox = styled.div`
  display: inline-flex; gap: 6px; align-items: baseline;
  .label { font-size: 12px; color: #666; }
  .value { font-size: 14px; font-weight: 600; color: #111; }
`;
const ForceBtn = styled.button`
  border: 1px solid #aaa; border-radius: 8px;
  background: #f7f7f7; padding: 6px 10px; cursor: pointer;
  font-size: 12px;
`;

const ListArea = styled.div`
  margin-top: 16px;
  padding: 0 16px 80px;
`;

const DayCard = styled.div`
  position: relative;
  width: 322px;
  min-height: 120px;
  border-radius: 10px;
  border: 3px solid #BFBFBF;
  background: #FFF;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.25);
  margin: 12px auto;
  padding: 14px;
  display: grid; grid-template-rows: auto 1fr auto; row-gap: 8px;
`;

const DayHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;
const DayTitle = styled.div`
  color: #000;
  font-family: "Do Hyeon", system-ui;
  font-size: 28px;
  font-weight: 400;

  &[data-empty="true"]{
    color: transparent;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
    background-size: 400% 100%;
    border-radius: 6px; height: 28px; width: 120px;
    animation: shimmer 1.4s ease infinite;
  }
`;
const Bookmark = styled.img`
  width: 22px; height: 28px;
`;

const DayBody = styled.div`
  display: grid; row-gap: 4px;
`;
const City = styled.div`
  color: #000;
  font-family: "Do Hyeon", system-ui;
  font-size: 22px;
  font-weight: 400;

  &[data-empty="true"]{
    color: transparent;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
    background-size: 400% 100%;
    border-radius: 6px; height: 22px; width: 60%;
    animation: shimmer 1.4s ease infinite;
  }
`;

const PlannedDate = styled.div`
  color: #6A6A6A;
  font-family: "Do Hyeon", system-ui;
  font-size: 14px; /* 작은 글씨 */
  font-weight: 400;

  &[data-empty="true"]{
    color: transparent;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
    background-size: 400% 100%;
    border-radius: 4px; height: 16px; width: 40%;
    animation: shimmer 1.4s ease infinite;
  }
`;

const CardActions = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 6px;
`;
const MetaRow = styled.div`
  display: flex; gap: 12px; align-items: center;
`;
const Meta = styled.div`
  display: grid; grid-template-columns: auto auto; column-gap: 6px; align-items: baseline;
`;
const MetaKey = styled.span`
  font-size: 12px; color: #888;
`;
const MetaVal = styled.span`
  font-size: 13px; color: #333; font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex; gap: 10px; align-items: center;
`;
const IconBtn = styled.button`
  border: 0; background: transparent; padding: 0; cursor: pointer;
`;
const SmallIcon = styled.img`
  width: 20px; height: 20px; display: block;
`;

const ErrorHint = styled.div`
  margin-top: 8px; text-align: center; color: #d00; font-size: 13px;
`;

const BottomNav = styled.nav`
  position: absolute; left: 0; right: 0; bottom: 0; background: #fff;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: grid; grid-template-columns: repeat(3, 1fr);
  align-items: center; justify-items: center;
  padding: 10px 28px calc(10px + env(safe-area-inset-bottom));
  min-height: 58px;
`;
const NavBtn = styled.button`
  width: 56px; height: 40px; border: 1.5px solid #e5e5e5; border-radius: 10px;
  background: #fff; display: grid; place-items: center; cursor: pointer;
`;
const NavIcon = styled.img`
  width: 22px; height: 22px; opacity: 0.8;
`;
