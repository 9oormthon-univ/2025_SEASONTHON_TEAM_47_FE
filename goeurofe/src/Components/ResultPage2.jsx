// src/Components/ItineraryDays.jsx
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import PhoneMockup from "../Frame/PhoneMockup";

import TopHeroImg from "../assets/venive_top.png";
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

const Global = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap');
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function ItineraryDays() {
  const navigate = useNavigate();

  const goProfile = () => {
    // 필요에 따라 '/profile' 대신 실제 프로필 라우트로 변경
    navigate("/profile");
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

            {/* 상단 타이틀 */}
            <TitleWrap>
              <h1 className="title">여행 일정</h1>
              <div className="divider" />
            </TitleWrap>

            {/* 날짜 (요청 스타일 고정) */}
            <DateHeading>2025. 09. 02</DateHeading>

            {/* 정적 텍스트만 들어간 리스트 */}
            <ListArea>
              <Item>
                <p className="time">9:00 ~ 12:00</p>
                <h3 className="name">Capitoline Museums</h3>
                <p className="link">홈페이지</p>
                <p className="addr">Piazza del Campidoglio, 1, 00186 Roma RM</p>
              </Item>

              <Item>
                <p className="time">12:30 ~ 13:30</p>
                <h3 className="name">Urbana 47</h3>
                <p className="link">홈페이지</p>
                <p className="addr">Via Urbana, 47, 00184 Roma RM</p>
              </Item>

              <Item>
                <p className="time">14:00 ~ 15:30</p>
                <h3 className="name">Colosseum</h3>
                <p className="link">홈페이지</p>
                <p className="addr">Piazza del Colosseo, 1, 00184 Roma RM</p>
              </Item>
            </ListArea>

            {/* 하단 네비 */}
            <BottomNav role="navigation" aria-label="Main">
              <NavBtn className="active" aria-label="Home">
                <img src={IconHome} alt="Home" />
              </NavBtn>

              <NavBtn aria-label="Calendar">
                <img src={IconCalendar} alt="Calendar" />
              </NavBtn>

              {/* ✅ 3번째 프로필 버튼 클릭 시 /profile 로 이동 */}
              <NavBtn aria-label="Profile" onClick={goProfile}>
                <img src={IconProfile} alt="Profile" />
              </NavBtn>
            </BottomNav>
          </Screen>
        </PhoneMockup>
      </Stage>
    </>
  );
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
  width: 100%;
  height: 140px;
  background: url(${TopHeroImg}) center/cover no-repeat;
`;

const TitleWrap = styled.div`
  padding: 16px 16px 0;
  .title {
    margin: 0;
    text-align: center;
    color: #000;
    font-family: "Do Hyeon", system-ui;
    font-size: 28px;
    font-weight: 400;
  }
  .divider {
    margin: 8px auto 0;
    width: calc(100% - 32px);
    height: 1px;
    background: rgba(0,0,0,0.2);
  }
`;

/* 날짜: 요청된 스타일 그대로 */
const DateHeading = styled.h2`
  margin: 12px 30px 30px;
  text-align: center;

  color: #000;
  font-family: "Do Hyeon", system-ui;
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ListArea = styled.div`
  padding: 6px 16px 90px;
`;

const Item = styled.div`
  padding: 12px 2px;
  border-bottom: 1px solid #eee;

  .time {
    margin: 0 0 4px;
    font-family: "Do Hyeon", system-ui;
    font-size: 12px;
    color: #000;
    letter-spacing: 0.2px;
  }
  .name {
    margin: 0;
    color: #000;
    font-family: "Do Hyeon", system-ui;
    font-size: 30px;
    font-weight: 400;
  }
  .link {
    margin: 4px 0 0;
    font-size: 22px;
    color: #000;
  }
  .addr {
    margin: 6px 0 0;
    color: #a7a7a7;
    font-size: 12px;
    line-height: 1.4;
  }
`;

const BottomNav = styled.nav`
  position: absolute; left: 0; right: 0; bottom: 0; background: #fff;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: grid; grid-template-columns: repeat(3, 1fr);
  align-items: center; justify-items: center;
  padding: 10px 28px calc(10px + env(safe-area-inset-bottom));
  min-height: 58px;

  img { width: 22px; height: 22px; opacity: 0.8; }
`;
const NavBtn = styled.button`
  width: 56px; height: 40px; border: 1.5px solid #e5e5e5; border-radius: 10px;
  background: #fff; display: grid; place-items: center; cursor: pointer;
`;
