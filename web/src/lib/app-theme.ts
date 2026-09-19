import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

const neutral = {
    light: {
        primary: "#803f38",
        primaryHover: "#66312c",
        primaryText: "#fff5e5",
        elevatedBg: "#fff5e5",
        itemHoverBg: "rgba(128, 63, 56, 0.06)",
        itemSelectedBg: "rgba(128, 63, 56, 0.1)",
        itemSelectedHoverBg: "rgba(128, 63, 56, 0.14)",
        itemText: "#302e28",
        tableSelectedBg: "rgba(17, 17, 17, 0.05)",
        tableSelectedHoverBg: "rgba(17, 17, 17, 0.08)",
    },
    dark: {
        primary: "#d6b98b",
        primaryHover: "#e4cda8",
        primaryText: "#28291f",
        elevatedBg: "#2c2e27",
        itemHoverBg: "rgba(255, 255, 255, 0.07)",
        itemSelectedBg: "rgba(255, 255, 255, 0.11)",
        itemSelectedHoverBg: "rgba(255, 255, 255, 0.15)",
        itemText: "#ece3d1",
        tableSelectedBg: "rgba(255, 255, 255, 0.08)",
        tableSelectedHoverBg: "rgba(255, 255, 255, 0.12)",
    },
};

export function getAntThemeConfig(dark: boolean): ThemeConfig {
    const color = dark ? neutral.dark : neutral.light;
    const highlight = dark ? "rgba(231,220,182,.13)" : "rgba(255,250,232,.9)";
    const shade = dark ? "rgba(0,0,0,.38)" : "rgba(87,58,31,.18)";
    const raised = `inset 0 1px 0 ${highlight}, 0 2px 0 ${shade}, 0 4px 7px ${shade}`;
    const elevated = `inset 0 1px 0 ${highlight}, 0 4px 0 ${shade}, 0 12px 30px ${shade}`;

    return {
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        cssVar: { key: dark ? "yzcanvas-dark" : "yzcanvas-light" },
        token: {
            colorBgBase: dark ? "#252720" : "#eee7d7",
            colorBgContainer: dark ? "#2c2e27" : "#f4edde",
            colorText: dark ? "#eee5d2" : "#302e28",
            colorTextSecondary: dark ? "#b9af9a" : "#6f6657",
            colorBorder: dark ? "#525345" : "#c5bba6",
            borderRadius: 7,
            boxShadow: elevated,
            boxShadowSecondary: elevated,
            fontFamily: '"Segoe UI", "Microsoft YaHei", system-ui, sans-serif',
            colorPrimary: color.primary,
            colorInfo: color.primary,
            colorLink: color.primary,
            colorLinkHover: color.primaryHover,
            colorLinkActive: color.primary,
            colorTextLightSolid: color.primaryText,
            colorBgElevated: color.elevatedBg,
            controlItemBgHover: color.itemHoverBg,
            controlItemBgActive: color.itemSelectedBg,
            controlItemBgActiveHover: color.itemSelectedHoverBg,
        },
        components: {
            Button: {
                primaryShadow: raised,
                defaultShadow: raised,
                defaultBg: dark ? "#34372d" : "#ede3cf",
                defaultBorderColor: dark ? "#71684e" : "#bda984",
            },
            Input: {
                activeShadow: `inset 0 1px 3px ${shade}, 0 0 0 2px ${color.itemSelectedBg}`,
            },
            Dropdown: {
                colorBgElevated: color.elevatedBg,
                colorText: color.itemText,
                controlItemBgHover: color.itemHoverBg,
                controlItemBgActive: color.itemSelectedBg,
                controlItemBgActiveHover: color.itemSelectedHoverBg,
            },
            Menu: {
                popupBg: color.elevatedBg,
                itemActiveBg: color.itemSelectedBg,
                itemHoverBg: color.itemHoverBg,
                itemSelectedBg: color.itemSelectedBg,
                itemSelectedColor: color.itemText,
                darkPopupBg: neutral.dark.elevatedBg,
                darkItemHoverBg: neutral.dark.itemHoverBg,
                darkItemSelectedBg: neutral.dark.itemSelectedBg,
                darkItemSelectedColor: neutral.dark.itemText,
            },
            Select: {
                optionActiveBg: color.itemHoverBg,
                optionSelectedBg: color.itemSelectedBg,
                optionSelectedColor: color.itemText,
            },
            Table: {
                rowSelectedBg: color.tableSelectedBg,
                rowSelectedHoverBg: color.tableSelectedHoverBg,
            },
        },
    };
}
