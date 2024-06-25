import { useRef, useEffect } from "react";

// https://zhuanlan.zhihu.com/p/272243370
export const useAnimationFrame = (callback: () => void, running: boolean) => {
  const savedCallback = useRef(callback); // 传进来的callback
  const requestId = useRef(0); // 当前正在执行的requestId

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
      if (running) {
        // 当running为true时，才启动下一个，并拿到最新的requestId
        requestId.current = window.requestAnimationFrame(tick);
      }
    }
    if (running) {
      requestId.current = window.requestAnimationFrame(tick);

      return () => window.cancelAnimationFrame(requestId.current);
    }
  }, [running]);
};
