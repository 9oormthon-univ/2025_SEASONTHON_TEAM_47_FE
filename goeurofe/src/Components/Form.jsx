// src/Components/LoginScreen.jsx
import React, { useMemo, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";
import { useNavigate } from "react-router-dom";

// 하단 네비 아이콘 (✋ 변경 없음)
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

/* Google Font */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=ADLaM+Display&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Grandstander:opsz,wght@8..60,400;700&display=swap');

  :root {
    --font-main: 'ADLaM Display', system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', sans-serif;
    --font-terms: 'Do Hyeon', 'Noto Sans KR', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }

  /* 옵션: 필요 시 사용 가능 */
  .grandstander {
    font-family: "Grandstander", cursive;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }
`;

export default function LoginScreen() {
  const navigate = useNavigate();

  // 체크 상태
  const [tos, setTos] = useState(false);        // 서비스 이용약관(필수)
  const [privacy, setPrivacy] = useState(false); // 개인정보 처리방침(필수)
  const [mkt, setMkt] = useState(false);         // 마케팅 정보 수신(선택)

  // 전체 동의 = 모든 항목 체크
  const allItemsChecked = useMemo(() => tos && privacy && mkt, [tos, privacy, mkt]);
  const toggleAll = () => {
    const next = !allItemsChecked;
    setTos(next);
    setPrivacy(next);
    setMkt(next);
  };

  // 모두 체크돼야 진행 가능 (요구사항)
  const canProceed = allItemsChecked;
  const handleProceed = () => {
    if (!canProceed) return;
    navigate("/dayplan");
  };

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
        {/* ✅ 흰 카드 없이 바로 컨텐츠 */}
        <Screen>
          {/* 상단 브랜드 */}
          <BrandBar>
            <Brand>
              <BrandGo>Go</BrandGo> <BrandEuro>Euro</BrandEuro>
            </Brand>
          </BrandBar>

          <TermsWrap>
            <Title>약관 동의</Title>
            <Subtitle>서비스 이용을 위해 다음에 동의해주세요</Subtitle>

            <List>
              {/* 전체 동의 */}
              <Item>
                <Check type="checkbox" checked={allItemsChecked} onChange={toggleAll} />
                <ItemText>전체 동의</ItemText>
              </Item>

              {/* 개별 항목 */}
              <Item>
                <Check type="checkbox" checked={tos} onChange={(e) => setTos(e.target.checked)} />
                <ItemText>서비스 이용약관(필수)</ItemText>
              </Item>

              <Item>
                <Check type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
                <ItemText>개인정보 처리방침(필수)</ItemText>
              </Item>

              <Item>
                <Check type="checkbox" checked={mkt} onChange={(e) => setMkt(e.target.checked)} />
                <ItemText>마케팅 정보 수신(선택)</ItemText>
              </Item>
            </List>

            <ProceedWrap>
              <ProceedBtn type="button" disabled={!canProceed} onClick={handleProceed}>
                동의하고 계속하기
              </ProceedBtn>
            </ProceedWrap>
          </TermsWrap>
        </Screen>

        {/* ✅ 하단 네비게이션 (그대로) */}
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
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  padding: 10px 12px 0; /* 프레임 내부 여백 */
`;

/* 상단 브랜드 */
const BrandBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;  /* 좌측 정렬 */
  margin-bottom: 6px;
`;

const Brand = styled.h1`
  margin: 0;
  font-family: "ADLaM Display", system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', sans-serif;
  font-size: 35px;   /* 요청값 */
  font-weight: 400;  /* 요청값 */
  line-height: normal;
`;

const BrandGo = styled.span`
  color: #000;       /* 요청값 */
`;

const BrandEuro = styled.span`
  color: #82E417;    /* 요청값 */
`;

/* 약관 영역 */
const TermsWrap = styled.div`
  width: 100%;
  height: calc(100% - 46px); /* 브랜드 높이 제외 감안 */
  display: flex;
  flex-direction: column;
  align-items: center;    /* 가운데 정렬 */
  overflow: auto;
  padding: 6px 6px 24px;
`;

const Title = styled.h2`
  margin: 2px 50px 20px;
  text-align: center;
  font-family: var(--font-terms);
  color: #000;
  font-size: 30px;   /* 요청값 */
  font-weight: 400;
  line-height: normal;
   margin-top:40px;
`;

const Subtitle = styled.p`
  margin: 0 0 18px;
  text-align: center;           /* 요청: 텍스트 중앙 정렬 */
  font-family: var(--font-terms);
  color: #666;                  /* 요청값 */
  font-size: 17px;              /* 요청값 */
  font-weight: 400;
  line-height: 20px;            /* 요청값 */
  letter-spacing: -0.23px;      /* 요청값 */
  margin-top:0px;
  margin-right:30px;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
`;

const Item = styled.label`
  display: grid;
  grid-template-columns: 30px 1fr; /* 체크 30px 고정 */
  align-items: center;
  margin-left:10px;
  padding:20px;
  gap: 10px;
`;

const ItemText = styled.span`
  font-family: var(--font-terms);
  color: #000;
  font-size: 23px;           /* 요청값 */
  font-weight: 400;          /* 요청값 */
  line-height: 20px;         /* 요청값 */
  letter-spacing: -0.23px;   /* 요청값 */
  text-align: left;
`;

/* 커스텀 체크박스: 30x30, 흰 배경 + 1px 반투명 테두리 */
const Check = styled.input`
  appearance: none;
  width: 30px;
  height: 30px;
  aspect-ratio: 1 / 1;                    /* 요청값 */
  background: #fff;                       /* fill: #FFF */
  border: 1px solid rgba(0, 0, 0, 0.5);   /* stroke */
  border-radius: 6px;
  display: grid;
  place-items: center;
  cursor: pointer;
  position: relative;
  outline: none;

  /* 체크 표시 (갈고리) */
  &::after {
    content: "";
    width: 10px;
    height: 18px;
    border-right: 3px solid #1a1a1a;
    border-bottom: 3px solid #1a1a1a;
    transform: rotate(45deg) scale(0);
    transform-origin: center;
    transition: transform 120ms ease-in-out;
  }

  &:checked::after {
    transform: rotate(45deg) scale(1);
  }
`;

const ProceedWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  margin-top: 22px;
`;

const ProceedBtn = styled.button`
  border-radius: 10px;                   /* 요청값 */
  border: 1px solid #C9FF94;             /* 요청값 */
  background: #AEFF5D;                   /* 요청값 */
  box-shadow: 2px 2px 4px rgba(0,0,0,0.25); /* 요청값 */
  width: 248.344px;                      /* 요청값 */
  height: 53.846px;                      /* 요청값 */
  flex-shrink: 0;

  font-family: var(--font-terms);
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    filter: grayscale(0.2);
    cursor: not-allowed;
  }
`;

/* ===== 하단 네비 (그대로) ===== */
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
