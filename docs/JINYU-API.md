# Jinyu API 接入

- 服务地址：https://api.yz-jinyu.com
- 接口文档：https://api.yz-jinyu.com/docs/
- 设置页填写该站 API Key，使用 `Authorization: Bearer` 认证。
- 文生视频 / 图生视频：`POST /v1/videos`；轮询 `GET /v1/videos/{task_id}`，读取 `metadata.url`。
- 图像生成 / 参考图编辑：`POST /v1/image/generations`；轮询同路径加任务 ID，读取返回的图片结果。
- 参考素材上传：`POST /v1/files/upload`，multipart 文件上传。
- 余额：`GET /api/usage/wallet/`；公开价格：`GET /api/pricing`。

请求、Vite 本地代理、Tauri HTTP 允许列表及控制台入口均指向 Jinyu。桌面设置页可以打开控制台和文档。

已有模型目录中的服务专属名称按文档改为 `jinyu-image-*`、`jinyu-video-*` 和 `jinyu-upscaler`。此轮迁移现有能力，尚未覆盖文档新增的全部模型、3D 和 MiniMax H3 V2 接口。

## 数据边界

新密钥保存于独立配置项 `yzcanvas:jinyu_config_store`，旧土豆密钥不会自动搬到新域名。历史画布和素材保留；旧服务专属模型需要重新选择，旧服务任务不能在 Jinyu 恢复。

内部 `aitudou` 文件名、类型与项目标签暂作协议兼容标识，不表示请求发往旧服务。价格来源为 Jinyu 的公开价格清单；样本不足时保留动态计费提示，最终以服务端结算为准。

## 验证范围

已验证文档中的主要请求协议、公开价格接口与解析、模拟提交/轮询/上传、配置密钥隔离。未使用真实密钥调用付费生成接口；真实图像与视频生成仍需用户验收。

类型检查通过；285 项测试通过（含只读在线价格检查），1 项原有测试跳过。浏览器已确认设置页的新站链接，本地代理成功返回 Jinyu 价格数据。

Windows x64 NSIS 测试包已重新构建（3,758,159 字节）；校验值见 `measurements/yzcanvas.json`。

## 当前模型目录更新

目录现有 132 个协议模型条目，包含图像、视频、音频、文本与工具模型；界面合并文生/图生传输变体，不等同于 132 个独立模型选项。恢复此前隐藏的 Kling、Vidu、Wan、HappyHorse 分组，新增 G v2.5 三款、Grok 2 编辑及两款 Omni 低价视频。Grok 2 文生图更新为最多 12 张输出。

来源：[官方模型和参数文档](https://api.yz-jinyu.com/docs/llms.txt)。新增模型复用已接入的图像/视频异步协议，顶层 resolution/aspect_ratio 由请求适配器处理。MiniMax H3 V2、图层拆分和分割/区域编辑仍需独立的协议与交互接入；未宣称覆盖全部服务端模型。

开发阶段默认只更新源码和预览，不自动打包；安装包仅在用户要求时重新生成。
