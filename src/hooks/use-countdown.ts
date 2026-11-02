import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCountdownOptions {
  /**
   * Whether to automatically start the timer on mount.
   * @default true
   */
  autoStart?: boolean;
  /**
   * The starting count value (e.g. 60 seconds).
   */
  initialCount: number;
  /**
   * Timer interval in milliseconds.
   * @default 1000
   */
  intervalMs?: number;
  /**
   * Callback fired when countdown reaches zero.
   */
  onFinish?: () => void;
}

export interface UseCountdownReturn {
  count: number;
  formattedTime: string;
  isRunning: boolean;
  reset: (newCount?: number) => void;
  start: () => void;
  stop: () => void;
}

export const useCountdown = ({
  autoStart = true,
  initialCount,
  intervalMs = 1000,
  onFinish,
}: UseCountdownOptions): UseCountdownReturn => {
  const [count, setCount] = useState(initialCount);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (newCount?: number) => {
      setIsRunning(autoStart);
      setCount(newCount !== undefined ? newCount : initialCount);
    },
    [autoStart, initialCount],
  );

  useEffect(() => {
    if (!isRunning || count <= 0) {
      if (count <= 0 && isRunning) {
        setIsRunning(false);
        onFinishRef.current?.();
      }
      return;
    }

    const timerId = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          setIsRunning(false);
          onFinishRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, intervalMs);

    return () => clearInterval(timerId);
  }, [isRunning, count, intervalMs]);

  const minutes = Math.floor(count / 60);
  const seconds = count % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    count,
    formattedTime,
    isRunning,
    reset,
    start,
    stop,
  };
};

export default useCountdown;
