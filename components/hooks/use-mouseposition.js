import * as React from "react";

const useMousePosition = () => {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  const bind = {
    onMouseMove: ({ nativeEvent: { offsetX, offsetY } }) => {
      //   setX(offsetX);
      //   setY(offsetY);
    },
    onTouchMove: ({ changedTouches }) => {
      const { screenX, screenY } = changedTouches[0];
      setX(screenX);
      setY(screenY);
    }
  };

  return [x, y, bind];
};

export default useMousePosition;
