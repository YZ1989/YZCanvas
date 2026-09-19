import { runAitudouOperation } from "./aitudou";
import { parseAitudouWalletSummary } from "./aitudou-wallet";

export async function verifyJinyuKey(apiKey: string, signal?: AbortSignal) {
    const key = apiKey.trim();
    if (!key) throw new Error("请填写 Jinyu API Key。");
    const result = await runAitudouOperation({ apiKey: key }, "utility.wallet", {}, { signal });
    const wallet = parseAitudouWalletSummary(result.raw);
    if (!wallet) throw new Error("无法读取账户余额，请检查 API Key 后重试。");
    return wallet;
}
