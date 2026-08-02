# 念念（NIANNIAN）

一个以“上下文记忆”为核心的 AI 闹钟与日程交互原型。

念念不只记录时间和事项，还会保留用户当时的目标、理由与对话背景。当提醒发生或用户再次打开事项时，可以带着原有上下文继续交流，帮助用户从“记得要做”走到“真正开始行动”。

## 项目内容

仓库包含两个前端项目：

- 主产品 Demo：手机形态的 AI 闹钟、日程与上下文交互原型
- `presentation/`：独立的 Context OS 产品概念演示页面

## 核心体验

- 语音或文字创建：用自然语言描述时间、事项和行动理由
- AI 结构化确认：将输入整理为闹钟或日程卡片，确认后创建
- 外部上下文建议：模拟从 Teams、微信等对话中识别值得记录的事项
- 连续候选浏览：通过横向卡片查看和处理多条上下文建议
- 周期闹钟与单次日程：在统一日程中展示，并保留不同交互语义
- 上下文续聊：从已有闹钟或日程重新进入对话，继续拆解下一步行动
- 上下文分享：模拟生成可分享的上下文链接
- 待讨论与待探索：收纳还没有明确日期的想法

## 当前状态

这是一个产品交互 Demo，重点用于验证体验与视觉方向。目前语音识别、AI 解析、外部应用连接、通知、分享链接和数据持久化均为前端模拟，尚未接入真实服务。

## 技术栈

- React 19
- Next.js 16
- TypeScript 5
- vinext + Vite
- Tailwind CSS 4
- Cloudflare Workers / Sites
- Drizzle ORM + Cloudflare D1（预留数据层）

## 环境要求

- Node.js `>= 22.13.0`
- npm

## 运行主产品 Demo

```bash
npm install
npm run dev
```

终端会显示本地访问地址。

## 运行产品概念演示页

```bash
cd presentation
npm install
npm run dev
```

## 常用命令

```bash
# 开发
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint

# 测试
npm test

# 生成 Drizzle 数据库迁移
npm run db:generate
```

## 项目结构

```text
app/            主产品页面、组件与样式
presentation/   独立的 Context OS 演示项目
public/         静态资源
db/             Drizzle 数据访问与 Schema
drizzle/        数据库迁移元数据
worker/         Cloudflare Worker 入口
build/          Sites / Vite 构建适配
examples/       D1 接入示例
tests/          自动化测试
.openai/        OpenAI Sites 项目配置
```

## 建议体验流程

1. 打开主页面，点击语音球模拟创建一条提醒。
2. 查看念念整理出的时间、事项和行动理由，并确认创建。
3. 浏览来自外部对话的多条上下文建议。
4. 切换到“日程”，区分周期闹钟和单次日程。
5. 从事项中点击“念念”，带着原有上下文继续交流。
6. 打开 `presentation/`，了解 Context OS 的产品概念与整体架构。

## 后续方向

- 接入真实语音识别和大模型解析
- 连接日历、即时通信与任务管理工具
- 实现闹钟、通知和重复规则
- 增加账号体系、云同步和数据持久化
- 完成可控的上下文授权、分享与隐私机制
- 为移动端和桌面端提供真实产品实现

## License

本项目用于产品原型展示与学习交流。
