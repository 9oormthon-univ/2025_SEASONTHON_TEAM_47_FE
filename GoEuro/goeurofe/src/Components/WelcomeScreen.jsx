import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import BeachBg from "../assets/Image1.png";
import Animation from "../style/Animation.js";

// 컴파운드 PhoneMockup
import PhoneMockup from "../Frame/PhoneMockup";

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const DURATION = 2000; // 전체 대기
    const FADE_MS  = 400;  // 마지막 페이드 시간

    const fadeTimer = setTimeout(() => setLeaving(true), DURATION - FADE_MS);
    const navTimer  = setTimeout(() => {
      navigate("/myrocalendar", { replace: true });
    }, DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

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
          {/* ✅ 폰 '안쪽'만 부드럽게 사라지도록 Screen 자체에 트랜지션 적용 */}
          <FadingScreen $leaving={leaving}>
            <Animation delay="0.5s">
              <Title>Go Euro!</Title>
            </Animation>
            <Animation delay="0.8s">
              <Subtitle>Trip only for you!</Subtitle>
            </Animation>
          </FadingScreen>
        </PhoneMockup>
      </Stage>
    </>
  );
}

/* 가운데 배치용(선택) */
const Stage = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #f5f5f7;
`;

/* 원래 쓰던 화면 */
const Screen = styled.section`
  position: relative;
  width: 375px; height: 851px; margin: 0 auto;
  background-image: url(${BeachBg});
  background-size: cover; background-position: center;
  overflow: hidden;
`;

/* 👇 Screen 자체를 확장해서 '안쪽 화면만' 페이드/이동 */
const FadingScreen = styled(Screen)`
  opacity: ${(p) => (p.$leaving ? 0 : 1)};
  transform: ${(p) => (p.$leaving ? "translateY(6px) scale(0.995)" : "translateY(0) scale(1)")};
  transition: opacity 400ms ease, transform 400ms ease;
  will-change: opacity, transform;

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 400ms linear;
    transform: none;
  }
`;

const Title = styled.h1`
  position: absolute;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-family: "Grandstander", cursive;
  font-size: 46px;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
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
`;
