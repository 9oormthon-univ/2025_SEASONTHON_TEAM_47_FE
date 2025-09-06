// src/Components/WelcomeScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";
import BeachBg from "../assets/Image1.png";
import KakaoLoginBtn from "../assets/kakaobtn.png";
import { useNavigate } from "react-router-dom"; // ⬅️ 추가
const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function WelcomeScreen() {
  const [showModal, setShowModal] = useState(false); // 2초 뒤 모달 on
  const [devBtnH, setDevBtnH] = useState(56);       // 개발자 모드 버튼 높이(카카오 버튼과 동일)
  const kakaoImgRef = useRef(null);
const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleKakaoLogin = () => {
    // TODO: 실제 카카오 로그인 링크 연결
    // window.location.href = link;
    console.log("카카오 로그인!");
  };

  const handleDevMode = () => {
    // TODO: 개발자 모드 라우팅/동작 연결
    console.log("개발자 모드!");
    alert("개발자 모드 진입 (더미)");
  };

  // 카카오 버튼 이미지 높이를 읽어 개발자 버튼에 동일 적용
  const onKakaoImgLoad = () => {
    const h = kakaoImgRef.current?.clientHeight || 56;
    setDevBtnH(h);
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
          notch={true}
        >
          <Screen>
            {/* 타이틀들 */}
            <Title>Go Euro!</Title>
            <Subtitle>Trip only for you!</Subtitle>

            {/* 2초 뒤에 어두워지고, 모달 노출 */}
            <Overlay $show={showModal} />
            <ModalWrap $show={showModal}>
              <ButtonsStack>
                <KakaoBtn onClick={handleKakaoLogin} aria-label="카카오 간편 로그인">
                  <img
                    ref={kakaoImgRef}
                    src={KakaoLoginBtn}
                    alt="카카오 간편 로그인"
                    onLoad={onKakaoImgLoad}
                  />
                </KakaoBtn>

                {/* ⬇️ 추가: 카카오 버튼과 동일 너비/높이 */}
               <DevBtn type="button" aria-label="개발자 모드" style={{ height: devBtnH }} onClick={() => navigate("/main1")}>
                개발자 모드
               </DevBtn>
              </ButtonsStack>
            </ModalWrap>
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
  background: url(${BeachBg}) no-repeat center/cover;
  overflow: hidden;
  border-radius: 30px;
`;

/* 텍스트 색 요구사항 반영 */
const Title = styled.h1`
  position: absolute;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-family: "Grandstander", cursive;
  font-size: 46px;
  font-weight: 800;
  color: #ffffff; /* ✅ 흰색 */
  text-shadow: 2px 2px 4px rgba(0,0,0,0.25);
  white-space: nowrap;
`;

const Subtitle = styled.p`
  position: absolute;
  top: 350px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-family: "Grandstander", cursive;
  font-size: 20px;
  font-weight: 400;
  color: #000000; /* ✅ 검은색 */
`;

/* 어두운 오버레이 (2초 후 점점 나타남) */
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  opacity: ${(p) => (p.$show ? 1 : 0)};
  transition: opacity 1500ms ease;
  pointer-events: none; /* 배경 클릭 막지 않음, 모달만 클릭 가능 */
`;

/* 모달 래퍼: 중앙 하단 쪽에 살짝 떠 있게 */
const popIn = keyframes`
  from { transform: translate(-50%, 20px) scale(0.98); opacity: 0; }
  to   { transform: translate(-50%, 0) scale(1); opacity: 1; }
`;

const ModalWrap = styled.div`
  position: absolute;
  left: 50%;
  bottom: 200px;
  transform: translateX(-50%);
  display: ${(p) => (p.$show ? "block" : "none")};
  animation: ${popIn} 220ms ease forwards;
`;

/* 세로 스택 */
const ButtonsStack = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
`;

/* 카카오 버튼 (이미지 사용) */
const KakaoBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 280px;
    height: auto;
    display: block;
  }
`;

/* ✅ 개발자 모드 버튼: 카카오 버튼과 동일 너비/높이 */
const DevBtn = styled.button`
  width: 280px;               /* 카카오와 동일 너비 */
  /* 높이는 inline style로 동기화됨(style={{height: devBtnH}}) */
  border: none;
  border-radius: 12px;
  background: #222;           /* 눈에 잘 띄게 진한 배경 */
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2px;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);

  &:active {
    transform: translateY(1px);
  }
`;
