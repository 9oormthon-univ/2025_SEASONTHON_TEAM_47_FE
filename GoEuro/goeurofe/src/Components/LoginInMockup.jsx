// src/Components/LoginScreen.jsx
import React from "react";
import styled from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";

// 배경 이미지
import WhiteBox from "../assets/WhiteBox.png";   // 회색 라인 배경
import GreenBox from "../assets/GreenBox.png";   // 연두 라인 오버레이

// 하단 네비 아이콘
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

// 카카오 로그인 버튼 이미지
import KakaoLoginBtn from "../assets/kakaobtn.png";

export default function LoginScreen() {
  return (
    <Stage>
      <PhoneMockup
        width={375}
        height={851}
        radius="36px"
        notch
        notchTheme="dark"           // ✅ 카메라/노치 검정
        showSpeaker
        showCamera
        wrapOnly={false}
        safePadding="56px 16px 84px" // 하단 네비 공간 확보
        bgColor="#F3F4F6"
        contentPointer
      >
        <Screen>
          <Card>
            <GreenOverlay />
            <CardBody>
              <Title>LOGIN</Title>

              {/* ✅ 카카오 로그인 버튼 이미지 */}
              <KakaoImg src={KakaoLoginBtn} alt="카카오 간편 로그인" />
            </CardBody>
          </Card>
        </Screen>

        {/* ✅ 하단 네비게이션 바 */}
        <BottomNav>
          <NavBtn><Icon src={IconHome} alt="Home" /></NavBtn>
          <NavBtn><Icon src={IconCalendar} alt="Calendar" /></NavBtn>
          <NavBtn><Icon src={IconProfile} alt="Profile" /></NavBtn>
        </BottomNav>
      </PhoneMockup>
    </Stage>
  );
}

/* ========= styled ========= */
const Stage = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #f5f5f7;
`;

const Screen = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: url(${WhiteBox}) center / cover no-repeat;
  filter: contrast(1.2); /* 라인 조금 더 진하게 */
`;

const Card = styled.div`
  position: absolute;
  left: 50%;
  top: 110px;
  transform: translateX(-50%);
  width: 312px;
  height: 520px;
  border-radius: 12px;
  background: #fff;
  border: 2px solid rgba(0,0,0,0.18);
  box-shadow: 0 6px 14px rgba(0,0,0,0.15);
  overflow: hidden;
`;

const GreenOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: url(${GreenBox}) center / cover no-repeat;
  pointer-events: none;
  z-index: 0;
`;

const CardBody = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  gap: 24px;
`;

const Title = styled.h1`
  margin-top: 20px;
  margin-bottom: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 1px;
`;

/* ✅ 카카오 로그인 버튼 이미지 */
const KakaoImg = styled.img`
  width: 220px;   /* 버튼 크기 적절히 조정 */
  height: auto;
  cursor: pointer;
`;

/* 하단 네비 */
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
  background: none;
  border: 0;
  padding: 6px 0;
`;

const Icon = styled.img`
  width: 26px;
  height: auto;
  object-fit: contain;
`;
