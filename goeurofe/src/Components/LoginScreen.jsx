// src/Components/LoginScreen.jsx
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";

// 하단 네비 아이콘 (✋ 변경 없음)
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

/* Google Font: ADLaM Display 로드 */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=ADLaM+Display&display=swap');
  :root {
    --font-main: 'ADLaM Display', system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', sans-serif;
  }
`;

export default function LoginScreen() {
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
        {/* ✅ 배경이미지 없이, 빈 배경 */}
        <Screen>
          <Card>
            <CardBody>
              <Header>나의 정보</Header>

              <Form>
                {/* 이름 */}
                <Field>
                  <Label>이름</Label>
                  <Input type="text" />
                </Field>

                {/* 닉네임 */}
                <Field>
                  <Label>닉네임</Label>
                  <Input type="text" />
                </Field>

                {/* 전화번호 */}
                <Field>
                  <Label>전화번호</Label>
                  <Input type="tel" />
                  <RowCenter>
                    <ActionBtn type="button">인증하기</ActionBtn>
                  </RowCenter>
                </Field>

                {/* 이메일 */}
                <Field>
                  <Label>이메일</Label>
                  <Input type="email" />
                  <RowCenter>
                    <ActionBtn type="button">인증하기</ActionBtn>
                  </RowCenter>
                </Field>

                {/* 저장 */}
                <SaveWrap>
                  <SaveBtn type="button" >저장</SaveBtn>
                </SaveWrap>
              </Form>
            </CardBody>
          </Card>
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
  background: transparent; /* 배경 이미지 제거 */
`;

const Card = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 312px;
  min-height: 596px;
  border-radius: 12px;
  background: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const CardBody = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px 18px 22px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.h1`
  margin: 4px 0 10px;
  text-align: center;
  font-family: var(--font-main);
  color: #000;
  font-size: 30px;          /* 요청: 30px */
  font-weight: 400;         /* 요청: 400 */
  letter-spacing: 0;
  word-wrap: break-word;
`;

const Form = styled.form`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const Label = styled.label`
  font-family: var(--font-main);
  color: #000;
  font-size: 20px;          /* 요청: 폰트 사이즈 동일(20) */
  font-weight: 400;
  word-wrap: break-word;
`;

const Input = styled.input`
  width: 252px;  
  height: 44px;
  border: none;
  border-radius: 10px;
  background: #FAFAFA;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.25) inset;  /* 요청: 인셋 그림자 */
  padding: 0 12px;
  font-size: 16px;
  outline: none;
`;

const RowCenter = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionBtn = styled.button`
  margin-top: 2px;
  height: 34px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px #C9FF94 solid;                       /* 요청: 테두리 */
  background: #AEFF5D;                              /* 요청: 버튼 배경 */
  box-shadow: 2px 2px 4px rgba(0,0,0,0.25);         /* 요청: 일반 그림자 */
  cursor: pointer;

  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
`;

const SaveWrap = styled.div`
  margin-top: 2px;
  display: grid;
  place-items: center;
`;

const SaveBtn = styled(ActionBtn)`
  width: 150px;
  height: 38px;
  font-weight: 800;
`;

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
