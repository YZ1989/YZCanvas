# 体积与验证

`upstream-baseline.json` 是 TDCanvas 原版 Release 的实测数据。`yzcanvas.json` 在 YZCanvas Release 构建后生成。

测量区分安装包压缩体积、原生程序文件体积和前端 dist 文件总大小；不包含共享 WebView2 运行时、用户媒体、Rust/npm 开发依赖或编译缓存。

原版同样采用按需安装 WebView2。不能把两者与捆绑完整 WebView2 的包混比。前端 gzip 数据用于传输参考，不是本机安装占用。

原版基线：安装包 5,133,737 字节；原生 exe 19,650,560 字节；前端 dist 总计 3,382,853 字节。本机首次原生构建成功；尚未测量原版启动耗时与运行内存。

## YZCanvas 0.1.0 实测

| 产物 | TDCanvas 基线 | YZCanvas | 减少 |
| --- | ---: | ---: | ---: |
| NSIS 安装包 | 5,133,737 B | 3,750,394 B | 26.9% |
| 原生 exe | 19,650,560 B | 12,411,904 B | 36.8% |
| 前端 dist 总计 | 3,382,853 B | 2,516,437 B | 25.6% |

安装包约 **3.58 MiB**。差异来自功能裁剪、依赖精简和 Release 编译配置的共同影响，不代表运行内存同比下降。启动时间与内存还未测量。

构建后在 `web` 目录运行 `node scripts/measure-windows-build.mjs` 生成记录；若使用自定义 Cargo 目录，将该绝对路径作为第一个参数。安装包 SHA-256 保存在 `yzcanvas.json`。
