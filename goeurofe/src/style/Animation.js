// src/components/Animation.jsx
import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  opacity: 0;
  display: ${({ inline }) => (inline ? "inline-block" : "block")}; 
  animation: ${fadeIn} 0.8s ease forwards;
  animation-delay: ${({ delay }) => delay || "0.5s"};
`;

export default function Animation({ children, delay, inline = false }) {
  return (
    <Wrapper delay={delay} inline={inline}>
      {children}
    </Wrapper>
  );
}
