// src/components/PhoneMockup.jsx
import React from "react";
import styled from "styled-components";

/* util: number면 px 붙여줌 */
const toCss = (v, fb) => (v == null ? fb : typeof v === "number" ? `${v}px` : v);

/* 프레임 */
const PhoneFrame = styled.div`
  position: relative;
  flex-shrink: 0;
  overflow: hidden;

  width: ${(p) => toCss(p.$width, "412.373px")};
  height: ${(p) => toCss(p.$height, "894px")};
  aspect-ratio: ${(p) => p.$ratio || "125 / 271"};

  border: ${(p) => `${p.$strokeWidth ?? 1}px solid ${p.$borderColor || "#000"}`};
  border-radius: ${(p) => toCss(p.$radius, "36px")};
  box-shadow: 0 12px 28px rgba(0,0,0,0.18);

  /* 배경: src가 있으면 이미지, 없으면 배경색(transparent 허용) */
  background: ${(p) =>
    p.$src ? `url(${p.$src}) 50% / cover no-repeat` : p.$bgColor ?? "transparent"};
`;

/* 노치 */
const Notch = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 96px;
  height: 22px;
  border-radius: 999px;
  background: ${(p) =>
    p.$theme === "dark" ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.85)"};
  box-shadow: ${(p) =>
    p.$theme === "dark"
      ? "inset 0 0 0 1px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.25)"
      : "inset 0 0 0 1px rgba(0,0,0,0.15)"};
  pointer-events: none;
  z-index: 2;
`;

/* 스피커(슬릿) */
const Speaker = styled.div`
  position: absolute;
  top: ${(p) => toCss(p.$sy, "12px")};
  left: 50%;
  transform: translateX(-50%);
  width: ${(p) => toCss(p.$sw, "64px")};
  height: ${(p) => toCss(p.$sh, "6px")};
  border-radius: 999px;
  background: rgba(0,0,0,0.9);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.25);
  pointer-events: none;
  z-index: 3;
`;

/* 카메라 점 */
const CameraDot = styled.div`
  position: absolute;
  top: ${(p) => toCss(p.$cy, "12px")};
  left: 50%;
  transform: translateX(${(p) => toCss(p.$cx, "40px")}); /* +: 우측, -: 좌측 */
  width: ${(p) => toCss(p.$size, "10px")};
  height: ${(p) => toCss(p.$size, "10px")};
  border-radius: 50%;

  pointer-events: none;
  z-index: 3;
`;

/* 안전 영역(선택) — 기본 padding: 0, 포인터 비활성 */
const SafeArea = styled.div`
  position: absolute;
  inset: 0;
  padding: ${(p) => toCss(p.$padding, "0")};
  display: grid;
  grid-template-rows: auto 1fr auto;
  pointer-events: ${(p) => (p.$pointer ? "auto" : "none")};
`;

export default function PhoneMockup({
  /* 프레임 */
  width,
  height,
  ratio = "125 / 271",
  radius = "36px",
  borderColor = "#000",
  strokeWidth = 1,

  /* 배경 */
  src,                      // 배경 이미지 URL (선택)
  bgColor = "transparent",  // 이미지 없을 때 배경색(transparent면 내부가 그대로 보임)

  /* 노치 & 센서 오버레이 */
  notch = true,
  notchTheme = "dark",      // 'dark' | 'light'
  showSpeaker = true,
  showCamera = true,
  speakerY = 12,
  speakerWidth = 64,
  speakerHeight = 6,
  cameraOffsetX = 40,       // 가운데 기준 +우측 / -좌측 (px)
  cameraY = 12,
  cameraSize = 10,

  /* 자식 감싸기 모드 */
  wrapOnly = true,          // true면 children 그대로(=“씌우기만”). false면 SafeArea로 감쌈
  safePadding = 0,          // wrapOnly=false일 때 SafeArea 패딩
  contentPointer = false,   // SafeArea 클릭 허용 여부

  children,
  className,
}) {
  return (
    <PhoneFrame
      className={className}
      $width={width}
      $height={height}
      $ratio={ratio}
      $radius={radius}
      $borderColor={borderColor}
      $strokeWidth={strokeWidth}
      $src={src}
      $bgColor={bgColor}
      role="img"
      aria-label="Phone mockup"
    >
      {notch && (
        <>
          <Notch $theme={notchTheme} />
          {showSpeaker && (
            <Speaker $sy={speakerY} $sw={speakerWidth} $sh={speakerHeight} />
          )}
          {showCamera && (
            <CameraDot $cx={cameraOffsetX} $cy={cameraY} $size={cameraSize} />
          )}
        </>
      )}

      {wrapOnly ? children : (
        <SafeArea $padding={safePadding} $pointer={contentPointer}>
          {children}
        </SafeArea>
      )}
    </PhoneFrame>
  );
}
