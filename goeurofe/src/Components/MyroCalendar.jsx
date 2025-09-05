// src/Components/MyroCalendar.jsx
import React, { useMemo, useState,  } from "react";
import styled from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";
import ModalCalendar from "../Components/ModalCalendar";

/* === 아이콘들 === */
// 목적 (3)
import icPurpose1 from "../assets/icons/purpose-1.png";
import icPurpose2 from "../assets/icons/purpose-2.png";
import icPurpose3 from "../assets/icons/purpose-3.png";
// 일행 (3)
import icCompanion1 from "../assets/icons/companion-1.png";
import icCompanion2 from "../assets/icons/companion-2.png";
import icCompanion3 from "../assets/icons/companion-3.png";
// 여행 예산 (3)
import icBudget1 from "../assets/icons/budget-1.png";
import icBudget2 from "../assets/icons/budget-2.png";
import icBudget3 from "../assets/icons/budget-3.png";

// 하단 네비 아이콘
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

const PURPOSE_ICONS = [icPurpose1, icPurpose2, icPurpose3];
const COMPANION_ICONS = [icCompanion1, icCompanion2, icCompanion3];
const BUDGET_ICONS = [icBudget1, icBudget2, icBudget3];
const THEME_ICONS = BUDGET_ICONS; // 요청: 동일 이미지 사용

// 간단 도시 목록 (데모용)
const CITY_SUGGESTIONS = [
  "부산", "부천", "부평", "부안", "부여",
  "서울", "수원", "성남", "세종",
  "광주", "대구", "대전", "울산", "인천", "제주"
];

export default function MyroCalendar() {
  // ===== 달력 상태 =====
  const today = useMemo(() => new Date(), []);
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [hover, setHover] = useState(undefined);
  const [openCal, setOpenCal] = useState(false);

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");

  const minNights = 0;
  const maxNights = 60;

  const nights =
    range.from && range.to ? differenceInCalendarDays(range.to, range.from) : 0;

  const disabled = [{ before: startOfDay(today) }];

  const onOpenCal = () => setOpenCal(true);
  const onCloseCal = () => setOpenCal(false);
  const onClear = () => {
    const cleared = { from: undefined, to: undefined };
    setRange(cleared);
    setHover(undefined);
  };

  const handleSelect = (next) => {
    if (!next) {
      onClear();
      return;
    }
    if (
      range.from &&
      range.to &&
      isSameDay(range.from, range.to) &&
      next.from &&
      next.to &&
      isSameDay(next.from, next.to) &&
      isSameDay(next.from, range.from)
    ) {
      onClear();
      return;
    }
    if (next.from && next.to) {
      let { from, to } = next;
      if (isBefore(to, from)) [from, to] = [to, from];

      let stay = differenceInCalendarDays(to, from);
      if (stay < minNights) to = addDays(from, minNights);
      if (stay > maxNights) to = addDays(from, maxNights);

      const fixed = { from, to };
      setRange(fixed);
      setHover(undefined);
      return;
    }
    setRange(next);
    setHover(undefined);
  };

  const hoverRange =
    range.from && !range.to && hover
      ? normalizeRange(range.from, hover)
      : undefined;

  return (
    <Stage>
      <PhoneMockup
        width={370.721}
        height={854}
        radius="36px"
        notch
        notchTheme="dark"
        showSpeaker
        showCamera
        wrapOnly={false}
        safePadding="20px 16px 16px"
        bgColor="#F3F4F6"
        contentPointer
      >
        <Main>
          <FormCard>
            <TopBar>
              <Brand>Go Euro</Brand>
              <Login>LOGIN</Login>
            </TopBar>

            {/* 출발/도착 - 자동완성 입력 */}
            <AutoCompleteInput
              label="출발지/Departure"
              value={departure}
              setValue={setDeparture}
              suggestions={CITY_SUGGESTIONS}
              placeholder="도시명 입력"
            />
            <AutoCompleteInput
              label="도착지/Arrival"
              value={arrival}
              setValue={setArrival}
              suggestions={CITY_SUGGESTIONS}
              placeholder="도시명 입력"
              rotateIcon
            />

            <SwapBtn title="Swap">↻</SwapBtn>

            {/* 여행 일자 (모달 오픈) */}
            <FieldButton onClick={onOpenCal}>
              <FieldLabel>여행 일자/Date</FieldLabel>
              {!!(range.from && range.to) && (
                <SelectedText>
                  {fmt(range.from)} ~ {fmt(range.to)} · {nights}박 {nights + 1}일
                </SelectedText>
              )}
              <RightGhost style={{ fontSize: 18 }}>📅</RightGhost>
            </FieldButton>

            {/* 2열 아이콘 박스들: 라벨을 박스 "내부 위쪽"에 배치 */}
            <Row>
              <HalfBox>
                <SmallLabel>목적</SmallLabel>
                <IconRow>
                  {PURPOSE_ICONS.map((src, i) => (
                    <IconImg key={i} src={src} alt="" />
                  ))}
                </IconRow>
              </HalfBox>

              <HalfBox>
                <SmallLabel>일행</SmallLabel>
                <IconRow>
                  {COMPANION_ICONS.map((src, i) => (
                    <IconImg key={i} src={src} alt="" />
                  ))}
                </IconRow>
              </HalfBox>
            </Row>

            <Row>
              <HalfBox>
                <SmallLabel>여행 예산</SmallLabel>
                <IconRow>
                  {BUDGET_ICONS.map((src, i) => (
                    <IconImg key={i} src={src} alt="" />
                  ))}
                </IconRow>
              </HalfBox>

              <HalfBox>
                <SmallLabel>여행 테마</SmallLabel>
                <IconRow>
                  {THEME_ICONS.map((src, i) => (
                    <IconImg key={i} src={src} alt="" />
                  ))}
                </IconRow>
              </HalfBox>
            </Row>

            {/* 동작 아이콘 3개 */}
            <Actions>
              <CircleBtn title="비행기">✈</CircleBtn>
              <CircleBtn title="기차">🚆</CircleBtn>
              <CircleBtn title="즐겨찾기">★</CircleBtn>
            </Actions>

            {/* 짧은 입력 3개 */}
            <ShortField />
            <ShortField />
            <ShortField />

            {/* ✅ 검색 버튼 추가 */}
            <SearchButton>검색</SearchButton>
          </FormCard>
        </Main>

        {/* 하단 네비: PNG 아이콘 사용 */}
        <BottomBar>
          <PlainBtn title="Home"><BottomIcon src={IconHome} alt="Home" /></PlainBtn>
          <PlainBtn title="Calendar"><BottomIcon src={IconCalendar} alt="Calendar" /></PlainBtn>
          <PlainBtn title="Profile"><BottomIcon src={IconProfile} alt="Profile" /></PlainBtn>
        </BottomBar>
      </PhoneMockup>

      {/* 달력 모달 */}
      <ModalCalendar
        open={openCal}
        range={range}
        nights={nights}
        today={today}
        disabled={disabled}
        hoverRange={hoverRange}
        onSelect={handleSelect}
        onHoverEnter={(d) => setHover(d)}
        onHoverLeave={() => setHover(undefined)}
        onClear={onClear}
        onClose={onCloseCal}
      />
    </Stage>
  );
}

/* ======= 자동완성 입력 컴포넌트 ======= */
function AutoCompleteInput({
  label,
  value,
  setValue,
  suggestions,
  placeholder = "검색",
  rotateIcon = false,
}) {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = value.trim();
    if (!q) return [];
    // 앞글자부터 일치하는 항목 우선
    const s = suggestions.filter((c) => c.startsWith(q));
    // 포함 일치(뒤)도 보이려면 아래 주석 해제
    // const more = suggestions.filter((c) => !c.startsWith(q) && c.includes(q));
    return s; // [...s, ...more];
  }, [value, suggestions]);

  const onChange = (e) => {
    setValue(e.target.value);
    setOpen(true);
  };
  const onBlurBox = () => {
    // 살짝 지연 후 닫기 (항목 클릭 처리 허용)
    setTimeout(() => setOpen(false), 120);
  };
  const onSelect = (text) => {
    setValue(text);
    setOpen(false);
  };

  return (
    <AutoWrap onBlur={onBlurBox}>
      <FieldWithIcon as="label">
        <FieldLabel>{label}</FieldLabel>
        <Input
          value={value}
          onChange={onChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label={label}
        />
        <RightGhost style={{ transform: rotateIcon ? "rotate(-15deg)" : "none" }}>
          🔍
        </RightGhost>
      </FieldWithIcon>

      {open && filtered.length > 0 && (
        <SuggestBox>
          {filtered.map((city) => (
            <SuggestItem key={city} onMouseDown={() => onSelect(city)}>
              {highlightPrefix(city, value)}
            </SuggestItem>
          ))}
        </SuggestBox>
      )}
    </AutoWrap>
  );
}

function highlightPrefix(text, prefix) {
  if (!prefix || !text.startsWith(prefix)) return <span>{text}</span>;
  const rest = text.slice(prefix.length);
  return (
    <>
      <strong style={{ color: "#111" }}>{prefix}</strong>
      <span style={{ color: "#bdbdbd" }}>{rest}</span>
    </>
  );
}

/* ================= utils ================= */
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function differenceInCalendarDays(b, a) {
  const MS = 24 * 60 * 60 * 1000;
  return Math.floor((startOfDay(b) - startOfDay(a)) / MS);
}
function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isBefore(a, b) {
  return a && b && a.getTime() < b.getTime();
}
function isAfter(a, b) {
  return a && b && a.getTime() > b.getTime();
}
function normalizeRange(a, b) {
  return isAfter(a, b) ? { from: b, to: a } : { from: a, to: b };
}
function fmt(d) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2, "0"
  )}.${String(d.getDate()).padStart(2, "0")}`;
}

/* ================= styled-components ================= */
const Stage = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #f5f5f7;
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden; /* ⛔ 스크롤 제거 */
`;

const TopBar = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 4px 10px;
`;
const Brand = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.2px;
`;
const Login = styled.div`
  font-size: 12px;
  font-weight: 800;
`;

/* ✅ 폼 카드 */
const FormCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  border: 2px solid #9ef05a;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  background-color: #fff;
`;

/* === 입력 + 아이콘 공통 박스 === */
const FieldWithIcon = styled.div`
  /* 공통 크기 고정 + 패딩 포함 계산 */
  position: relative;
  width: 312px;
  height: 44px;            /* ✅ 모든 필드 동일 높이 */
  box-sizing: border-box;  /* ✅ 패딩 포함해서 높이 유지 */

  flex-shrink: 0;
  border-radius: 10px;
  border: 3px solid #bfbfbf;
  background: #fff;

  display: flex;
  align-items: center;
  /* 세로 패딩 제거, 좌우만 고정 간격 */
  padding: 30px 40px 20px 36px;  /* 왼쪽 라벨/입력 여백, 오른쪽 아이콘 여백 */
  gap: 8px;
`;
const FieldButton = styled(FieldWithIcon)`
  cursor: pointer;
`;
const FieldLabel = styled.span`
  position: absolute;
  left: 12px;
  top: -10px;
  padding: 0 4px;
  background: #fff;
  color: #9b9b9b;
  font-size: 11px;
  font-weight: 700;
`;
const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  color: #111;
  background: transparent;
  &::placeholder { color: #c1c1c1; }
`;
const SelectedText = styled.span`
  position: absolute;
  left: 12px;
  bottom: 6px;
  font-size: 12px;
  color: #4b5563;
`;

const RightGhost = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #111;
  user-select: none;
  pointer-events: none;
`;

/* 자동완성 래퍼 + 드롭다운 */
const AutoWrap = styled.div`
  position: relative;
  width: 248px;
`;
const SuggestBox = styled.ul`
  position: absolute;
  z-index: 50;
  top: 36px; /* 입력박스 바로 아래 */
  left: 0;
  width: 100%;
  margin: 6px 0 0;
  padding: 8px 10px;
  list-style: none;
  background: #f3f3f4;
  border: 3px solid #9ef05a;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
`;
const SuggestItem = styled.li`
  padding: 6px 2px;
  font-size: 16px;
  cursor: pointer;
  &:hover { background: #eee; }
`;

const SwapBtn = styled.button`
  position: absolute;
  top: 148px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 3px solid #9ef05a;
  background: #fff;
  color: #111;
  font-size: 18px;
  font-weight: 800;
  display: grid;
  place-items: center;
`;

const Row = styled.div`
  width: 312px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

/* 내부 라벨 포함 박스 */
const HalfBox = styled.div`
  position: relative;
  width: 140px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 10px;
  border: 3px solid #bfbfbf;
  background: #fff;
  display: grid;
  place-items: center;
`;
const SmallLabel = styled.span`
  position: absolute;
  top: 6px;
  left: 8px;
  font-size: 10px;
  color: #6b6b6b;
`;
const IconRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 8px 6px;
`;
const IconImg = styled.img`
  height: 18px;
  width: auto;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

const Actions = styled.div`
  width: 312px;
  display: flex;
  justify-content: space-between;
  padding: 2px 22px 6px;
`;
const CircleBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 3px solid #9ef05a;
  background: #fff;
  font-size: 20px;
  line-height: 0;
`;

const ShortField = styled.div`
  width: 312px;
  height: 40px;
  border-radius: 10px;
  border: 3px solid #bfbfbf;
  background: #fff;
`;

/* 검색 버튼 */
const SearchButton = styled.button`
  width: 120px;
  height: 36px;
  margin: 2px 0 6px;
  border-radius: 10px;
  border: 0;
  background: #9ef05a;
  font-weight: 800;
  font-size: 16px;
  color: #0a0a0a;
  box-shadow: 0 0 0 2px #9ef05a, 0 2px 0 rgba(0,0,0,0.1) inset;
`;

const BottomBar = styled.footer`
  background: #e8e8ea;
  height: 50px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 6px;
  padding: 8px 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* 하단 아이콘 버튼 (PNG) */
const PlainBtn = styled.button`
  width: 48px;
  height: 40px;
  border-radius: 10px;
  border: 3px solid #bfbfbf;
  background: #fff;
  display: grid;
  place-items: center;
`;
const BottomIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;
