import { beforeEach, describe, expect, it, vi } from "vitest";
import { runAitudouOperation } from "./aitudou";
import { verifyJinyuKey } from "./jinyu-account";
vi.mock("./aitudou", () => ({ runAitudouOperation: vi.fn() }));
const request = vi.mocked(runAitudouOperation);
describe("Jinyu API key login", () => {
    beforeEach(() => {
        request.mockReset();
    });
    it("rejects an empty key without sending a request", async () => {
        await expect(verifyJinyuKey("  ")).rejects.toThrow("请填写");
        expect(request).not.toHaveBeenCalled();
    });
    it("accepts a verified zero-balance wallet and forwards cancellation", async () => {
        request.mockResolvedValue({ raw: { code: true, data: { object: "wallet_balance", amount: 0, display_type: "USD" } } } as never);
        const signal = new AbortController().signal;
        await expect(verifyJinyuKey(" test-key ", signal)).resolves.toMatchObject({ amount: 0 });
        expect(request).toHaveBeenCalledWith({ apiKey: "test-key" }, "utility.wallet", {}, { signal });
    });
    it("does not accept an unrelated successful response as login", async () => {
        request.mockResolvedValue({ raw: { success: true } } as never);
        await expect(verifyJinyuKey("test-key")).rejects.toThrow("无法读取");
    });
    it("rejects invalid keys instead of returning a logged-in account", async () => {
        request.mockRejectedValue(new Error("Unauthorized"));
        await expect(verifyJinyuKey("invalid-key")).rejects.toThrow("Unauthorized");
    });
});
