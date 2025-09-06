// src/Components/HomeLanding.jsx
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import PhoneMockup from "../Frame/PhoneMockup";
import { useTripFormActions } from "../store/TripFormContext";
/* 배경 (만지지 않음) */
import BeachBg from "../assets/Image1.png";

/* 상단 3개 아이콘 (단독/커플/친구) — 프로젝트 내 자산 경로에 맞게 교체해줘 */
import IcSolo   from "../assets/icons/companion-1.png"; // 단독
import IcCouple from "../assets/icons/companion-2.png"; // 커플
import IcFriends from "../assets/icons/companion-3.png"; // 친구

/* 하단 2개 아이콘 (가족/반려동물) — 파일명에 맞게 교체 */
import IcFamily from "../assets/icons/companion-family.png"; // 가족 (예: family.png)
import IcPet    from "../assets/icons/companion-pet.png";    // 반려동물 (예: pet.png)

/* 하단 네비 아이콘 (그대로) */
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";
const PEOPLE_LABEL = {
  solo: "단독",
  couple: "커플",
  friends: "친구",
  family: "가족",
  pet: "반려동물",
};

const GlobalStyle = createGlobalStyle`
  /* Do Hyeon 로드 */
  @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap');

  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function HomeLanding() {
  const navigate = useNavigate();
  // ⬇️ 추가: 전역 저장 훅 (최상위에서 호출)
  const { setField } = useTripFormActions();
  // 선택 상태 (단독/커플/친구/가족/반려동물)
  const [sel, setSel] = useState(null); // 'solo' | 'couple' | 'friends' | 'family' | 'pet' | null

  const handleNext = () => {
    const value = PEOPLE_LABEL[sel];

    // ⬇️ 추가: TripFormContext에 저장
    setField("people", value);

    // ⬇️ OutputPage로 이동 (경로는 프로젝트에 맞게)
    navigate("/resultpage");
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
            {/* 로고 (그대로) */}
            <LogoWrap>
              <Logo>
                <span className="go">Go</span>
                <span className="euro">Euro</span>
              </Logo>
            </LogoWrap>

            {/* 히어로 (배경이미지 건드리지 않음) */}
            <Hero>
              <HeroImg role="img" aria-label="베니스 운하 풍경" />
              <HeroText>
                OO님!
                <br />
                여행은 누구랑 가시는지 선택해주세요!
              </HeroText>
            </Hero>

            {/* 상단 3개: 단독 / 커플 / 친구 (기존 카드 규격) */}
            <TopRow>
              <IconCard
                onClick={() => setSel("solo")}
                aria-pressed={sel === "solo"}
              >
                <IconImg src={IcSolo} alt="단독" />
                <IconLabel>단독</IconLabel>
              </IconCard>

              <IconCard
                onClick={() => setSel("couple")}
                aria-pressed={sel === "couple"}
              >
                <IconImg src={IcCouple} alt="커플" />
                <IconLabel>커플</IconLabel>
              </IconCard>

              <IconCard
                onClick={() => setSel("friends")}
                aria-pressed={sel === "friends"}
              >
                <IconImg src={IcFriends} alt="친구" />
                <IconLabel>친구</IconLabel>
              </IconCard>
            </TopRow>

            {/* 하단 2개: 가족 / 반려동물 (새 규격 170×85) */}
            <BottomRow>
              <WideCard
                onClick={() => setSel("family")}
                aria-pressed={sel === "family"}
              >
                <WideInner>
                  <WideIcon src={IcFamily} alt="가족" />
                  <WideLabel>가족</WideLabel>
                </WideInner>
              </WideCard>

              <WideCard
                onClick={() => setSel("pet")}
                aria-pressed={sel === "pet"}
              >
                <WideInner>
                  <WideIcon src={IcPet} alt="반려동물" />
                  <WideLabel>반려동물</WideLabel>
                </WideInner>
              </WideCard>
            </BottomRow>

            {/* 노란 버튼: 일정 생성하기 (폰트 동일: Do Hyeon 25px) */}
            <BtnWrap>
              <PrimaryBtn onClick={handleNext}>일정 생성하기</PrimaryBtn>
            </BtnWrap>

            {/* 하단 네비 (그대로) */}
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

/* ====================== styled ====================== */
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
  margin-top: 130px; /* 로고 아래 간격 */
  position: relative;
  width: 100%;
  height: 330px; /* 배경이미지 영역 (지시: 만지지 않음) */
`;
const HeroImg = styled.div`
  position: absolute;
  inset: 0;
  background: url(${BeachBg}) no-repeat center/cover;
`;
const HeroText = styled.p`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 14px;
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
  text-align: left;
`;

/* 상단 3개 카드 (기존 규격: 110×140) */
const TopRow = styled.div`
  width: 100%;
  max-width: 340px;
  margin: 14px auto 8px;
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
const IconImg = styled.img`
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

/* 하단 2개 박스 (새 규격: 170×85) */
const BottomRow = styled.div`
  width: 100%;
  max-width: 350px; /* 170*2 = 340, 여유 10px */
  margin: 6px auto 10px;
  display: grid;
  grid-template-columns: repeat(2, 170px);
  justify-content: center;
  gap: 10px;
`;
const WideCard = styled.button`
  width: 170px;
  height: 85px;
  flex-shrink: 0;
  border-radius: 20.952px;
  border: 4.19px solid #BFBFBF;
  background: #FFF;
  cursor: pointer;

  &[aria-pressed="true"] {
    border-color: #FFE057;
    box-shadow: 0 0 0 3px rgba(255,224,87,0.35) inset;
  }
`;
const WideInner = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 48px 1fr;
  align-items: center;
  justify-items: center;
  gap: 8px;
  padding: 0 12px;
`;
const WideIcon = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;
const WideLabel = styled.span`
  color: #000;
  font-family: "Do Hyeon", sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

/* 노란 버튼 */
const BtnWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  margin-top: 6px;
`;
const PrimaryBtn = styled.button`
  width: 308px;
  height: 50px;
  border-radius: 10px;
  background: #FFE057;
  border: 0;
  cursor: pointer;

  /* 요청: 버튼 텍스트도 동일 폰트/크기 */
  color: #0a0a0a;
  font-family: "Do Hyeon", sans-serif;
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

/* 하단 네비 (폰 내부) */
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
