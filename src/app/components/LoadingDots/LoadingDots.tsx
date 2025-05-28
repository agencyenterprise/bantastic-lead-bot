import React, { useEffect, useState } from 'react';

const LoadingDots: React.FC = () => {
  const [dotCount, setDotCount] = useState(1);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 1));
    }, 400);
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => {
      clearInterval(dotInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <span>
      {'.'.repeat(dotCount)}
      <span style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.2s' }}>|</span>
    </span>
  );
};

export default LoadingDots; 