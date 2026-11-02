import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCountdown } from "./use-countdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with initialCount and auto-starts by default", () => {
    const { result } = renderHook(() => useCountdown({ initialCount: 60 }));

    expect(result.current.count).toBe(60);
    expect(result.current.isRunning).toBe(true);
    expect(result.current.formattedTime).toBe("01:00");
  });

  it("decrements count every interval", () => {
    const { result } = renderHook(() => useCountdown({ initialCount: 5 }));

    expect(result.current.count).toBe(5);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.count).toBe(4);
    expect(result.current.formattedTime).toBe("00:04");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.count).toBe(2);
    expect(result.current.formattedTime).toBe("00:02");
  });

  it("stops and triggers onFinish when count reaches 0", () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() =>
      useCountdown({ initialCount: 2, onFinish }),
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.count).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.formattedTime).toBe("00:00");
    expect(onFinish).toHaveBeenCalledTimes(1);

    // Advancing further does not decrement below 0 or fire onFinish again
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.count).toBe(0);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("supports stop and start controls", () => {
    const { result } = renderHook(() => useCountdown({ initialCount: 10 }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.count).toBe(8);

    act(() => {
      result.current.stop();
    });
    expect(result.current.isRunning).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.count).toBe(8);

    act(() => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.count).toBe(7);
  });

  it("supports reset to initialCount or custom new count", () => {
    const { result } = renderHook(() => useCountdown({ initialCount: 30 }));

    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(result.current.count).toBe(20);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(30);
    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.reset(45);
    });
    expect(result.current.count).toBe(45);
    expect(result.current.formattedTime).toBe("00:45");
  });

  it("respects autoStart: false", () => {
    const { result } = renderHook(() =>
      useCountdown({ autoStart: false, initialCount: 15 }),
    );

    expect(result.current.count).toBe(15);
    expect(result.current.isRunning).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.count).toBe(15);

    act(() => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.count).toBe(14);
  });
});
