// src/Components/HomeLanding.jsx
import React, { useMemo, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";
import { useNavigate } from "react-router-dom";
/* 배경 & 아이콘 */
import BeachBg from "../assets/Image1.png";
import PlaneDepart from "../assets/Vector (13).png"; // 출발지 아이콘
import PlaneArrive from "../assets/Vector (14).png"; // 도착지 아이콘
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

/* 데모용 도시 목록 */
const CITY_SUGGESTIONS = [
  "부산", "부천", "부평", "부안", "부여",
  "서울", "수원", "성남", "세종",
  "광주", "대구", "대전", "울산", "인천", "제주"
];

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function HomeLanding() {
  const navigate = useNavigate();
  const [dep, setDep] = useState("");
  const [arr, setArr] = useState("");

 const goNext = () => {
    navigate("/main2", { state: { dep, arr } });
  };

  return (
    <>
      <GlobalStyle />
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
            {/* 로고: 왼쪽 아래(노치 바로 아래) */}
            <LogoWrap>
              <Logo>
                <span className="go">Go</span>
                <span className="euro">Euro</span>
              </Logo>
            </LogoWrap>

            {/* 히어로 이미지 + 멘트 */}
            <Hero>
              <HeroImg role="img" aria-label="베니스 운하 풍경" />
              <HeroText>
                안녕하세요 연우님!<br />
                여행 계획을 같이 짜볼까요?
              </HeroText>
            </Hero>

            {/* 흰색 카드 (출발/도착) */}
            <WhiteCard>
              <AutoInput
                label="출발지/Departure"
                value={dep}
                setValue={setDep}
                suggestions={CITY_SUGGESTIONS}
                icon={PlaneDepart}
              />
              <AutoInput
                label="도착지/Arrival"
                value={arr}
                setValue={setArr}
                suggestions={CITY_SUGGESTIONS}
                icon={PlaneArrive}
              />

              {/* 🔄 가운데 스왑 버튼 (노란색) */}
              <SwapBtn aria-label="출발/도착 교환">↻</SwapBtn>
            </WhiteCard>

            {/* 검색 버튼 */}
            <SearchWrap>
              <SearchBtn onClick={goNext}>검색</SearchBtn>
            </SearchWrap>

            {/* 하단 네비게이션 */}
            <BottomNav role="navigation" aria-label="Main">
              <NavBtn className="active" aria-label="Home">
                <Icon src={IconHome} alt="Home" />
              </NavBtn>
              <NavBtn aria-label="Calendar">
                <Icon src={IconCalendar} alt="Calendar" />
              </NavBtn>
              <NavBtn aria-label="Profile">
                <Icon src={IconProfile} alt="Profile" />
              </NavBtn>
            </BottomNav>
          </Screen>
        </PhoneMockup>
      </Stage>
    </>
  );
}

/* ================== AutoComplete Input ================== */
function AutoInput({ label, value, setValue, suggestions, icon }) {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = value.trim();
    if (!q) return [];
    return suggestions.filter((c) => c.startsWith(q));
  }, [value, suggestions]);

  const onChange = (e) => {
    setValue(e.target.value);
    setOpen(true);
  };
  const onSelect = (text) => {
    setValue(text);
    setOpen(false);
  };
  const onBlurBox = () => setTimeout(() => setOpen(false), 120);

  return (
    <AutoWrap onBlur={onBlurBox}>
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <Input
          value={value}
          onChange={onChange}
          onFocus={() => setOpen(true)}
          placeholder="도시명 입력"
          aria-label={label}
        />
        <RightIcon src={icon} alt="" />
      </Field>

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

/* ================== styled ================== */
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
  padding-bottom: 90px;  /* 하단 네비와 겹치지 않게 여유 */
`;

/* 로고: 왼쪽 아래(노치 아래) */
const LogoWrap = styled.div`
  position: absolute;
 
  left: 16px;

  top: calc(env(safe-area-inset-top, 0px) + 60px);
  z-index: 3;
`;
const Logo = styled.h1`
  margin: 0;
  font-family: "ADLaM Display", system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', sans-serif;
  font-size: 35px;   /* 요청값 */
  font-weight: 400;  /* 요청값 */
  line-height: normal;

  .go { color: #000; }
  .euro { color: #FFE057; }
`;

/* 히어로 섹션 */
const Hero = styled.div`
margin-top:130px;
  position: relative;
  width: 100%;
  height: 350px;   /* 요청 높이 */
`;
const HeroImg = styled.div`
  position: absolute;
  inset: 0;
  background: url(${BeachBg}) no-repeat center/cover;
  filter: brightness(0.98);
`;
const HeroText = styled.p`
    position: absolute;
  left: 20px;
  right: 20px;              /* ← 박스 너비 확보 (또는 width: calc(100% - 40px);) */
  bottom: 20px;
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
  text-align: left;         /* ← 왼쪽 정렬 */
`;

/* 흰색 카드 박스 */
const WhiteCard = styled.div`
  position: relative;          /* 🔒 스왑 버튼 absolute 기준 */
  width: 100%;
  max-width: 340px;
  margin: 14px auto 6px;
  padding: 12px 10px 11px;
 color: #ffffff;
  border-radius: 12px;
  
  margin-bottom:60px;
  display: grid;
  gap: 10px;
  
`;

/* 입력 필드 */
const AutoWrap = styled.div`
  position: relative;
`;
const Field = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  border: 2px solid #cfcfcf;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 14px 0 12px;
  
  
`;
const FieldLabel = styled.span`
  position: absolute;
  top: -9px;
  left: 10px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 700;
  color: #9b9b9b;
  background: #fff;
  border-radius: 4px;
`;
const Input = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  font-size: 15px;
  color: #111;
  background: transparent;
  &::placeholder { color: #c6c6c6; }
`;
const RightIcon = styled.img`
  position: absolute;
  right: 10px;
  width: 22px;
  height: 22px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;

/* 자동완성 드롭다운 */
const SuggestBox = styled.ul`
  position: absolute;
  z-index: 50;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 8px 10px;
  list-style: none;
  background: #f7f7f8;
  border: 2px solid #cfeaa1;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.07);
`;
const SuggestItem = styled.li`
  padding: 8px 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover { background: #eee; }
`;

/* 🔎 검색 버튼 (요청 CSS) */
const SearchWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  margin: 10px 0 0;
`;
const SearchBtn = styled.button`
  width: 308px;               /* 요청값 */
  height: 50px;               /* 요청값 */
  flex-shrink: 0;
  border-radius: 10px;        /* 요청값 */
  background: #FFE057;        /* 요청값 */
  border: 0;
  font-weight: 800;
  font-size: 16px;
  color: #0a0a0a;
  cursor: pointer;
`;

/* 🔄 스왑 버튼 (노란색, 가운데) */
const SwapBtn = styled.button`
  position: absolute;
  top: 50%;                    /* 두 입력 사이 중앙 */
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 3px solid #FFE057;
  background: #FFE057;
  color: #111;
  font-size: 18px;
  font-weight: 800;
  display: grid;
  place-items: center;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
`;

/* 하단 네비게이션 (흰색 버튼 3개) */
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
const NavBtn = styled.button`
  width: 56px;
  height: 40px;
  padding: 0;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    border-color 120ms ease,
    background-color 120ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  &.active > img {
    opacity: 1;
  }
`;
const Icon = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
  opacity: 0.8;
`;
