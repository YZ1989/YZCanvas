import { App, Popover, theme } from "antd";
import { BookOpen, ChevronRight, ChevronUp, ExternalLink, LogOut, RefreshCw, Settings2, UserRound, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useJinyuAccount } from "@/hooks/use-jinyu-account";
import { formatAitudouWalletAmount } from "@/services/api/aitudou-wallet";
import { useConfigStore } from "@/stores/use-config-store";
import { JINYU_API_BASE_URL, JINYU_DOCS_URL } from "@/constant/provider";

export function AccountMenu({ embedded = false }: { embedded?: boolean }) {
    const { token } = theme.useToken();
    const { message } = App.useApp();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const account = useJinyuAccount();
    const openConfigDialog = useConfigStore((state) => state.openConfigDialog);
    const updateConfig = useConfigStore((state) => state.updateConfig);
    const inCanvas = /^\/canvas\/[^/]+/.test(pathname);
    const status = account.connected ? "已登录 · Jinyu API" : account.hasKey ? (account.isFetching ? "正在验证…" : "连接失败，请检查设置") : "登录后开始 AI 创作";
    const settings = () => {
        setOpen(false);
        openConfigDialog(false);
    };
    useEffect(() => {
        setOpen(false);
    }, [pathname]);
    useEffect(() => {
        if (!open) return;
        const escape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", escape);
        return () => window.removeEventListener("keydown", escape);
    }, [open]);
    const external = (docs: boolean, event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!("__TAURI_INTERNALS__" in window)) return;
        event.preventDefault();
        void invoke("open_jinyu_page", { docs }).catch(() => message.error("打开页面失败，请稍后重试。"));
    };
    const row = "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2";
    return (
        <div className={embedded ? "yz-sidebar-account" : `fixed left-3 z-[60] ${inCanvas ? "bottom-16" : "bottom-3"}`} data-canvas-no-zoom>
            <Popover
                trigger="click"
                placement="topLeft"
                open={open}
                onOpenChange={setOpen}
                arrow={false}
                content={
                    <section aria-label="账户面板" className="w-[320px] max-w-[calc(100vw-48px)] max-h-[calc(100dvh-160px)] overflow-y-auto p-2" style={{ color: token.colorText }}>
                        <div className="flex items-center gap-3 px-2 pb-5 pt-2">
                            <img src="/logo.svg" className="size-11 rounded-xl" alt="" />
                            <div>
                                <div className="text-base font-semibold">YZCanvas</div>
                                <div className="mt-1 text-xs" style={{ color: token.colorTextSecondary }}>
                                    {status}
                                </div>
                            </div>
                        </div>
                        {account.hasKey ? (
                            <div className="mb-3 rounded-xl border p-4" style={{ borderColor: token.colorBorder, background: token.colorFillAlter }}>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2">
                                        <Wallet className="size-4" />
                                        账户钱包余额
                                    </span>
                                    <button type="button" aria-label="刷新余额" disabled={account.isFetching} onClick={() => void account.refetch()} className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-40">
                                        <RefreshCw className={`size-3.5 ${account.isFetching ? "animate-spin" : ""}`} />
                                    </button>
                                </div>
                                <div className="my-4 flex items-baseline gap-2">
                                    <strong className="text-3xl font-semibold tabular-nums">{account.connected && account.data ? formatAitudouWalletAmount(account.data.amount) : "—"}</strong>
                                    <span className="text-xs" style={{ color: token.colorTextSecondary }}>
                                        {account.connected && account.data && ["USD", "CNY", "EUR", "HKD"].includes(account.data.currency) ? account.data.currency : ""}
                                    </span>
                                </div>
                                {account.isError ? (
                                    <p role="alert" className="mb-3 text-xs" style={{ color: token.colorError }}>
                                        验证未通过或服务暂不可用，请刷新或在设置中更换 Key。
                                    </p>
                                ) : null}
                                <a className="flex items-center justify-between text-xs" style={{ color: token.colorLink }} href={JINYU_API_BASE_URL} target="_blank" rel="noopener noreferrer" onClick={(event) => external(false, event)}>
                                    前往 Jinyu 控制台充值
                                    <ExternalLink className="size-3.5" />
                                </a>
                            </div>
                        ) : (
                            <div className="mb-3 rounded-xl border p-4" style={{ borderColor: token.colorBorder, background: token.colorFillAlter }}>
                                <p className="mb-3 text-xs leading-5" style={{ color: token.colorTextSecondary }}>
                                    使用 Jinyu API Key 登录，连接图像与视频创作服务。
                                </p>
                                <button type="button" onClick={settings} className="w-full rounded-lg px-3 py-2.5 text-sm font-medium" style={{ background: token.colorPrimary, color: token.colorTextLightSolid }}>
                                    登录 / 连接 API
                                </button>
                            </div>
                        )}
                        <div className="rounded-xl border" style={{ borderColor: token.colorBorder }}>
                            <a className={row} href={JINYU_DOCS_URL} target="_blank" rel="noopener noreferrer" onClick={(event) => external(true, event)}>
                                <BookOpen className="size-4" />
                                <span className="flex-1">
                                    <span className="block text-sm">使用文档</span>
                                    <span className="mt-1 block text-xs" style={{ color: token.colorTextSecondary }}>
                                        Jinyu 模型与接口说明
                                    </span>
                                </span>
                                <ExternalLink className="size-3.5" />
                            </a>
                            <button type="button" onClick={settings} className={row}>
                                <Settings2 className="size-4" />
                                <span className="flex-1">
                                    <span className="block text-sm">设置</span>
                                    <span className="mt-1 block text-xs" style={{ color: token.colorTextSecondary }}>
                                        填写或更换 API Key
                                    </span>
                                </span>
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                        {account.hasKey ? (
                            <button
                                type="button"
                                className={`${row} mt-3`}
                                style={{ color: token.colorError }}
                                onClick={() => {
                                    updateConfig("apiKey", "");
                                    setOpen(false);
                                    message.success("已退出登录，本地画布与素材保留。");
                                }}
                            >
                                <LogOut className="size-4" />
                                <span className="text-sm">退出登录</span>
                            </button>
                        ) : null}
                    </section>
                }
            >
                <button
                    type="button"
                    aria-label="账户与登录"
                    aria-expanded={open}
                    title={status}
                    className={`yz-account-trigger flex items-center rounded-xl text-left ${embedded ? "h-16 w-full gap-3 px-2" : inCanvas ? "size-10 justify-center border shadow-sm" : "h-14 w-[196px] gap-3 px-3 border shadow-sm"}`}
                    style={{ background: embedded ? "transparent" : token.colorBgElevated, borderColor: token.colorBorderSecondary, color: token.colorText }}
                >
                    <UserRound className="size-5 shrink-0" style={{ color: account.connected ? token.colorPrimary : token.colorTextSecondary }} />
                    <span className={inCanvas ? "sr-only" : "min-w-0 flex-1"}>
                        <span className="block text-sm font-medium">{account.connected ? "Jinyu 账户" : "登录"}</span>
                        <span className="mt-0.5 block truncate text-[11px]" style={{ color: token.colorTextSecondary }}>
                            {status}
                        </span>
                    </span>
                    {!inCanvas ? <ChevronUp className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} /> : null}
                </button>
            </Popover>
        </div>
    );
}
