# YZCanvas 开发记录

## 当前范围

Windows 轻量桌面 Fork，基线 TDCanvas `16b31273633f983cdbd8de05694ec36d471b2650`。保留原有画布与数据格式，不迁移到 React Flow 或 SQLite。

## 已实现

- 独立产品名称 YZCanvas、应用标识 `io.github.yz1989.yzcanvas`、本地存储命名空间。
- 从布局、导航、画布和入口解除 Agent、ComfyUI 和远程节点插件执行链。
- 移除不再使用的 Agent/ComfyUI 前端、插件加载器和脚本编辑器代码。
- 移除 Pro Components、Streamdown 和 CodeMirror 等依赖；保留 Ant Design 与图片编辑组件。
- 取消提示词订阅的默认后台调度；保留素材与提示词浏览功能。
- 收起新建音频入口；保留旧项目音频读取和视频音轨。
- 视频节点仅预载元数据；沿用视口裁剪。
- Windows 构建配置加入 LTO、体积优化与符号裁剪；输出 NSIS 安装包。
- 修复上游 npm lockfile 不完整导致 `npm ci` 失败的问题。

## 验证记录

- TypeScript 类型检查通过。
- 裁剪后已有测试 281 项通过、2 项跳过；跳过的在线接口测试不计为已验收。
- 浏览器实际操作：新建画布、输入中文文本、导入 PNG、1:1 裁剪生成新节点、撤销、重做、刷新后恢复文字与两张图片，均已验证。
- 原版 Windows NSIS 已成功构建，基线数据见 `measurements/upstream-baseline.json`。
- YZCanvas Windows x64 NSIS 构建成功，安装包 3,750,394 字节（约 3.58 MiB），较基线减少 26.9%；记录见 `measurements/yzcanvas.json`。
- 完整桌面交互、真实 API 生成、长时间运行和大量媒体压力测试仍需进一步验收。

## 已知边界

- AI 配置已切换至 Jinyu API；详见 [接入说明](JINYU-API.md)，尚未开放任意 Base URL。
- 当前不改变上游的本地 Key 存储机制；后续应独立评估凭据存储。
- 安装包未做 Windows 代码签名，未启用自动更新。
- 不支持的扩展节点只能保留/导出，不能执行。
- 旧的根目录 `canvas-agent`、`modules`、`plugins` 暂保留为上游参考，不进入 YZCanvas 桌面构建；不应按目录大小估算安装包收益。

## 构建复现

本次 Windows 本机使用 Node 25.8.2、Rust 1.98.1。CI 使用 Node 22 与 Rust stable。常规命令见根 README；Cargo 缓存可以复用，但最终结果只比较 Release 安装包和产物。

后续阶段依次为：真实生成验收 → 通用渠道与模型能力 → 图片修改工具完善 → 大媒体内存和缓存管理。
