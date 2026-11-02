import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useOnlineStatus } from "./use-online-status";

describe("useOnlineStatus", () => {
  it("returns initial online status from navigator", () => {
    const { result } = renderHook(() => useOnlineStatus());
    expect(typeof result.current.isOnline).toBe("boolean");
    expect(result.current.isOffline).toBe(!result.current.isOnline);
  });

  it("updates status on online and offline window events", () => {
    const { result } = renderHook(() => useOnlineStatus());

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });
});
