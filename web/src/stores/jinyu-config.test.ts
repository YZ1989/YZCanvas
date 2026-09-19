import { describe, expect, it, vi } from "vitest";
vi.hoisted(() => {
    const values = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: {
            getItem: (key: string) => values.get(key) ?? null,
            setItem: (key: string, value: string) => values.set(key, value),
            removeItem: (key: string) => values.delete(key),
        },
    });
    Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage } });
});
import { CONFIG_STORE_KEY, defaultConfig, useConfigStore } from "./use-config-store";

describe("Jinyu credential boundary", () => {
    it("does not hydrate a different provider's key into Jinyu requests", () => {
        const previous = { ...defaultConfig, baseUrl: "https://old-provider.example", apiKey: "old-provider-key", channels: [] };
        const restored = useConfigStore.persist.getOptions().merge!({ config: previous }, useConfigStore.getState());
        expect(restored.config.apiKey).toBe("");
        expect(restored.config.channels[0].apiKey).toBe("");
        expect(restored.config.baseUrl).toBe("https://api.yz-jinyu.com");
        expect(CONFIG_STORE_KEY).not.toBe("yzcanvas:ai_config_store");
    });

    it("restores a key saved for the Jinyu host", () => {
        const saved = { ...defaultConfig, apiKey: "jinyu-test-key", channels: [] };
        const restored = useConfigStore.persist.getOptions().merge!({ config: saved }, useConfigStore.getState());
        expect(restored.config.apiKey).toBe("jinyu-test-key");
        expect(restored.config.channels[0].apiKey).toBe("jinyu-test-key");
    });
});

it("clears credentials from all derived channels when logging out", () => {
    const original = useConfigStore.getState().config;
    try {
        useConfigStore.getState().updateConfig("apiKey", "test-session-key");
        useConfigStore.getState().updateConfig("apiKey", "");
        expect(useConfigStore.getState().config.apiKey).toBe("");
        expect(useConfigStore.getState().config.channels.every((channel) => !channel.apiKey)).toBe(true);
    } finally {
        useConfigStore.setState({ config: original });
    }
});
