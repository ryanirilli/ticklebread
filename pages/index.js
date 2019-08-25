import React, { useEffect, useRef, useState } from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import bodymovin from "lottie-web";
import animationData from "../lottie/ticklebread-v1-data.json";

const GlobalStyle = createGlobalStyle`
  body {
    background: #e45ef5;
  }
`;

const fullPageHeight = css`
  height: 100vh;
`;

const Flex = styled.div`
  display: flex;
  ${p =>
    p.centered &&
    css`
      justify-content: center;
      align-items: center;
    `}
  ${p => p.fullPageHeight && fullPageHeight}
`;

const Index = () => {
  const animationRef = useRef();
  const audioRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [animation, setAnimation] = useState(null);
  useEffect(() => {
    setAnimation(
      bodymovin.loadAnimation({
        container: animationRef.current,
        renderer: "svg",
        loop: true,
        autoplay: false,
        animationData
      })
    );
  }, []);

  const play = () => {
    animation.play();
    audioRef.current.play();
    setIsPlaying(true);
  };
  const pause = () => {
    animation.pause();
    audioRef.current.pause();
    setIsPlaying(false);
  };
  const toggle = () => {
    if (isPlaying) {
      return pause();
    }
    play();
  };

  return (
    <>
      <GlobalStyle />
      <Flex centered fullPageHeight>
        <div
          onClick={toggle}
          onMouseEnter={play}
          onMouseLeave={pause}
          ref={animationRef}
        />
      </Flex>
      <audio loop ref={audioRef} src="/static/audio/laughter.mp3" />
    </>
  );
};

export default Index;
