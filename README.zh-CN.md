# AI PM 操作手册

面向 AI 产品经理的实用框架、工作流和案例笔记——专注于 Agent、本体系统和 AI 原型开发。

[English](README.md) | **中文**

---

## 这是什么

一本把模糊的业务问题转化为结构化的 AI 产品概念、原型和评估方案的操作手册。

这不是一门课程，不是泛泛的 AI 资源列表，也不是作品集。这是我思考产品决策、设计 Agent 工作流、规划人工审核节点和协调 AI 辅助交付的操作系统。

核心内容：

- **AI PM Canvas** — 12 维度规划框架（交互工具）
- **智能体产品设计** — 设计目标驱动的 AI 工作流：工具、边界、人工审核、可衡量结果
- **Vibe Coding** — 用编码智能体把产品意图转化为可测试的原型
- **Harness Engineering** — 面向编码智能体的上下文、工具、约束、检查与反馈体系
- **Prompt-to-Ontology** — 将杂乱的业务概念转化为结构化的本体资产

## 在线访问

**https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/**

## AI PM Canvas — 12 维度规划工具

本项目的核心交互工具。在撰写 PRD、构建原型或评估 AI 创意之前使用：

| 分组 | 维度 |
|------|------|
| **上下文** | 业务场景 · 用户/运营者 · 支持的决策 |
| **知识** | 数据/知识来源 · 对象模型 |
| **AI 层** | AI/智能体能力 · 工作流边界 · 人工审核点 |
| **交付** | 评估指标 · 原型范围 · 生产风险 · 产品叙事 |

在线使用：[English](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/canvas/) · [中文](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/zh-CN/canvas/)

## 章节目录

| 章节 | 内容 |
|------|------|
| [01-product-thinking/](src/content/docs/zh-CN/ai-pm-role.md) | AI PM 角色、能力模型、成长路径 |
| [02-ai-native-delivery/](src/content/docs/zh-CN/vibe-coding.md) | Vibe Coding、Harness Engineering、原型开发 |
| [03-agent-and-ontology-systems/](src/content/docs/zh-CN/agent-product-design.md) | 智能体产品设计、本体产品方法论 |
| [04-case-studies/](src/content/docs/zh-CN/prompt-to-ontology.md) | 项目案例笔记 |
| [05-templates/](src/content/docs/zh-CN/ai_prd_lite_template.md) | Canvas、PRD Lite、案例模板 |
| [06-resources/](src/content/docs/zh-CN/books.md) | 推荐书籍和课程 |

## 技术栈

- **框架：** Astro 7.x + React 19
- **UI：** shadcn/ui + Tailwind CSS 4.x
- **主题：** 暗色（科技/赛博朋克美学）
- **部署：** GitHub Pages（GitHub Actions CI/CD）
- **i18n：** 英文 + 中文双语

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

## 关联项目

| 项目 | 用途 |
|------|------|
| **AI-PM-Operating-Playbook** | 方法论体系（工具 + 框架） |
| [Prompt-to-Ontology](https://github.com/wenhaoyu-bryan/Prompt-to-Ontology) | 案例项目——本体驱动的 AI 产品实验 |

## 资产关系

- **[个人主页](https://wenhaoyu-bryan.github.io/)** — 我是谁、做了什么
- **AI PM 操作手册** — 我如何结构化和交付 AI 产品
- **[Prompt-to-Ontology](https://github.com/wenhaoyu-bryan/Prompt-to-Ontology)** — 证据与实现产物

## 作者

**余文豪（Wenhao Yu）**
- GitHub：[@wenhaoyu-bryan](https://github.com/wenhaoyu-bryan)
- 个人主页：[wenhaoyu-bryan.github.io](https://wenhaoyu-bryan.github.io/)
- 方向：工业 AI Agent、本体驱动产品、AI 原型开发

## 许可证

MIT
