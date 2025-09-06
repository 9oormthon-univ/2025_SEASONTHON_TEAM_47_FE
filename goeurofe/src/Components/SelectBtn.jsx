// src/Components/HomeLanding.jsx
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";
import { useNavigate } from "react-router-dom";

/* 배경 & 아이콘 */
import BeachBg from "../assets/Image1.png";

/* ▼▼ 아이콘: 회색/노랑 버전 매핑 (파일명은 네 자산에 맞게 수정) ▼▼ */
// 회색(기본)
import IcFlightGray from "../assets/icons/Group 22.png";        // ✈️ 회색
import IcHotelGray  from "../assets/icons/Group 24.png";        // 🏠 회색
import IcPlaceGray  from "../assets/icons/Group 23.png";        // 📍 회색
// 노랑(선택)
import IcPlaceYellow from "../assets/icons/Group 2087330330.png";
import IcHotelYellow from "../assets/icons/Group 2087330331.png";
import IcFlightYellow from "../assets/icons/Group 2087330332.png";

/* 하단 네비 */
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }

  /* 폰트 로드: ADLaM, Do Hyeon */
  @import url('https://fonts.googleapis.com/css2?family=ADLaM+Display&family=Do+Hyeon&display=swap');
`;

export default function HomeLanding() {
  const navigate = useNavigate();

  // 어떤 아이콘이 선택됐는지: 'flight' | 'hotel' | 'place' | null
  const [active, setActive] = useState(null);

  const handleNext = () => {
    // 필요 시 active 상태 확인해서 분기 가능
    navigate("/main4"); // 이동 경로 원하는 곳으로 바꿔줘
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
            {/* 로고 */}
            <LogoWrap>
              <Logo>
                <span className="go">Go</span>
                <span className="euro">Euro</span>
              </Logo>
            </LogoWrap>

            {/* 히어로 (이미지 + 멘트) */}
            <Hero>
              <HeroImg role="img" aria-label="베니스 운하 풍경" />
              <HeroText>
                OO님! 항공기와 숙소는 예매 하셨나요?
                <br />
                가고 싶은 주요 장소도 있다면 알려주세요!
              </HeroText>
            </Hero>

            {/* 아이콘 3개: 예매항공 / 예매숙소 / 주요장소 */}
            <IconRow>
              <IconItem onClick={() => setActive("flight")}>
                <IconCircle
                  src={active === "flight" ? IcFlightYellow : IcFlightGray}
                  alt="예매항공"
                />
                <IconLabel>예매항공</IconLabel>
              </IconItem>

              <IconItem onClick={() => setActive("hotel")}>
                <IconCircle
                  src={active === "hotel" ? IcHotelYellow : IcHotelGray}
                  alt="예매숙소"
                />
                <IconLabel>예매숙소</IconLabel>
              </IconItem>

              <IconItem onClick={() => setActive("place")}>
                <IconCircle
                  src={active === "place" ? IcPlaceYellow : IcPlaceGray}
                  alt="주요장소"
                />
                <IconLabel>주요장소</IconLabel>
              </IconItem>
            </IconRow>

            {/* 다음 버튼 */}
            <SearchWrap>
              <SearchBtn onClick={handleNext}>다음</SearchBtn>
            </SearchWrap>

            {/* 하단 네비 */}
            <BottomNav role="navigation" aria-label="Main">
              <NavBtn className="active" aria-label="Home">
                <NavIcon src={IconHome} alt="Home" />
              </NavBtn>
              <NavBtn aria-label="Calendar">
                <NavIcon src={IconCalendar} alt="Calendar" />
              </NavBtn>
              <NavBtn aria-label="Profile">
                <NavIcon src={IconProfile} alt="Profile" />
              </NavBtn>
            </BottomNav>
          </Screen>
        </PhoneMockup>
      </Stage>
    </>
  );
}

/* ===== styled ===== */
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

const LogoWrap = styled.div`
  position: absolute;
  left: 16px;
  top: calc(env(safe-area-inset-top, 0px) + 60px);
  z-index: 3;
`;
const Logo = styled.h1`
  margin: 0;
  font-family: "ADLaM Display", system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', sans-serif;
  font-size: 35px;
  font-weight: 400;
  .go { color: #000; }
  .euro { color: #FFE057; }
`;

const Hero = styled.div`
  margin-top: 130px;
  position: relative;
  width: 100%;
  height: 330px;
`;
const HeroImg = styled.div`
  position: absolute;
  inset: 0;
  background: url(${BeachBg}) no-repeat center/cover;
  filter: brightness(0.98);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;
const HeroText = styled.p`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 18px;
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
  text-align: left;
  word-break: keep-all;
`;

/* 아이콘 3개 영역 */
const IconRow = styled.div`
  width: 100%;
  max-width: 340px;
  margin: 16px auto 18px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  justify-items: center;
`;
const IconItem = styled.button`
  background: none;
  border: 0;
  padding: 6px 0 0;
  cursor: pointer;
  display: grid;
  place-items: center;
  gap: 8px;
`;
const IconCircle = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
`;
const IconLabel = styled.span`
  font-family: "Do Hyeon", system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', sans-serif;
  color: black;
  font-size: 25px;
  font-weight: 400;
  line-height: 1;
  word-wrap: break-word;
`;

/* 다음 버튼 */
const SearchWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  margin-top: 4px;
`;
const SearchBtn = styled.button`
  width: 308px;
  height: 50px;
  border-radius: 10px;
  background: #FFE057;
  border: 0;
  font-weight: 800;
  font-size: 16px;
  color: #0a0a0a;
  cursor: pointer;
  margin-top:84px;
`;

/* 하단 네비 */
const BottomNav = styled.nav`
  position: absolute;
  left: 0; right: 0; bottom: 0;
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
  width: 56px; height: 40px;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
`;
const NavIcon = styled.img`
  width: 22px; height: 22px;
  opacity: 0.8;
`;
