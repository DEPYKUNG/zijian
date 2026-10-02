# 字间

浏览器里的文字创作与推理工具，包含打孔诗、海龟汤、藏头诗三个独立页面。

纯 HTML、CSS、JavaScript；不依赖后端、API 密钥或 npm 包。藏头诗使用本地句库和组合规则，不调用大模型。页面支持系统、浅色、深色主题，作品可按 1×、1.5×、2×、3× 导出 PNG。

## 本地运行

```sh
python3 -m http.server 8080 --directory dist
```

访问 http://localhost:8080/ 。编辑 `dist/` 中的文件即可；字体由 Google Fonts 加载，访问失败时回退到设备字体。

## Cloudflare Pages 部署

在 Cloudflare 的 Workers & Pages 中创建 Pages 项目，选择 GitHub 仓库 `DEPYKUNG/zijian`，填写以下设置：

| 设置 | 值 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `dist` |
| Root directory | 仓库根目录，留空 |
| Environment variables | 无需配置 |

保存并部署。后续推送 `main` 会触发自动发布。代码和导出功能无需 ChatGPT Sites；原托管配置和凭据不包含在本仓库中。

## 自定义域名

目标域名：`word-punch-studio.depykung.app`。

先在 Pages 自动生成的 `pages.dev` 地址上检查三个模式、编辑弹窗和 PNG 导出。再进入项目的 Custom domains → Set up a domain，填写目标域名。

若 `depykung.app` 在同一 Cloudflare 账户中，按设置页面指引创建或更新对应 DNS 记录。该子域当前绑定旧 Sites，切换前记录现有 DNS 值；只有 Pages 网站正常运行后才将域名切向新项目。域名和证书激活后，再解除旧 Sites 绑定。

不要只创建 DNS 记录而跳过 Pages 的 Custom domains 设置。

## 主要文件

| 文件 | 用途 |
| --- | --- |
| `dist/poetry/index.html`、`dist/app.js` | 打孔诗 |
| `dist/turtle/index.html`、`dist/turtle.js`、`dist/soup-library.js` | 海龟汤及题库 |
| `dist/acrostic/index.html`、`dist/acrostic.js` | 藏头诗及编辑器 |
| `dist/acrostic-library.js` | 本地诗句、词语与生成规则 |
| `dist/style.css`、`dist/theme.css` | 布局及主题 |

海龟汤来源和古诗词参考信息记录在对应句库代码中。仓库未声明开源许可证。

部署文档：https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

域名文档：https://developers.cloudflare.com/pages/configuration/custom-domains/
