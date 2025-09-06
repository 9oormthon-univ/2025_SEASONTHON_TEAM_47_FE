// src/Components/LoginScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";

// 하단 네비 아이콘 (변경 금지)
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

/* Google Font: ADLaM Display */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=ADLaM+Display&display=swap');
  :root {
    --font-main: 'ADLaM Display', system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', sans-serif;
  }
`;

/** 샘플 데이터 (백엔드 연결 전 임시 확인용)
 *  실제에선 <LoginScreen apiUrl="https://your.api/trip?..." /> 또는
 *  <LoginScreen initialData={백엔드에서 받은객체}/> 형태로 사용
 */
const SAMPLE = {
  city: "Rome",
  days: 5,
  currency: "EUR",
  plan: [
    {
      day: 1,
      stops: [
        {
          name: "Colosseum",
          category: "history",
          time: "09:00-11:00",
          address: "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
          lat: 41.8902,
          lng: 12.4922,
          note:
            "Start your Ancient Rome journey. Book tickets online well in advance to skip lines. Consider a guided tour for deeper insights.",
        },
        {
          name: "Roman Forum & Palatine Hill",
          category: "history",
          time: "11:00-13:30",
          address: "Largo della Salara Vecchia, 5/6, 00186 Roma RM, Italy",
          lat: 41.8923,
          lng: 12.4851,
          note:
            "Your Colosseum ticket often includes access. Wander through the ruins of ancient Rome's political and social center. Wear comfortable shoes.",
        },
        {
          name: "Lunch at Urbana 47",
          category: "food",
          time: "13:30-14:30",
          address: "Via Urbana, 47, 00184 Roma RM, Italy",
          lat: 41.8953,
          lng: 12.4893,
          note:
            "Enjoy organic, local Roman cuisine in a modern setting, a short walk from the Forum.",
        },
        {
          name: "Capitoline Museums",
          category: "museum",
          time: "14:45-17:30",
          address: "Piazza del Campidoglio, 1, 00186 Roma RM, Italy",
          lat: 41.8934,
          lng: 12.4828,
          note:
            "Housing a vast collection of ancient Roman art and artifacts. Located on Michelangelo's beautiful Piazza del Campidoglio.",
        },
        {
          name: "Dinner in Monti",
          category: "food",
          time: "19:30-21:00",
          address: "Via dei Serpenti, 122, 00184 Roma RM, Italy",
          lat: 41.897,
          lng: 12.4877,
          note:
            "Explore the charming Monti district for dinner. Try 'La Carbonara' for traditional Roman pasta dishes.",
        },
      ],
    },
    // ... 필요 시 day 2~N도 이어서
  ],
  tips: ["Skip-the-line 티켓 미리 예매하기", "편한 신발 필수", "성지 방문 시 복장 규정 유의"],
};

export default function LoginScreen({ apiUrl, initialData }) {
  const [data, setData] = useState(initialData || null);
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(Boolean(apiUrl) && !initialData);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!apiUrl || initialData) return;
      try {
        setLoading(true);
        setError("");
        const res = await fetch(apiUrl, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (e) {
        if (!ignore) {
          setError("일정을 불러오지 못했어요. SAMPLE 데이터로 표시합니다.");
          setData(SAMPLE);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [apiUrl, initialData]);

  // 데이터 없으면 샘플 사용
  const itinerary = useMemo(() => data || SAMPLE, [data]);

  // 유효한 day 목록 정렬
  const dayList = useMemo(() => {
    const list = (itinerary?.plan || [])
      .map((d) => d?.day)
      .filter((n) => Number.isFinite(n));
    const uniqueSorted = [...new Set(list)].sort((a, b) => a - b);
    return uniqueSorted.length ? uniqueSorted : [1];
  }, [itinerary]);

  // activeDay가 무효면 1일차로 보정
  useEffect(() => {
    if (!dayList.includes(activeDay)) setActiveDay(dayList[0]);
  }, [dayList, activeDay]);

  const current = useMemo(
    () => (itinerary?.plan || []).find((d) => d.day === activeDay),
    [itinerary, activeDay]
  );

  return (
    <Stage>
      <GlobalStyle />
      <PhoneMockup
        width={375}
        height={851}
        radius="36px"
        notch
        notchTheme="dark"
        showSpeaker
        showCamera
        wrapOnly={false}
        safePadding="56px 16px 84px"
        bgColor="#F3F4F6"
        contentPointer
      >
        <Screen>
          <Card>
            <CardBody>
              <Header>{itinerary?.city ? `${itinerary.city} 여행 일정` : "여행 일정"}</Header>

              {/* 가로 스크롤 Day 탭 */}
              <DayTabs role="tablist" aria-label="여행 일차 선택">
                {dayList.map((d) => (
                  <DayTab
                    key={d}
                    role="tab"
                    aria-selected={activeDay === d}
                    $active={activeDay === d}
                    onClick={() => setActiveDay(d)}
                  >
                    {d}일차
                  </DayTab>
                ))}
              </DayTabs>

              {/* 상태 영역 */}
              {loading && <StatusMsg>불러오는 중…</StatusMsg>}
              {error && <WarnMsg>{error}</WarnMsg>}

              {/* 선택된 일차의 상세 */}
              <ContentArea role="region" aria-live="polite">
                {current?.stops?.length ? (
                  current.stops.map((s, idx) => (
                    <StopCard key={idx}>
                      <StopHeader>
                        <StopTime>{s.time || "-"}</StopTime>
                        {s.category ? <Badge>{s.category}</Badge> : null}
                      </StopHeader>
                      <StopTitle>{s.name}</StopTitle>
                      {s.address ? <StopAddr>{s.address}</StopAddr> : null}
                      {s.note ? <StopNote>{s.note}</StopNote> : null}
                      {(Number.isFinite(s.lat) && Number.isFinite(s.lng)) ? (
                        <MapRow>
                          <MapLink
                            href={`https://maps.google.com/?q=${encodeURIComponent(
                              `${s.lat},${s.lng}`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            지도에서 보기
                          </MapLink>
                        </MapRow>
                      ) : null}
                    </StopCard>
                  ))
                ) : (
                  <Empty>선택한 일차에 등록된 일정이 없어요.</Empty>
                )}

                {/* 팁 섹션 */}
                {Array.isArray(itinerary?.tips) && itinerary.tips.length > 0 && (
                  <TipsBox>
                    <TipsTitle>여행 팁</TipsTitle>
                    <TipsList>
                      {itinerary.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </TipsList>
                  </TipsBox>
                )}
              </ContentArea>
            </CardBody>
          </Card>
        </Screen>

        {/* 하단 네비 (그대로) */}
        <BottomNav>
          <NavBtn><Icon src={IconHome} alt="Home" /></NavBtn>
          <NavBtn><Icon src={IconCalendar} alt="Calendar" /></NavBtn>
          <NavBtn><Icon src={IconProfile} alt="Profile" /></NavBtn>
        </BottomNav>
      </PhoneMockup>
    </Stage>
  );
}

/* ================= styled ================= */

const Stage = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #f5f5f7;
`;

const Screen = styled.div`
margin-top:250px;
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
`;

/* ✅ 흰색 박스 규격 고정: 352 x 749, radius:10px */
const Card = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 352px;
  height: 749px;
  border-radius: 10px;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const CardBody = styled.div`
  width: 100%;
  height: 100%;
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.h1`
  margin: 0 0 10px;
  text-align: center;
  font-family: var(--font-main);
  color: #000;
  font-size: 30px;          /* 요청: 30px */
  font-weight: 400;         /* 요청: 400 */
  line-height: normal;
`;

/* === Day Tabs (가로 스크롤) === */
const DayTabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 6px 2px 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
`;

const DayTab = styled.button`
  flex: 0 0 auto;
  min-width: 74px;
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid ${({ $active }) => ($active ? "#000" : "#D9D9D9")};
  background: ${({ $active }) => ($active ? "#AEFF5D" : "#FAFAFA")};
  box-shadow: ${({ $active }) =>
    $active ? "2px 2px 4px rgba(0,0,0,0.25)" : "inset 2px 2px 4px rgba(0,0,0,0.12)"};
  cursor: pointer;

  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
`;

/* === 콘텐츠 영역 (스크롤) === */
const ContentArea = styled.div`
  margin-top: 8px;
  flex: 1 1 auto;
  overflow: auto;
  padding-right: 4px; /* 스크롤바 여백 */
`;

/* === 스탑 카드 === */
const StopCard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  & + & { margin-top: 10px; }
`;

const StopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StopTime = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  color: #111;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px 8px;
`;

const Badge = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: #2c2c2c;
  background: #c9ff94;
  border: 1px solid #a7ef61;
  border-radius: 8px;
  padding: 3px 8px;
`;

const StopTitle = styled.h3`
  margin: 8px 0 4px;
  font-size: 18px;
  font-weight: 800;
  color: #000;
  text-align: left; /* 텍스트는 왼쪽 정렬 */
`;

const StopAddr = styled.p`
  margin: 0 0 6px;
  font-size: 13px;
  color: #444;
  text-align: left;
  word-break: keep-all;
`;

const StopNote = styled.p`
  margin: 0;
  font-size: 13px;
  color: #222;
  line-height: 1.5;
  text-align: left;
  white-space: pre-wrap;
`;

const MapRow = styled.div`
  margin-top: 8px;
`;

const MapLink = styled.a`
  font-size: 13px;
  text-decoration: underline;
  color: #0070f3;
`;

/* === 팁 === */
const TipsBox = styled.div`
  margin-top: 12px;
  border-radius: 12px;
  border: 1px dashed #cdd0d5;
  background: #fbfeff;
  padding: 12px;
`;

const TipsTitle = styled.h4`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 800;
`;

const TipsList = styled.ul`
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.6;
  li + li { margin-top: 2px; }
`;

/* === 상태/경고 === */
const StatusMsg = styled.div`
  margin: 12px 0 6px;
  font-size: 14px;
  color: #333;
`;

const WarnMsg = styled.div`
  margin: 2px 0 8px;
  font-size: 13px;
  color: #b00020;
`;

/* === 하단 네비 (그대로) === */
const BottomNav = styled.nav`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  background: #fff;
  border-top: 1px solid rgba(0,0,0,0.08);

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;

  padding: 10px 28px calc(10px + env(safe-area-inset-bottom));
  min-height: 58px;
`;
const Empty = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
`;

const NavBtn = styled.button`
  background: none;
  border: 0;
  padding: 6px 0;
`;

const Icon = styled.img`
  width: 26px;
  height: auto;
  object-fit: contain;
`;
