import { act, renderHook } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { useNavigateWithParams } from "./use-navigate-with-params";

const createWrapper = (initialEntry: string) => {
  return function RouterWrapper({ children }: PropsWithChildren) {
    return (
      <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
    );
  };
};

describe("useNavigateWithParams", () => {
  it("preserves existing query parameters when navigating to a new path", () => {
    const wrapper = createWrapper(
      "/login?clientId=posme&redirectUri=%2Fcallback",
    );

    let currentLocation = { pathname: "", search: "" };
    const { result } = renderHook(
      () => {
        const nav = useNavigateWithParams();
        const location = useLocation();
        currentLocation = location;
        return nav;
      },
      { wrapper },
    );

    act(() => {
      result.current.push("/verify");
    });

    expect(currentLocation.pathname).toBe("/verify");
    expect(currentLocation.search).toBe(
      "?clientId=posme&redirectUri=%2Fcallback",
    );
  });

  it("merges new query parameters with existing ones", () => {
    const wrapper = createWrapper("/login?clientId=posme");

    let currentLocation = { pathname: "", search: "" };
    const { result } = renderHook(
      () => {
        const nav = useNavigateWithParams();
        const location = useLocation();
        currentLocation = location;
        return nav;
      },
      { wrapper },
    );

    act(() => {
      result.current.push("/verify", { step: 2, state: "active" });
    });

    expect(currentLocation.pathname).toBe("/verify");
    const params = new URLSearchParams(currentLocation.search);
    expect(params.get("clientId")).toBe("posme");
    expect(params.get("step")).toBe("2");
    expect(params.get("state")).toBe("active");
  });

  it("removes query parameters when passed undefined, null, or empty string", () => {
    const wrapper = createWrapper("/step-2?token=abc&expired=true&keep=yes");

    let currentLocation = { pathname: "", search: "" };
    const { result } = renderHook(
      () => {
        const nav = useNavigateWithParams();
        const location = useLocation();
        currentLocation = location;
        return nav;
      },
      { wrapper },
    );

    act(() => {
      result.current.push("/step-3", {
        token: null,
        expired: undefined,
        removeMe: "",
      });
    });

    const params = new URLSearchParams(currentLocation.search);
    expect(params.get("keep")).toBe("yes");
    expect(params.has("token")).toBe(false);
    expect(params.has("expired")).toBe(false);
    expect(params.has("removeMe")).toBe(false);
  });

  it("clears existing query parameters when clearExisting is true", () => {
    const wrapper = createWrapper("/login?oldParam=123&token=abc");

    let currentLocation = { pathname: "", search: "" };
    const { result } = renderHook(
      () => {
        const nav = useNavigateWithParams();
        const location = useLocation();
        currentLocation = location;
        return nav;
      },
      { wrapper },
    );

    act(() => {
      result.current.push(
        "/dashboard",
        { newParam: "fresh" },
        { clearExisting: true },
      );
    });

    expect(currentLocation.pathname).toBe("/dashboard");
    expect(currentLocation.search).toBe("?newParam=fresh");
  });

  it("supports replace navigation", () => {
    const wrapper = createWrapper("/login?clientId=posme");

    let currentLocation = { pathname: "", search: "" };
    const { result } = renderHook(
      () => {
        const nav = useNavigateWithParams();
        const location = useLocation();
        currentLocation = location;
        return nav;
      },
      { wrapper },
    );

    act(() => {
      result.current.replace("/sign-in", { redirect: "true" });
    });

    expect(currentLocation.pathname).toBe("/sign-in");
    const params = new URLSearchParams(currentLocation.search);
    expect(params.get("clientId")).toBe("posme");
    expect(params.get("redirect")).toBe("true");
  });

  it("provides backward-compatible pushWithParam and replaceWithParam aliases", () => {
    const wrapper = createWrapper("/login?clientId=posme");

    let currentLocation = { pathname: "", search: "" };
    const { result } = renderHook(
      () => {
        const nav = useNavigateWithParams();
        const location = useLocation();
        currentLocation = location;
        return nav;
      },
      { wrapper },
    );

    expect(typeof result.current.pushWithParam).toBe("function");
    expect(typeof result.current.replaceWithParam).toBe("function");

    act(() => {
      result.current.pushWithParam("/sign-up", { ref: "invite" });
    });

    expect(currentLocation.pathname).toBe("/sign-up");
    const params = new URLSearchParams(currentLocation.search);
    expect(params.get("clientId")).toBe("posme");
    expect(params.get("ref")).toBe("invite");
  });
});
