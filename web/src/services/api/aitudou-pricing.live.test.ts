import { describe, expect, it } from "vitest";
import { AITUDOU_PRICING_URL, formatAitudouPriceQuote, parseAitudouPricingCatalog, quoteAitudouPrice } from "./aitudou-pricing";
const live = process.env.JINYU_LIVE_PRICING === "1" ? describe : describe.skip;
live("Jinyu public pricing feed", () => {
    it("parses current image and video prices without inventing a price for sparse samples", async () => {
        const response = await fetch(AITUDOU_PRICING_URL, { headers: { Accept: "application/json" } });
        expect(response.ok).toBe(true);
        const raw = await response.json();
        expect(raw.success).toBe(true);
        const catalog = parseAitudouPricingCatalog(raw);
        expect(catalog.pricingVersion).not.toBe("");
        for (const [operation, model] of [
            ["image.generate", "jinyu-image-g2-t2i"],
            ["video.generate", "jinyu-video-gk-v15"],
            ["video.generate", "seedance-2.0-standard-t2v"],
        ]) {
            expect(raw.observed_prices[model] || raw.price_estimates[model]).toBeTruthy();
            const quote = quoteAitudouPrice(catalog, operation, { model, seconds: "5", metadata: { resolution: operation === "image.generate" ? "1k" : "720p" } });
            expect(quote.sku).toBe(model);
            expect(quote.currency).toBe("CNY");
            expect(["exact", "range", "rate", "dynamic"]).toContain(quote.status);
            if (quote.status === "exact") expect(quote.amount).toBeGreaterThan(0);
            if (quote.status === "range") {
                expect(quote.min).toBeGreaterThanOrEqual(0);
                expect(quote.max).toBeGreaterThanOrEqual(quote.min!);
            }
            if (quote.status === "dynamic") expect(quote.amount).toBeUndefined();
            expect(formatAitudouPriceQuote(quote)).not.toMatch(/NaN|Infinity/);
        }
    });
});
