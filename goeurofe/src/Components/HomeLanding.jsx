// src/Components/HomeLanding.jsx
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";
import { useNavigate } from "react-router-dom";
import CalendarModal from "./ModalCalendar";

/* 컨텍스트 액션 */
import { useTripFormActions } from "../store/TripFormContext";

/* 배경 & 아이콘 */
import BeachBg from "../assets/Image1.png";
import PlaneDepart from "../assets/Vector (13).png";
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function HomeLanding() {
  const navigate = useNavigate();
  const { setMany } = useTripFormActions(); // ✅ 여러 값 저장

  const [range, setRange] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 일수 계산
  const calcDays = (from, to) => {
    if (!from || !to) return 0;
    const d0 = toYMD(from);
    const d1 = toYMD(to);
    const MS = 24 * 60 * 60 * 1000;
    return Math.floor((d1 - d0) / MS) + 1;
  };

  function toYMD(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function fmt(d) {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }

  const handleNext = () => {
    if (range?.from && range?.to) {
      const days = calcDays(range.from, range.to);
      const startDay = fmt(range.from);
      const endDay = fmt(range.to);

      // ✅ 전역 저장
      setMany({
        date: days,
        startDay,
        endDay,
      });

      // ✅ 라우터 state로도 전달
      navigate("/main3", {
        state: { date: days, startDay, endDay },
      });
    } else {
      alert("여행일자를 선택해주세요!");
    }
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
            <LogoWrap>
              <Logo>
                <span className="go">Go</span>
                <span className="euro">Euro</span>
              </Logo>
            </LogoWrap>

            <Hero>
              <HeroImg role="img" aria-label="베니스 운하 풍경" />
              <HeroText>
                연우님!<br />
                여행 기간을 같이 짜볼까요?
              </HeroText>
            </Hero>

            {/* 여행일자 선택 */}
            <WhiteCard>
              <Field onClick={() => setModalOpen(true)}>
                <FieldLabel>여행일자 / Date</FieldLabel>
                <Input
                  readOnly
                  placeholder="날짜 선택"
                  value={
                    range?.from && range?.to
                      ? `${fmt(range.from)} ~ ${fmt(range.to)} (${calcDays(range.from, range.to)}일)`
                      : ""
                  }
                />
                <RightIcon src={PlaneDepart} alt="calendar" />
              </Field>
            </WhiteCard>

            {/* 다음 버튼 */}
            <SearchWrap>
              <SearchBtn onClick={handleNext}>다음</SearchBtn>
            </SearchWrap>

            {/* 하단 네비 */}
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

      {/* 달력 모달 */}
      <CalendarModal
        open={modalOpen}
        range={range}
        nights={
          range?.from && range?.to
            ? Math.floor((toYMD(range.to) - toYMD(range.from)) / (1000 * 60 * 60 * 24))
            : 0
        }
        today={new Date()}
        disabled={{ before: new Date() }}
        hoverRange={null}
        onSelect={setRange}
        onHoverEnter={() => {}}
        onHoverLeave={() => {}}
        onClear={() => setRange(null)}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

/* ===== styled 부분 동일 ===== */
const Stage = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #f5f5f7;
`;
// ... (아래 styled-components는 그대로 두시면 됩니다)

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

const WhiteCard = styled.div`
  width: 100%;
  max-width: 340px;
  margin: 14px auto 40px;
  padding: 12px 10px 11px;
  border-radius: 12px;
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
  cursor: pointer;
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
`;
const Input = styled.input`
  flex: 1;
  border: 0;
  outline: 0;
  font-size: 15px;
  background: transparent;
`;
const RightIcon = styled.img`
  position: absolute;
  right: 10px;
  width: 22px;
  height: 22px;
`;

const SearchWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
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
  margin-top:0px;
`;

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
const Icon = styled.img`
  width: 22px; height: 22px;
  opacity: 0.8;
`;
