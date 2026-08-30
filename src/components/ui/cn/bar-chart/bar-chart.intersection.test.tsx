import { act, render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type * as EChartsModule from "@/lib/echarts";

const state = vi.hoisted(() => ({ options: [] as Array<{ option: { animation?: boolean; series?: unknown[] } }> }));

vi.mock("@/lib/echarts", async () => {
  const actual = await vi.importActual<typeof EChartsModule>("@/lib/echarts");
  return {
    ...actual,
    EChartsContainer: (props: { option: { animation?: boolean; series?: unknown[] } }) => {
      state.options.push(props);
      return React.createElement("div", { "data-testid": "chart" });
    },
  };
});

import { BarChart } from "./BarChart";

describe("BarChart intersection animation", () => {
  let triggerIntersection: ((entry: Partial<IntersectionObserverEntry>) => void) | undefined;
  let observerMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    state.options.length = 0;
    observerMock = vi.fn().mockImplementation((callback: IntersectionObserverCallback) => {
      triggerIntersection = (entry) =>
        callback(
          [{ isIntersecting: Boolean(entry.isIntersecting) } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      return { observe: vi.fn(), disconnect: vi.fn() };
    });
    vi.stubGlobal("IntersectionObserver", observerMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    triggerIntersection = undefined;
  });

  it("starts collapsed and reveals the values after entering the viewport", () => {
    render(<BarChart data={[{ label: "A", value: 10 }]} animate />);

    expect(observerMock).toHaveBeenCalledOnce();
    expect((state.options[0].option.series?.[0] as { data: Array<{ value: number }> }).data[0].value).toBe(0);

    act(() => {
      triggerIntersection?.({ isIntersecting: true });
    });

    const lastOption = state.options.at(-1)?.option;
    expect((lastOption?.series?.[0] as { data: Array<{ value: number }> }).data[0].value).toBe(10);
    expect(lastOption?.animation).toBe(true);
  });
});
