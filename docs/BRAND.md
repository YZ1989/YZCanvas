# YZCanvas 视觉标识

图标以 YZ 字母与画布四角构成。青绿至浅蓝的笔画置于深色底板上；不使用外部字体、位图纹理或远程资源。

- 矢量源：`web/src-tauri/icons/app-icon.svg`。
- 应用、网页、文档站：共用 `logo.svg`。
- 程序图标：用 Tauri icon 命令生成 ICO、PNG、ICNS 及 Windows 各尺寸图标。
- 启动动画：图标轻微旋转归位，标题淡入，装饰线展开，总计 0.9 秒，无循环粒子绘制。
- 系统减少动态效果时关闭 CSS 动画，120 毫秒后通知原生层；主窗口仍需等待项目数据就绪，并保留原生超时兜底。

0.1.1 预览版同时包含此前的 Jinyu API 接入。

## 重新生成图标

在 `web` 目录运行 `npx tauri icon src-tauri/icons/app-icon.svg`。该命令还可能生成暂未使用的移动端图标；Windows 包使用 Tauri 配置中列出的桌面图标。
