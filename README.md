# 句读 | Judu

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/FreemanKevin/judu)

> 一个基于 GitHub Issues 驱动的句子收藏与分享平台

**域名**: [https://judu.freemankevin.uk](https://judu.freemankevin.uk)

## ✨ 特性

- 📝 **GitHub Issues 驱动**: 通过 GitHub Issues 管理和收录句子
- 🎨 **现代化 UI**: 基于 Next.js + Tailwind CSS 的响应式设计
- 🌓 **暗黑模式**: 支持自动和手动切换主题
- 🔍 **智能搜索**: 支持按内容、作者、标签搜索
- 📱 **移动友好**: 完全响应式设计，支持移动端浏览
- 💬 **社区互动**: 基于 GitHub Discussions 的评论系统
- ⚡ **高性能**: 静态生成 + API 路由，部署在 Vercel

## 🏗️ 技术架构

```
┌─────────────────┐     ┌──────────────────┐
│   Next.js App   │────▶│  GitHub API      │
│  (Vercel 托管)   │     │  (Issues 数据)    │
└─────────────────┘     └──────────────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Actions │  ← 自动同步 Issues 数据
└─────────────────┘
```

### 技术栈

- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **部署**: Vercel + GitHub Actions CI/CD
- **数据存储**: GitHub Issues + JSON 文件缓存

## 📁 项目结构

```
judu/
├── src/                      # 源代码
│   ├── components/           # React 组件
│   │   ├── Navbar.tsx        # 导航栏
│   │   ├── DailyQuote.tsx    # 每日一句
│   │   ├── SentenceCard.tsx  # 句子卡片
│   │   ├── CategoryFilter.tsx # 分类筛选
│   │   └── ToastProvider.tsx # 提示消息
│   ├── pages/                # Next.js 页面
│   │   ├── _app.tsx          # App 入口
│   │   └── index.tsx         # 首页
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useTheme.ts       # 主题切换
│   │   └── useToast.ts       # 提示消息
│   ├── services/             # API 服务
│   │   └── github.ts         # GitHub API 封装
│   ├── utils/                # 工具函数
│   │   └── types.ts          # TypeScript 类型定义
│   └── styles/               # 全局样式
├── public/                   # 静态资源
├── data/                     # 数据文件
│   └── sentences.json        # 句子数据缓存
├── scripts/                  # Python 脚本（预留）
├── .github/                  # GitHub 配置
│   ├── workflows/            # GitHub Actions
│   └── ISSUE_TEMPLATE/       # Issue 模板
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json               # Vercel 配置
└── README.md
```

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn
- GitHub 账号
- Vercel 账号

### 本地开发

1. **克隆项目**

```bash
git clone https://github.com/FreemanKevin/judu.git
cd judu
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

创建 `.env.local` 文件：

```env
# GitHub 配置（可选，用于提高 API 限制）
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
NEXT_PUBLIC_GITHUB_OWNER=FreemanKevin
NEXT_PUBLIC_GITHUB_REPO=judu
```

4. **启动开发服务器**

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 部署到 Vercel

1. **在 Vercel 导入项目**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

2. **配置环境变量**

在 Vercel 控制台设置以下环境变量：

- `NEXT_PUBLIC_GITHUB_TOKEN`: 你的 GitHub Personal Access Token
- `NEXT_PUBLIC_GITHUB_OWNER`: `FreemanKevin`
- `NEXT_PUBLIC_GITHUB_REPO`: `judu`

3. **配置 GitHub Actions**

在 GitHub 仓库设置以下 Secrets：

- `VERCEL_TOKEN`: Vercel API Token
- `VERCEL_ORG_ID`: Vercel Organization ID
- `VERCEL_PROJECT_ID`: Vercel Project ID

## 📊 数据管理

### 方案 B: GitHub Issues 驱动

这是我们采用的数据维护方案，任何人都可以通过 GitHub Issues 参与句子收录。

#### 收录新句子

1. 访问项目 GitHub 仓库
2. 点击 "Issues" → "New Issue"
3. 选择 "收录新句子" 模板
4. 填写句子信息并提交

#### 自动同步

当 Issues 创建或更新时，GitHub Actions 会自动：

1. 获取所有标记为 `sentence` 的 Issues
2. 解析 Issues 内容并生成 JSON 数据
3. 更新 `data/sentences.json` 文件
4. 自动部署到 Vercel

#### Issue 格式

```markdown
**句子内容**
人生如逆旅，我亦是行人。

**作者**
苏轼

**出处**
《临江仙·送钱穆父》

**情感**
感慨
```

## 🎨 前端开发

### 组件结构

- `Navbar`: 顶部导航栏，包含搜索和主题切换
- `DailyQuote`: 每日一句展示区域
- `CategoryFilter`: 分类筛选器
- `SentenceCard`: 句子卡片组件
- `ToastProvider`: 全局提示消息

### 自定义 Hooks

- `useTheme`: 主题切换逻辑
- `useToast`: 提示消息管理

### API 服务

- `githubService`: GitHub API 封装

## 🔧 配置说明

### Vercel 配置 (`vercel.json`)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "out"
}
```

### GitHub Actions

- **自动部署** (`.github/workflows/deploy.yml`): 推送到 main 分支时自动部署到 Vercel
- **数据同步** (`.github/workflows/update-sentences.yml`): Issues 更新时同步数据

## 📱 使用指南

### 作为用户

1. 浏览句子：访问网站首页，浏览所有句子
2. 分类筛选：点击分类标签筛选特定类型的句子
3. 搜索句子：使用搜索框搜索特定内容
4. 复制分享：点击复制按钮复制句子，或分享按钮分享
5. 参与讨论：使用 GitHub 账号登录后参与评论

### 作为贡献者

1. Fork 项目
2. 创建 Issue 提交新句子
3. 或直接在 `data/sentences.json` 中添加句子
4. 提交 Pull Request

## 🐛 问题反馈

如有问题或建议，请通过以下方式反馈：

1. 创建 GitHub Issue
2. 发送邮件到：freemankevin@example.com
3. 在项目讨论区留言

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 设计灵感来自 [句子迷](https://www.juzimi.com/)
- 使用 [Tailwind CSS](https://tailwindcss.com/) 构建样式
- 部署在 [Vercel](https://vercel.com/) 平台
- 数据存储于 [GitHub](https://github.com/)

---

**句读** - 发现文字之美，分享心灵触动
