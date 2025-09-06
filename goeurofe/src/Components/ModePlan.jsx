// src/Components/HomeLanding.jsx
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import PhoneMockup from "../Frame/PhoneMockup";
import { useTripFormActions } from "../store/TripFormContext";
/* 배경 */
import BeachBg from "../assets/Image1.png";

/* 카테고리 아이콘 */
import IcRelax from "../assets/icons/shop.png"; // 휴양
import IcTour  from "../assets/icons/food.png"; // 관광
import IcAct   from "../assets/icons/moun.png"; // 액티비티

/* 하단 네비 아이콘 */
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

const PURPOSE_LABEL = {
  relax: "휴양",
  tour: "관광",
  act: "액티비티",
  etc: "기타",
};
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=ADLaM+Display&family=Do+Hyeon&display=swap');

  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function HomeLanding() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState(null);
 const { setField } = useTripFormActions();
  const handleNext = () => {
     const value = PURPOSE_LABEL[purpose]; // "휴양" | "관광" | "액티비티" | "기타"
    setField("purpose", value);            // 전역 저장
    navigate("/main6", { state: { purpose: value } }); // 라우터 state 전달(원치 않으면
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

            {/* 히어로 */}
            <Hero>
              <HeroImg role="img" aria-label="베니스 운하 풍경" />
              <HeroText>
                OO님!<br />여행 목적을 선택해주세요!
              </HeroText>
            </Hero>

            {/* 아이콘 3개 */}
            <IconRow>
              <IconCard
                onClick={() => setPurpose("relax")}
                aria-pressed={purpose === "relax"}
              >
                <IconImage src={IcRelax} alt="휴양" />
                <IconLabel>쇼핑</IconLabel>
              </IconCard>

              <IconCard
                onClick={() => setPurpose("tour")}
                aria-pressed={purpose === "tour"}
              >
                <IconImage src={IcTour} alt="관광" />
                <IconLabel>맛집</IconLabel>
              </IconCard>

              <IconCard
                onClick={() => setPurpose("act")}
                aria-pressed={purpose === "act"}
              >
                <IconImage src={IcAct} alt="액티비티" />
                <IconLabel>자연경관</IconLabel>
              </IconCard>
            </IconRow>

            {/* 기타 버튼 */}
            <EtcWrap>
              <EtcButton
                type="button"
                onClick={() => setPurpose("etc")}
                aria-pressed={purpose === "etc"}
              >
                기타
              </EtcButton>
            </EtcWrap>

            {/* 다음 버튼 */}
            <NextWrap>
              <NextBtn onClick={handleNext}>다음</NextBtn>
            </NextWrap>

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

/* ================= styled ================= */
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
  font-family: "ADLaM Display";
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
`;
const HeroText = styled.p`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
  text-align: left;
`;


/* 아이콘 카드 */
const IconRow = styled.div`
  width: 100%;
  max-width: 340px;
  margin: 14px auto 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  gap: 8px;
`;
const IconCard = styled.button`
  width: 110px;
  height: 140px;
  border-radius: 20.952px;
  border: 4.19px solid #BFBFBF;
  background: #FFF;
  display: grid;
  place-items: center;
  padding-top: 8px;
  gap: 6px;
  cursor: pointer;

  &[aria-pressed="true"] {
    border-color: #FFE057;
    box-shadow: 0 0 0 3px rgba(255,224,87,0.35) inset;
  }
`;
const IconImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;
const IconLabel = styled.span`
  color: #000;
  font-family: "Do Hyeon", sans-serif;
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

/* 기타 버튼 */
const EtcWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
`;
const EtcButton = styled.button`
  width: 350px;
  height: 50px;
  border-radius: 10px;
  border: 4.19px solid #BFBFBF;
  background: #FFF;
  cursor: pointer;

  color: #000;
  font-family: "Do Hyeon", sans-serif;
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  &[aria-pressed="true"] {
    border-color: #FFE057;
    box-shadow: 0 0 0 3px rgba(255,224,87,0.35) inset;
  }
`;

/* 다음 버튼 */
const NextWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  margin-top: 10px;
`;
const NextBtn = styled.button`
  width: 308px;
  height: 50px;
  border-radius: 10px;
  background: #FFE057;
  border: 0;
  font-weight: 800;
  font-size: 16px;
  color: #0a0a0a;
  cursor: pointer;
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
