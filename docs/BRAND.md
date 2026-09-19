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

## 验证

类型检查与 3 项启动流程测试通过；浏览器检查了启动页布局。Windows 安装包构建成功，并从实际生成的 exe 中提取图标，确认是新 YZ 标识。桌面启动交互、快捷方式及 Windows 图标缓存表现仍待安装验收。

## 英伦电影档案馆工作台

经用户确认采用暖纸色与酒红配色，标题「光影有迹，想象无界。」；以宋体标题、轻纸纹与摄影器材静物呈现复古影像工作室氛围。保留真实项目数据，不写入效果图示例项目。

资源均在本地加载：

| 资源 | 尺寸 | 字节 | 用途 |
| --- | --- | --- | --- |
| web/public/brand/film-atelier.webp | 1199×740 | 140930 | 摄影机、胶片与场记板静物 |
| web/public/brand/atelier-paper.webp | 512×512 | 3388 | 低对比纸纹 |
| web/public/brand/film-edge.webp | 24×288 | 2846 | 项目缩略图胶片边缘 |
| web/public/fonts/atelier-serif.ttf | 标题文字字集 | 12584 | Noto Serif SC 700 |

以上三张位图由内置 Image Gen 生成，再压缩为 WebP。生成方向：英式窗光、米色亚麻、苔绿墙、旧橡木桌上的复古摄影机/胶片/场记板，文艺复兴明暗质感；纸纹平整、细腻且无污渍；胶片边框平面正视、深棕与象牙色。旧 corgi 工作台插画已移除。

标题字体来自 Google Fonts 的 Noto Serif SC，按静态标题文字取字集，OFL 许可证位于 web/public/fonts/OFL-NotoSerifSC.txt；其他文字使用系统字体。新增运行时资源约 157KB，无第三方运行时依赖。

web/public/brand/logo-atelier.svg 从既有 YZ SVG 重新配色为墨绿与旧黄铜，用于应用界面。安装程序图标与启动页沿用既有资源，本轮没有重新打包。
