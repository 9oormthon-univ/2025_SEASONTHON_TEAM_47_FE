// src/Components/HomeLanding.jsx
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import PhoneMockup from "../Frame/PhoneMockup";
import { useNavigate } from "react-router-dom";

/* 배경 */
import BeachBg from "../assets/Image1.png";

/* 하단 네비 아이콘 */
import IconHome from "../assets/icons/home.png";
import IconCalendar from "../assets/icons/calendar.png";
import IconProfile from "../assets/icons/profile.png";

/* 회색 버튼 내부 아이콘 (파일명/경로는 프로젝트 자산에 맞게 교체) */
import IcDoc from "../assets/icons/page.png";
import IcExit from "../assets/icons/Door .png";

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; }
`;

export default function HomeLanding() {
  const navigate = useNavigate();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const goNext = () => {
    // 별점 매기기 버튼 동작이 필요하면 여기에 로직 추가 (또는 navigate)
    // navigate("/main2");
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
                00님!
                <br />
                GoEuro와 함께 즐거운 여행 보내세요!
              </HeroText>
            </Hero>

            {/* 회색 버튼 두 개 */}
            <WhiteCard>
              <GrayButton type="button" aria-label="약관 보기(동작 없음)">
                <GrayButtonText>약관 보기</GrayButtonText>
                <RightSquareIcon src={IcDoc} alt="" />
              </GrayButton>

              <GrayButton
                type="button"
                aria-label="회원 탈퇴하기"
                onClick={() => setShowWithdrawModal(true)}
              >
                <GrayButtonText>회원 탈퇴하기</GrayButtonText>
                <RightSquareIcon src={IcExit} alt="" />
              </GrayButton>
            </WhiteCard>

            {/* 별점 매기기 버튼 */}
            <SearchWrap>
              <SearchBtn onClick={goNext}>별점 매기기</SearchBtn>
            </SearchWrap>

            {/* 탈퇴 모달 */}
            {showWithdrawModal && (
              <ModalBackdrop onClick={() => setShowWithdrawModal(false)}>
                <ModalBox
                  role="dialog"
                  aria-modal="true"
                  aria-label="회원 탈퇴 확인"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ModalTitle>
                    GoEuro와 함께라면 좋을텐데...
                    <br />
                    정말 탈퇴하시겠어요🥺
                  </ModalTitle>

                  <ModalButtons>
                    <StayBtn onClick={() => setShowWithdrawModal(false)}>
                      남아있기
                    </StayBtn>
                    <LeaveBtn
                      onClick={() => {
                        // 실제 탈퇴 로직 연결 위치
                        setShowWithdrawModal(false);
                      }}
                    >
                      탈퇴하기
                    </LeaveBtn>
                  </ModalButtons>
                </ModalBox>
              </ModalBackdrop>
            )}

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
    </>
  );
}

/* ===== styled ===== */
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
  overflow-y: auto;           /* 콘텐츠 늘어날 때 대비 */
  background: #fff;
  padding-bottom: 90px;       /* 하단 네비 여유 */
`;

const LogoWrap = styled.div`
  position: absolute;
  left: 16px;
  top: calc(env(safe-area-inset-top, 0px) + 60px);
  z-index: 3;
`;
const Logo = styled.h1`
  margin: 0;
  font-family: "ADLaM Display", system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', sans-serif;
  font-size: 35px;
  font-weight: 400;
  line-height: normal;
  .go { color: #000; }
  .euro { color: #FFE057; }
`;

/* 히어로 */
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
  left: 16px;
  right: 16px;
  bottom: 18px;
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
  text-align: left;
`;

/* 흰 배경 래핑 영역 (실제로는 투명, 이름만 WhiteCard) */
const WhiteCard = styled.div`
  width: 100%;
  max-width: 340px;
  margin: 14px auto 6px;
  display: grid;
  gap: 10px;
`;

/* 회색 버튼 공통 */
const GrayButton = styled.button`
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  border: 2px solid #cfcfcf;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 44px 0 14px;    /* 오른쪽 아이콘 공간 확보 */
  cursor: pointer;
`;
const GrayButtonText = styled.span`
  font-size: 15px;
  color: #111;
  text-align: left;
`;
const RightSquareIcon = styled.img`
  position: absolute;
  right: 10px;
  width: 26px;
  height: 26px;
  object-fit: contain;
  pointer-events: none;
`;

/* 큰 노란 버튼 */
const SearchWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  margin-top: 12px;
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
`;

/* 모달 */
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  display: grid;
  place-items: center;
  z-index: 10;
`;
const ModalBox = styled.div`
  width: 362px;
  height: 181px;
  aspect-ratio: 2/1;
  border-radius: 10px;
  border: 3px solid #FFE057;
  background: #FFF;
  padding: 16px 16px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ModalTitle = styled.div`
  font-weight: 800;
  font-size: 18px;
  line-height: 1.35;
  color: #111;
`;
const ModalButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
const StayBtn = styled.button`
  height: 42px;
  border-radius: 8px;
  border: 0;
  background: #FFE057;
  font-weight: 800;
  color: #111;
  cursor: pointer;
`;
const LeaveBtn = styled.button`
  height: 42px;
  border-radius: 8px;
  border: 0;
  background: #E9E9E9;
  font-weight: 800;
  color: #444;
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
const Icon = styled.img`
  width: 22px; height: 22px;
  object-fit: contain;
  opacity: 0.8;
`;
