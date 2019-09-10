import React, { useEffect, useRef, useState } from "react";
import styled, { css, createGlobalStyle } from "styled-components";
import throttle from "lodash.throttle";
import bodymovin from "lottie-web";
import animationData from "../lottie/bread-laughing.json";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap');
  body {
    font-family: 'Roboto', sans-serif;
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

const TPMContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 12px;
  color: #f0c9f5;
  border: 1px solid #f0c9f5;
  border-radius: 4px;
  z-index: 1;
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
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [tickles, setTickles] = useState(0);
  const tickleCount = useRef(0);
  const throttledDiff = useRef(
    throttle((xDiff, yDiff) => {
      console.log(tickleCount.current);
      setTickles(tickleCount.current);
      tickleCount.current = 0;
      window.navigator.vibrate(5);
    }, 1000)
  );

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
  }, [y]);

  useEffect(() => {
    setXDiff(x - XTouchOrigin);
  }, [x]);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }
    svgRef.current.style.transform = `translateX(${XDiff}px) translateY(${YDiff}px) translateZ(0)`;
    tickleCount.current++;
    throttledDiff.current(XDiff, YDiff);
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
    setYTouchOrigin(touches[0].clientY);
    setXTouchOrigin(touches[0].clientX);
    play();
  };

  const onTouchMove = ({ changedTouches }) => {
    const { clientX, clientY } = changedTouches[0];
    setX(clientX);
    setY(clientY);
  };

  const onTouchEnd = () => {
    setX(0);
    setY(0);
    setYTouchOrigin(0);
    setXTouchOrigin(0);
    setTickles(0);
    pause();
  };

  return (
    <>
      <GlobalStyle />
      <TPMContainer>tickles per minute: {tickles}</TPMContainer>
      <Flex centered fullPageHeight>
        <BreadAnimationContainer
          YDiff={YDiff}
          XDiff={XDiff}
          ref={animationRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      </Flex>
      <audio loop ref={audioRef} src="/static/audio/laughter.mp3" />
    </>
  );
};

export default Index;
