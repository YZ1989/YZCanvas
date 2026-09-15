# YZCanvas

轻量 Windows AI 无限画布，用于图像编辑、图像生成与视频创作。

基于 [AICoderTudou/TDCanvas](https://github.com/AICoderTudou/TDCanvas) 二次开发，延续 **AGPL-3.0**。TDCanvas 原作者为 TDTV，并源自 `basketikun/infinite-canvas`。完整许可见 [LICENSE](LICENSE)。

## 当前版本

0.1.0 开发预览版：保留画布、图片工具、视频节点、素材与工程保存；移除 Agent 界面、ComfyUI 集成和远程节点插件执行链，使用独立的 YZCanvas 应用与存储标识。

Windows x64 安装包本机实测 **3.58 MiB**，比同机上游基线减少 **26.8%**；不含共享 WebView2 运行时和用户媒体。详见 [测量记录](docs/measurements/README.md)。

AI 生成默认接入 **[Jinyu API](https://api.yz-jinyu.com/)**；[接口文档](https://api.yz-jinyu.com/docs/)。生成按提供商实际计费。没有 API Key 也可以编辑画布、导入图片和使用本地裁剪等工具。远程生成尚待真实 API 验收。

## Windows 开发

需要 Node.js 22.12+、Rust stable、Visual Studio C++ Build Tools 和 WebView2。

```powershell
cd web
npm ci --legacy-peer-deps
npm run desktop:dev
```

浏览器界面调试：`npm run dev`，默认只监听 `127.0.0.1:3010`。浏览器预览不代替桌面的原生文件/网络验收。

## 构建与检查

```powershell
cd web
npm run typecheck
npm test
npm run desktop:package:windows
```

默认生成 Windows x64 NSIS 测试安装包，位于 `web/src-tauri/target/release/bundle/nsis/`（设置 `CARGO_TARGET_DIR` 时以该目录为准）。当前测试包没有 Windows 代码签名，也不启用自动更新。设备缺少 WebView2 时，安装程序按需联网安装运行时。

## 数据与兼容性

- 应用标识：`io.github.yz1989.yzcanvas`，与 TDCanvas 独立。
- 项目/上传素材：本地 WebView 数据库 `yzcanvas`。
- 生成媒体：`%LOCALAPPDATA%/io.github.yz1989.yzcanvas/media-cache`。
- API Key 仍沿用上游的本地配置存储方式，不随工程导出；请使用受信任设备。
- 保留 TDCanvas 工程交换格式；不支持的扩展节点保留原始数据并显示占位提示。
- 音频创建入口收起，原工程音频素材仍可读取。
- 首版不捆绑模型、Python、Node.js 运行时或 FFmpeg。

## 开发进度

参见 [实施记录](docs/YZCANVAS-DEVELOPMENT.md)、[体积测量](docs/measurements/README.md) 和 [后续任务](docs/content/docs/progress/todo.mdx)。

仓库其他历史文档与可选模块继承自 TDCanvas，可能描述 YZCanvas 已裁剪的能力；请以上述 YZCanvas 文档为准。
