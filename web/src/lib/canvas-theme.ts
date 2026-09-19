export type CanvasColorTheme = "light" | "dark";
export type CanvasBackgroundMode = "dots" | "lines" | "blank";

export const canvasThemes = {
    light: {
        canvas: {
            background: "#eee7d7",
            dot: "rgba(68,64,60,.28)",
            line: "rgba(68,64,60,.12)",
            selectionStroke: "#803f38",
            selectionFill: "rgba(128,63,56,.08)",
        },
        node: {
            label: "#665e50",
            fill: "#e3dac8",
            panel: "#f5efdf",
            stroke: "#c5bba6",
            activeStroke: "#803f38",
            placeholder: "#8a8479",
            text: "#302e28",
            muted: "#736959",
            faint: "#a8a29e",
        },
        toolbar: {
            panel: "rgba(245,239,223,.96)",
            shadow: "inset 0 1px 0 #fff8e9, 0 3px 0 #bdad91, 0 8px 18px rgba(78,52,29,.18)",
            border: "#c5bba6",
            item: "#665e50",
            itemHover: "#e3dac8",
            activeBg: "#e3dac8",
            activeText: "#302e28",
        },
    },
    dark: {
        canvas: {
            background: "#23251f",
            dot: "rgba(255,255,255,.13)",
            line: "rgba(255,255,255,.06)",
            selectionStroke: "#eee5d2",
            selectionFill: "rgba(244,244,245,.08)",
        },
        node: {
            label: "#d6cbb5",
            fill: "#30332a",
            panel: "#282b23",
            stroke: "#525345",
            activeStroke: "#eee5d2",
            placeholder: "#a19989",
            text: "#eee5d2",
            muted: "#b9af9a",
            faint: "#6f7479",
        },
        toolbar: {
            panel: "rgba(40,43,35,.96)",
            shadow: "inset 0 1px 0 #565847, 0 3px 0 #11160e, 0 8px 18px rgba(0,0,0,.38)",
            border: "#525345",
            item: "#d6cbb5",
            itemHover: "#36392f",
            activeBg: "#414337",
            activeText: "#eee5d2",
        },
    },
} as const;

export type CanvasTheme = (typeof canvasThemes)[CanvasColorTheme];
