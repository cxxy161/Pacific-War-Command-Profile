# 太平洋战争：海军统帅匹配系统 (Pacific War: Naval Commander Matchmaker)

这是一个基于 React 和 Tailwind CSS 构建的二战太平洋海战主题的硬核心理评测 Web 应用。通过回答 15 道由真实历史战役数据生成的极端战术情境题，系统将在 5 个维度（进攻、理性、冒险、理想、正统）上对您进行心理侧写，并利用多维向量的欧几里得距离算法，计算出您与 20 位著名的美日二战海军将领（如尼米兹、斯普鲁恩斯、山本五十六、山口多闻等）的匹配度。

## 🌟 核心特性 (Features)
- **硬核的战术题库**：涵盖了超视距航母战、雷达盲区夜战、丧心病狂的两栖登陆、密码截获与无线电静默等残酷情境。
- **多维雷达侧写系统**：每一次抉择都会动态微调您的指挥官侧写权重，并生成个人能力雷达图与历史名将对比。
- **复古军用情报终端 UI**：运用 1940 年代军事情报局黑客风、CRT 扫描线特效以及动态雷达扫描动效进行视觉呈现。

## 🚀 部署 (Deployment - GitHub Pages)
本项目已自带 GitHub Actions 配置文件 (`.github/workflows/deploy.yml`)，可实现向 GitHub Pages 的全自动部署：
1. 将此库推送到 GitHub。
2. 前往仓库的 **Settings** -> **Pages**。
3. 在 **Source** 选项中，选择 **GitHub Actions**。
4. 每次 `push` 到主分支后，Actions 将会自动触发打包并发布页面。

> **⚠️ 注意**：由于此应用是 Vite 构建的，如果你将其部署到子路径下（例如 `https://username.github.io/repo-name/`），请将根目录下的 `vite.config.ts` 中的 `base` 路径配置修改为仓库名称：`base: '/repo-name/'`，或者直接设置为相对路径 `base: './'` 以避免资源报 404 错误。

## 🛠️ 本地开发 (Development)
```bash
# 安装依赖
npm install

# 运行本地开发服务器
npm run dev

# 生产环境打包
npm run build
```

## 📜 免责声明
本系统题库、战术情境、匹配算法以及评价文本均由 AI 模型（Gemini）参与生成。本应用仅供对二战太平洋海军史感好奇的朋友进行**娱乐推演**使用，不代表任何官方政治立场与严肃学术定论。
