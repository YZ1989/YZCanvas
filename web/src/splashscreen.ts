import { invoke } from "@tauri-apps/api/core";
import { installNativeContextMenuGuard } from "@/lib/native-context-menu";
import "./styles/splashscreen.css";

installNativeContextMenuGuard();
try {
    const saved = JSON.parse(localStorage.getItem("yzcanvas:theme_store") || "{}");
    document.documentElement.dataset.theme = saved.state?.theme === "light" ? "light" : "dark";
} catch {
    document.documentElement.dataset.theme = "dark";
}

// A single CSS entrance; no particle canvas or perpetual animation loop.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const timer = window.setTimeout(
    () => {
        document.documentElement.classList.add("splash-complete");
        if ("__TAURI_INTERNALS__" in window) void invoke("splash_animation_complete").catch(() => undefined);
    },
    reducedMotion ? 120 : 900,
);
window.addEventListener("pagehide", () => window.clearTimeout(timer), { once: true });
