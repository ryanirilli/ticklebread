import React, { useEffect, useRef, useState } from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import bodymovin from "lottie-web";
import useMousePosition from "../components/hooks/use-mouseposition";
import animationData from "../lottie/bread-laughing.json";

const GlobalStyle = createGlobalStyle`
  body {
    background: #e45ef5;
  }
  body,html {
    margin: 0;
    padding: 0;
}
* {
    box-sizing: border-box;
}
`;

const fullPageHeight = css`
  height: 100%;
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

const BreadAnimationContainer = styled.div`
  > svg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
`;

const Index = () => {
  const animationRef = useRef();
  const audioRef = useRef();
  const svgRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [animation, setAnimation] = useState(null);
  const [YTouchOrigin, setYTouchOrigin] = useState(0);
  const [YDiff, setYDiff] = useState(0);
  const [XTouchOrigin, setXTouchOrigin] = useState(0);
  const [XDiff, setXDiff] = useState(0);
  const [x, y, bind] = useMousePosition();

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

  useEffect(() => {
    if (!animation) {
      return;
    }
    svgRef.current = animationRef.current.getElementsByTagName("svg")[0];
  }, [animation]);

  useEffect(() => {
    setYDiff(y - YTouchOrigin);
  }, [y, YTouchOrigin]);

  useEffect(() => {
    setXDiff(x - XTouchOrigin);
  }, [x, XTouchOrigin]);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }
    svgRef.current.style.transform = `translateX(${XDiff}px) translateY(${YDiff}px) translateZ(0)`;
  }, [YDiff, XDiff]);

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

  const onTouchStart = ({ touches }) => {
    play();
    setYTouchOrigin(touches[0].clientY);
    setXTouchOrigin(touches[0].clientX);
  };

  const onTouchEnd = ({ touches }) => {
    pause();
  };

  return (
    <>
      <GlobalStyle />
      <Flex centered fullPageHeight>
        <BreadAnimationContainer
          YDiff={YDiff}
          XDiff={XDiff}
          ref={animationRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          {...bind}
        />
      </Flex>
      <audio loop ref={audioRef} src="/static/audio/laughter.mp3" />
    </>
  );
};

export default Index;
