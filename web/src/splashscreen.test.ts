import { afterEach, expect, it, vi } from "vitest";

const invoke = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock("@tauri-apps/api/core", () => ({ invoke }));
vi.mock("@/lib/native-context-menu", () => ({ installNativeContextMenuGuard: vi.fn() }));

async function loadSplash(reducedMotion: boolean, desktop = true) {
    vi.useFakeTimers();
    vi.resetModules();
    vi.stubGlobal("localStorage", { getItem: () => '{"state":{"theme":"light"}}' });
    const element = { dataset: {} as Record<string, string>, classList: { add: vi.fn() } };
    vi.stubGlobal("document", { documentElement: element });
    vi.stubGlobal("window", {
        ...(desktop ? { __TAURI_INTERNALS__: {} } : {}),
        matchMedia: () => ({ matches: reducedMotion }),
        setTimeout, clearTimeout, addEventListener: vi.fn(),
    });
    await import("./splashscreen");
    return element;
}

afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
});

it("reports native readiness once after the 900 ms entrance and restores the theme", async () => {
    const element = await loadSplash(false);
    expect(element.dataset.theme).toBe("light");
    await vi.advanceTimersByTimeAsync(899);
    expect(invoke).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(invoke).toHaveBeenCalledWith("splash_animation_complete");
    await vi.advanceTimersByTimeAsync(5000);
    expect(invoke).toHaveBeenCalledTimes(1);
});

it("does not make reduced-motion users wait for the normal entrance", async () => {
    await loadSplash(true);
    await vi.advanceTimersByTimeAsync(120);
    expect(invoke).toHaveBeenCalledTimes(1);
});

it("finishes the browser preview without attempting a native command", async () => {
    const element = await loadSplash(false, false);
    await vi.advanceTimersByTimeAsync(900);
    expect(element.classList.add).toHaveBeenCalledWith("splash-complete");
    expect(invoke).not.toHaveBeenCalled();
});
