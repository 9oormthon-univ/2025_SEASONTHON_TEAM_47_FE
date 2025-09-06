// src/Components/ItineraryPost.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneMockup from "../Frame/PhoneMockup";

import TopHeroImg from "../assets/venive_top.png";
import IcBookmark from "../assets/icons/check.png";
import IcShare from "../assets/icons/share.png";
import IcEdit from "../assets/icons/edit_green.png";
import IcDelete from "../assets/icons/trash_red.png";

import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

/* ✅ 도메인(two025) + URL 그대로 사용 */
const BASE = "https://two025-seasonthon-team-47-be.onrender.com";
const GET_URL  = `${BASE}/api/users/itineraries/summaries/1`;

export default function ItineraryPost() {
  const bootRef = useRef(false); // React 18 StrictMode 중복 GET 방지
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]); // [{title,startDate,endDate}]
  const [error, setError] = useState("");

  const fetchSummaries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(GET_URL, {
        withCredentials: false,
        timeout: 30000,
        validateStatus: () => true,
      });

      if (res.status >= 200 && res.status < 300) {
        const arr = normalizeSummaries(res.data);
        setSummaries(arr);
        if (arr.length === 0) {
          setError("목록이 비어 있습니다. (응답은 수신했지만 매핑 가능한 항목이 없음)");
        }
      } else {
        setSummaries([]);
        setError(`GET 실패 (HTTP ${res.status}) ${peek(res.data)}`);
      }
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bootRef.current) return; // 개발모드 중복 방지
    bootRef.current = true;
    fetchSummaries(); // 진입 시 1회 GET
  }, []);

  const list = summaries.length === 0
    ? [{ title: "", startDate: "", endDate: "", __placeholder: true }]
    : summaries;

  // ✅ "생성된 버튼(열기)"을 누르면 resultpage1 로 이동
  const goResultPage1 = () => {
    // 필요 시 ID/쿼리 파라미터를 붙일 수 있음: navigate(`/resultpage1?itineraryId=${someId}`)
    navigate("/resultpage1");
  };

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
            <ReloadRow>
              <ReloadBtn onClick={fetchSummaries} disabled={loading}>
                {loading ? "불러오는 중…" : "다시 불러오기"}
              </ReloadBtn>
            </ReloadRow>

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
                  {/* ✅ 생성된 버튼: resultpage1로 이동 */}
                  <OpenBtn onClick={goResultPage1} disabled={!!item.__placeholder}>
                    열기
                  </OpenBtn>

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
`;
const Divider = styled.div` margin: 8px auto 0; width: calc(100% - 32px); height: 1px; background: rgba(0,0,0,0.2); `;
const ListArea = styled.div` margin-top: 28px; padding: 0 16px; `;

const ReloadRow = styled.div`
  display: grid; place-items: center;
  margin-bottom: 10px;
`;
const ReloadBtn = styled.button`
  border: 1px solid #ddd; border-radius: 8px;
  background: #fff; padding: 6px 10px; cursor: pointer;
  font-size: 12px;
`;

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

/* ✅ 생성된 버튼 스타일 */
const OpenBtn = styled.button`
  border: 1px solid #FFD54F;
  background: #FFEB3B;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-right: auto; /* 왼쪽으로 붙여 액션아이콘과 간격 확보 */
  &:disabled { opacity: .6; cursor: not-allowed; }
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
