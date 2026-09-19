# YZCanvas 英伦复古工作台：设计验收

final result: passed

## Source / capture

- 视觉基准：C:/Users/37896/.codex/generated_images/01a0a6a7-7fc4-7820-8672-e90710bafd0c/exec-beb6b438-cf68-4d34-a982-744a50f0731f.png（用户明确选定的融合版）。
- 实现：http://127.0.0.1:3010/canvas
- 实现截图：D:/AI/Codex/research/yzcanvas-retro-ui/desktop.png
- 完整对照：D:/AI/Codex/research/yzcanvas-retro-ui/comparison-final.jpg
- 标题与插画局部对照：D:/AI/Codex/research/yzcanvas-retro-ui/hero-comparison.jpg
- 浏览器 CSS viewport / 截图：1431×1103，截图 1× 密度。原始生成图为 1429×1101，对照时只缩放至 1431×1103（约 0.14%），没有浏览器外框。
- 状态：浅色、中文、画布首页、账户已连接。效果图有两个虚构项目；实现展示用户现有的一个真实项目及五个节点，这属于真实数据约束，不为追求截图一致创建示例业务数据。

## Findings / comparison history

1. P2：首轮纸纹使用 multiply 后偏黄，背景采样为 (224,209,180)，参考为 (239,231,215)。调整浅色叠加方式及底色，最终采样 (240,232,213)。证据 comparison-v1.jpg → comparison-final.jpg。
2. P2：系统宋体标题字重与字号弱于选定稿。增加 12,584 字节的本地 Noto Serif SC 700 标题字集，标题提升为 80px、列表标题 40px，正文仍用系统字体。证据 desktop-v1.png → hero-comparison.jpg。
3. P2：首次深色纸纹 soft-light 使背景过亮。深色单独使用 multiply，最终 dark.png 已复查，标题、导航、账户、搜索保持可读。
4. 当前没有待修复的 P0/P1/P2。

## Required fidelity surfaces

- 字体：主标题两行、字重和宋体衬线与目标接近；正文与操作使用系统字体确保可读。英文标识和动态项目名使用系统 serif 回退。无运行时远程字体请求。
- 排版：232px 导航、48px 主内容左边距，左标题右静物、细线分区、胶片项目卡，底部账号固定于侧栏。最终完整与局部对照已打开检查。主图与分区约 12–20px 的竖向差异属于 P3；参考里的示例照片没有写入真实项目。
- 颜色：暖白纸色、酒红按钮、棕色文字、低饱和苔绿预览；统一 Ant Design 弹层与编辑器基础 token。深色使用深墨绿、象牙文字和旧黄铜。
- 图片：已单独生成并放置摄影机静物、纸纹、胶片边缘，WebP 总共 147,164 字节。真实项目节点预览沿用已有 SVG 数据视图，并非用代码伪造参考插画。既有 YZ 矢量标识只重新配色。
- 文案：主标题、副标题与确认稿一致。保留真实 Jinyu 登录/余额逻辑；装饰英文改为与产品匹配的 THE ART OF IMAGINATION，不使用虚构机构名。

## Interactions / responsive evidence

- 搜索不存在的关键词出现空状态，点击清空恢复项目；卡片菜单可进入重命名并取消。
- 账户弹层、设置入口、设置关闭正常；没有修改密钥、退出登录或执行充值。截图 account.png / settings.png。
- 资产导航正常；assets.png。
- 在 localhost:3010 的独立存储中测试新建项目 → 编辑器 → 主页；原 127.0.0.1 用户项目未改动。editor.png 为编辑器证据。
- medium.png：1000×800；narrow.png：390×844。检查主内容 scrollWidth 等于 clientWidth，无横向溢出；窄屏侧栏保留图标与账户，内容纵向滚动。
- dark.png：复查后的暗色工作台。
- 浏览器错误日志为空；现有测试 298 passed / 2 skipped。没有运行构建或安装包制作。

## Implementation checklist

- [x] 所有新资源在仓库内、本地加载，旧工作台插画移除。
- [x] 标题、导航、账户、菜单与基础编辑器主题统一。
- [x] 功能导航、搜索、卡片菜单、新建/打开/返回路径有效。
- [x] 桌面、窄屏与深浅主题检查。
- [x] 逐项检查字体、排版、颜色、图片与文案。

## Follow-up polish / remaining scope

- P3：动态项目标题用系统 serif，部分设备的字形会略有不同。
- Windows 原生标题栏、安装版本和系统 125%/150% 缩放仍待原生环境验收；本次仅更新开发预览。
- 本轮未重新设计安装图标与启动页，也未测试付费生成。

## 项目卡片标注调整

- 依据：用户标注要求缩小项目卡片并增加立体动效；此要求覆盖先前效果图中的卡片尺寸。
- 改动：最大宽度 450px → 320px，保持原比例；1000px 透视、悬停抬升 7px、X/Y 轴各约 4° 倾斜与柔和阴影，按下回落。键盘焦点仅轻微抬升，触屏不启用悬停动画，减少动态效果时不应用位移/倾斜/缩放。
- 浏览器证据：D:/AI/Codex/research/yzcanvas-retro-ui/cards-small.png 与 cards-hover.png，1252×1005；封面含边框宽度 320px、内部宽度 310px；读取悬停状态确认 matrix3d 和双层阴影已生效。
- 窄屏证据：cards-narrow.png，390×844；主区 clientWidth/scrollWidth 均为 303px，无横向溢出。
- 选择/取消选择正常；没有更改项目内容。本次仅 CSS 和文档调整，没有新增依赖、运行构建或重跑业务测试。
- 已检查 todo：无新增功能待办；人工动效体验列入 pending-test。
- final result: passed

## 复古拟物深化

- 用户明确要求整体从扁平改为复古拟物，新建按钮要有立体感与艺术字体；此方向覆盖原效果图的平面按钮与导航样式。保留主标题、副标题、导航布局和真实项目。
- 按钮：酒红皮革、黄铜双边缘、5px 实体底座、宋体烫金字感；悬停抬升、按下回落，减少动态效果时禁用位移。
- 工作台：纸牌导航、内凹搜索、装裱照片与项目卡片；深浅主题、Ant Design 按钮/浮层以及画布工具栏统一阴影层次。
- 视觉证据：D:/AI/Codex/research/yzcanvas-tactile-ui/desktop.png 与 dark.png（1252×1005）、narrow.png（390×844），均已打开逐项检查材质、字体、排版与颜色。窄屏主区 clientWidth/scrollWidth 均为 303px。
- 交互：键盘焦点可达新建按钮；在 localhost:3010 独立测试存储中按 Enter 新建，正常进入编辑器；未修改 127.0.0.1 用户项目。账户浮层和主题切换正常，浏览器错误日志为空。
- 现有测试 298 passed / 2 skipped；没有执行构建或打包。新增皮革资源 22,312 字节，没有新依赖。
- 当前无待修复的 P0/P1/P2；Windows 原生缩放和用户对实体按压手感的体验仍待人工验收，已更新 pending-test 与 todo。
- final result: passed
