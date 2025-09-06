// src/Components/ItineraryPost.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import PhoneMockup from "../Frame/PhoneMockup";
import { useTripFormState, buildBackendPayload } from "../store/TripFormContext";

import TopHeroImg from "../assets/venive_top.png";
import IcBookmark from "../assets/icons/check.png";
import IcShare from "../assets/icons/share.png";

import IcEdit from "../assets/icons/edit_green.png";
import IcDelete from "../assets/icons/trash_red.png";

import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

/* ✅ 도메인 확인 필요: two025(오타) vs 2025 */
const BASE = "https://two025-seasonthon-team-47-be.onrender.com";
const POST_URL = `${BASE}/api/itineraries/generate-and-save?userId=1`;
const GET_URL  = `${BASE}/api/users/itineraries/summaries/1`;

// StrictMode에서 재마운트 직후 중복 실행을 막기 위한 임시 키 (1~2초 유지)
const RUN_GUARD_KEY = "ItineraryPost__once";

export default function ItineraryPost() {
  const form = useTripFormState();
  const payload = useMemo(() => buildBackendPayload(form), [form]);

  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]); // [{title,startDate,endDate}]
  const [error, setError] = useState("");

  useEffect(() => {
    // 🔒 1) 세션 가드: StrictMode 재마운트 시 두 번째 실행 차단
    if (sessionStorage.getItem(RUN_GUARD_KEY) === "1") {
      return; // 이미 같은 탭/세션에서 바로 직전에 실행됨 → 중복 방지
    }
    sessionStorage.setItem(RUN_GUARD_KEY, "1");
    // 1~2초 후 자동 해제 → 라우팅으로 다시 들어오면 다시 실행 가능
    const guardTimer = setTimeout(() => {
      sessionStorage.removeItem(RUN_GUARD_KEY);
    }, 2000);

    let mounted = true;

    // 🛑 2) 언마운트 시 네트워크 즉시 취소(StrictMode 1차 마운트 요청 차단)
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        // 1) 생성 + 저장 (POST)
        const postRes = await axios.post(POST_URL, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
          timeout: 60000,
          validateStatus: () => true,
          signal: controller.signal, // ← 언마운트 시 즉시 abort
        });
        if (postRes.status < 200 || postRes.status >= 300) {
          console.warn("POST generate-and-save non-2xx:", postRes.status, postRes.data);
        }

        // 2) 요약 목록 조회 (GET)
        const getRes = await axios.get(GET_URL, {
          withCredentials: false,
          timeout: 30000,
          validateStatus: () => true,
          signal: controller.signal, // ← 언마운트 시 즉시 abort
        });

        if (!mounted) return;

        if (getRes.status >= 200 && getRes.status < 300) {
          const arr = normalizeSummaries(getRes.data);
          setSummaries(arr);
          if (arr.length === 0) {
            setError("목록이 비어 있습니다. (응답은 수신했지만 매핑 가능한 항목이 없음)");
          }
        } else {
          setSummaries([]);
          setError(`GET 실패 (HTTP ${getRes.status}) ${peek(getRes.data)}`);
        }
      } catch (e) {
        if (mounted) setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
      controller.abort();     // ← 첫 마운트 요청 즉시 취소 (중복 방지)
      clearTimeout(guardTimer);
      // ❗여기서 RUN_GUARD_KEY를 제거하지 않음 (StrictMode 두 번째 마운트 차단을 위해)
      // 위의 setTimeout으로 2초 뒤 자동 해제됨
    };
  }, [payload]);

  const list = summaries.length === 0
    ? [{ title: "", startDate: "", endDate: "", __placeholder: true }]
    : summaries;

  return (
    <Stage>
      <PhoneMockup width={375} height={851} bgColor="transparent" borderColor="#000" strokeWidth={1} radius={36} notch>
        <Screen>
          <TopHero aria-label="top-hero" />

          <HeadingWrap>
            <Heading>나의 일정</Heading>
            <Divider />
          </HeadingWrap>

          <ListArea>
            {list.map((item, idx) => (
              <Card key={idx}>
                <Bookmark src={IcBookmark} alt="bookmark" />
                <CardBody>
                  <CardTitle data-empty={!item.title}>
                    {item.title || (loading ? "로딩 중…" : "제목 없음")}
                  </CardTitle>
                  <CardDates data-empty={!item.startDate && !item.endDate}>
                    {fmt(item?.startDate)}{item?.startDate ? " ~ " : ""}{fmt(item?.endDate)}
                  </CardDates>
                </CardBody>
                <CardActions aria-label="actions">
                  <IconBtn title="공유"><SmallIcon src={IcShare} alt="share" /></IconBtn>
                  <IconBtn title="수정"><SmallIcon src={IcEdit} alt="edit" /></IconBtn>
                  <IconBtn title="삭제"><SmallIcon src={IcDelete} alt="delete" /></IconBtn>
                </CardActions>
              </Card>
            ))}

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
  );
}

/* ====== 유틸 ====== */
function normalizeSummaries(raw) {
  if (Array.isArray(raw)) return raw.map(mapItem);
  const keys = ["data", "result", "results", "items", "itineraries", "content", "list"];
  for (const k of keys) {
    if (Array.isArray(raw?.[k])) return raw[k].map(mapItem);
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const candidate = mapItem(raw);
    if (candidate.title || candidate.startDate || candidate.endDate) return [candidate];
  }
  return [];
}

function mapItem(it = {}) {
  const title = it.title ?? it.tripTitle ?? it.name ?? it.summaryTitle ?? it.planTitle ?? "";
  const startDate = it.startDate ?? it.start_date ?? it.from ?? it.start ?? it.beginDate ?? "";
  const endDate = it.endDate ?? it.end_date ?? it.to ?? it.end ?? it.finishDate ?? "";
  return { title, startDate, endDate };
}

function fmt(s) {
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
  background: url(${TopHeroImg}) no-repeat;
`;
const HeadingWrap = styled.div` margin-top: 17px; padding: 0 16px; `;
const Heading = styled.h2`
  margin: 0;
  color: #000;
  font-family: "Do Hyeon", system-ui;
  font-size: 40px;
  font-weight: 400;
  text-align: center;
`;
const Divider = styled.div` margin: 8px auto 0; width: calc(100% - 32px); height: 1px; background: rgba(0,0,0,0.2); `;
const ListArea = styled.div` margin-top: 51px; padding: 0 16px; `;
const Card = styled.div`
  position: relative;
  width: 322px;
  height: 150px;
  border-radius: 10px;
  border: 3px solid #BFBFBF;
  background: #FFF;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.25);
  margin: 14px auto;
  padding: 16px 14px 10px;
  display: flex; flex-direction: column; justify-content: space-between;
`;
const Bookmark = styled.img` position: absolute; top: -2px; right: 10px; width: 25px; height: 32px; `;
const CardBody = styled.div``;
const CardTitle = styled.div`
  color: #000;
  font-family: "Do Hyeon", system-ui;
  font-size: 30px; font-weight: 400;
  &[data-empty="true"] {
    color: transparent;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
    background-size: 400% 100%;
    border-radius: 6px; height: 32px;
    animation: shimmer 1.4s ease infinite;
  }
`;
const CardDates = styled.div`
  margin-top: 6px; color: #6A6A6A;
  font-family: "ADLaM Display", system-ui; font-size: 15px;
  &[data-empty="true"] {
    color: transparent;
    background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
    background-size: 400% 100%;
    border-radius: 4px; height: 18px; width: 70%;
    animation: shimmer 1.4s ease infinite;
  }
  @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
`;
const CardActions = styled.div` display: flex; gap: 10px; justify-content: flex-end; align-items: center; `;
const IconBtn = styled.button` border: 0; background: transparent; padding: 0; cursor: pointer; `;
const SmallIcon = styled.img` width: 20px; height: 20px; display: block; `;
const ErrorHint = styled.div` margin-top: 8px; text-align: center; color: #d00; font-size: 13px; `;
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
const NavIcon = styled.img` width: 22px; height: 22px; opacity: 0.8; `;
