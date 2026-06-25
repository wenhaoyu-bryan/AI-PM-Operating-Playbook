# AI PM 操作手册

面向 AI 产品经理的实用框架、工作流和案例笔记——专注于 Agent、本体系统和 AI 原型开发。

**[English](README.md)** | **中文**

---

## 这是什么

一套将模糊的业务问题转化为结构化 AI 产品概念、原型和评估计划的工作手册。

这不是课程，不是泛泛的 AI 资源列表，也不是我的个人网站替代品。这是我在 AI 产品管理实践中的工作系统——记录我如何思考产品决策、设计 Agent 工作流、规划人工审核节点，以及协调 AI 辅助交付。

本手册来自以下实践领域：

- 本体驱动的产品系统
- 工业 Agent 原型
- RAG 和数据准备工作流
- PM 主导的 Vibe Coding 和 Harness Engineering
- Human-in-the-loop AI 产品设计

## 这不是什么

- **不是课程。** 没有结构化大纲，可以按任何顺序阅读。
- **不是资源列表。** 学习材料作为补充存在，但核心是方法论。
- **不是个人作品集。** 本仓库展示的是我*如何*构建 AI 产品。关于我*做了*什么，请看我的 [GitHub 主页](https://github.com/wenhaoyu-bryan)。
- **不是理论研究笔记。** 所有内容都来自产品实践，不是学术分析。

## 如何阅读本仓库

从 [AI PM Canvas](AI_PM_CANVAS.zh-CN.md) 开始——它是连接所有内容的核心框架。

然后按版块浏览：

| 版块 | 内容 | 适用场景 |
|---|---|---|
| [01-product-thinking/](01-product-thinking/) | AI PM 角色演变、核心能力 | 理解 AI 如何改变 PM 工作 |
| [02-ai-native-delivery/](02-ai-native-delivery/) | Vibe Coding、Harness Engineering、原型开发 | 学习 PM 如何用 AI 快速交付原型 |
| [03-agent-and-ontology-systems/](03-agent-and-ontology-systems/) | 本体产品设计、Agent 工作流模式 | 理解知识驱动的 AI 产品 |
| [04-case-studies/](04-case-studies/) | 项目案例笔记 | 在实践中看方法论应用 |
| [05-templates/](05-templates/) | Canvas、案例模板、PRD-lite 模板 | 用框架指导自己的工作 |
| [06-resources/](06-resources/) | 书籍和课程 | 构建背景知识 |
| [archive/](archive/) | 早期版本和更新日志 | 查看仓库历史 |

---

## 案例连接

这些是方法论如何连接到实际项目工作的示例。案例细节已做通用化处理，避免暴露保密信息。

**Prompt-to-Ontology**
将扁平的业务语言转化为结构化的本体概念，使用 LLM 辅助 Schema 提取。展示本体驱动的产品思维。
→ [案例笔记](04-case-studies/prompt-to-ontology.zh-CN.md) | [GitHub](https://github.com/wenhaoyu-bryan/Prompt-to-Ontology)

**工业 Agent 原型**
模拟工业 Agent 如何支持诊断和决策工作流，结合结构化知识和人工审核。展示工业 AI 产品设计。

**邮件工作流自动化工具包**
自动化重复的邮件分类和路由。展示实用的业务工作流自动化。

**RAG 数据准备工具包**
为下游检索准备杂乱文档——清洗、分块、元数据提取、入库。展示对 AI 系统基础的理解。

> 这些项目的详细案例笔记将在可以通用化为可复用方法论时逐步添加，不暴露保密业务上下文。

---

## 为什么这对 AI PM 工作很重要

现代 AI 产品管理不只是写 PRD 和管理 Backlog。它需要一套不同的操作系统：

| 传统 PM | AI PM |
|---|---|
| 写需求文档 | 将业务模糊性结构化为产品概念 |
| 交给工程团队 | 协调 AI 辅助的原型开发和交付 |
| 管理时间线 | 设计 Agent 工作流和人工审核节点 |
| 跟踪功能 | 定义 AI 行为的评估指标 |
| 上线后迭代 | 先原型验证，再决定是否投入 |

AI PM 需要理解知识架构、设计人机协作模式、评估模型输出、交付可运行的原型——不是通过写代码，而是通过架构思维和有效指导 AI 工具。

本手册就是我做这些工作的方式。

---

## 仓库结构

```
.
├── README.md                          # 本文件
├── AI_PM_CANVAS.md                   # 核心框架：12 维度 AI PM 规划 Canvas
├── AI_PM_CANVAS.zh-CN.md             # 中文版
├── 01-product-thinking/              # AI PM 角色、能力、成长路径
├── 02-ai-native-delivery/            # Vibe Coding、Harness Engineering、原型开发
├── 03-agent-and-ontology-systems/    # 本体和 Agent 产品方法论
├── 04-case-studies/                  # 项目案例笔记
├── 05-templates/                     # 可复用模板和框架
├── 06-resources/                     # 书籍和课程
└── archive/                          # 早期版本和更新日志
```

---

## 作者

**余文豪（Wenhao Yu）**
- GitHub: [@wenhaoyu-bryan](https://github.com/wenhaoyu-bryan)
- 主页: [wenhaoyu-bryan.github.io](https://wenhaoyu-bryan.github.io/)
- 专注：工业 AI Agent、Ontology 驱动的产品、PM 主导的 Vibe Coding

## 许可证

MIT License — 自由使用，适配到你自己的实践中。
