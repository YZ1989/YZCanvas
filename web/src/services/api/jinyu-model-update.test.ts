import { describe, expect, it } from "vitest";
import { getAitudouOperation } from "./aitudou-contract";
import { prepareAitudouPayload, validateAitudouPayload } from "./aitudou";
import { changeAitudouNativeModel, createAitudouNativePayload, EMPTY_AITUDOU_NATIVE_REFERENCE_COUNTS, aitudouNativeParameterDefinitions } from "@/components/canvas/aitudou-native-generation";

const config = { apiKey: "test-only" };
describe("Jinyu updated model contracts", () => {
    it.each(["flare", "sunburst", "lowprice"])("submits G v2.5 %s resolution at the top level", async (variant) => {
        const model = `jinyu-image-g-v2.5-${variant}`;
        const payload = await prepareAitudouPayload(config, getAitudouOperation("image.generate"), { model, prompt: "测试图像", n: 1, size: "16:9", metadata: { resolution: "2k" } }, []);
        expect(payload.resolution).toBe("2k");
        expect(payload.metadata).not.toHaveProperty("resolution");
        expect(() => validateAitudouPayload(getAitudouOperation("image.generate"), payload)).not.toThrow();
        const fields = aitudouNativeParameterDefinitions("image.generate", { model });
        expect(fields.some(field => field.path === "quality")).toBe(variant !== "lowprice");
    });
    it("validates Grok edit references and translated aspect ratio", async () => {
        const op = getAitudouOperation("image.generate");
        const payload = await prepareAitudouPayload(config, op, { model: "jinyu-image-gk-v2-edit", prompt: "编辑图像", images: ["https://example.com/a.png"], metadata: { resolution: "1k", ratio: "auto" } }, []);
        expect(payload).toMatchObject({ resolution: "1k", aspect_ratio: "auto" });
        expect(() => validateAitudouPayload(op, payload)).not.toThrow();
        expect(() => validateAitudouPayload(op, { ...payload, images: [] })).toThrow();
        expect(() => validateAitudouPayload(op, { ...payload, resolution: "4k" })).toThrow();
    });
    it.each(["jinyu-video-g-omni-flash-lowprice", "jinyu-video-g-omni-1.1-flash-lowprice"])("adapts %s references and rejects two images", (model) => {
        const counts = { ...EMPTY_AITUDOU_NATIVE_REFERENCE_COUNTS, video: 1 };
        const payload = changeAitudouNativeModel("video.generate", createAitudouNativePayload("video.generate"), model, counts);
        expect(payload).not.toHaveProperty("seconds");
        expect(payload.metadata).toMatchObject({ video_url: "@Video 1" });
        expect(() => validateAitudouPayload(getAitudouOperation("video.generate"), { model, prompt: "测试视频", images: ["a", "b"] })).toThrow("0、1 或 3");
    });
});
