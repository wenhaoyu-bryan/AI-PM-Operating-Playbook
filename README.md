# AI PM Operating Playbook

AI 产品经理的实用方法论工具箱 — 结构化的框架、工作流和案例笔记。

**English** | [中文](README.zh-CN.md)

---

## 这是什么

一个把模糊的业务问题转化为结构化 AI 产品概念、原型和评估方案的实战手册。

核心内容：

- **AI PM Canvas** — 12 维度规划框架（交互式工具）
- **Vibe Coding** — PM + LLM = 全栈开发者
- **Harness Engineering** — 设计 AI Agent 的运行框架
- **Ontology 系统** — 企业知识图谱驱动的 AI 产品
- **案例研究** — 从 Prompt 到 Ontology 的实战

## 在线访问

**https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/**

## AI PM Canvas — 12 维度规划工具

项目的核心交互工具，用于在写 PRD、做原型、评估 AI 想法之前进行结构化思考：

| 分组 | 维度 |
|------|------|
| **Context** | Business Scenario · User / Operator · Decision to Support |
| **Knowledge** | Data / Knowledge Sources · Object Model |
| **AI Layer** | AI / Agent Capability · Workflow Boundary · Human Review Point |
| **Delivery** | Evaluation Metric · Prototype Scope · Production Risk · Product Narrative |

在线使用：[英文版](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/canvas/) · [中文版](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/zh-CN/canvas/)

## 目录结构

| 章节 | 内容 |
|------|------|
| [01-product-thinking/](src/content/docs/en/ai-pm-role.md) | AI PM 角色、能力模型、成长路径 |
| [02-ai-native-delivery/](src/content/docs/en/vibe-coding.md) | Vibe Coding、Harness Engineering、原型开发 |
| [03-agent-and-ontology-systems/](src/content/docs/en/prompt-to-ontology.md) | Agent 工作流、Ontology 产品设计 |
| [04-case-studies/](src/content/docs/en/prompt-to-ontology.md) | 项目案例笔记 |
| [05-templates/](src/content/docs/en/ai_prd_lite_template.md) | Canvas、PRD Lite、案例研究模板 |
| [06-resources/](src/content/docs/en/books.md) | 推荐书籍和课程 |

## 技术栈

- **框架：** Astro 7.x + React 19
- **UI：** shadcn/ui + Tailwind CSS 4.x
- **主题：** 深色科技风
- **部署：** GitHub Pages（CI/CD 自动部署）
- **多语言：** 中英文双语

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 与其他项目的关系

| 项目 | 定位 |
|------|------|
| **AI-PM-Operating-Playbook** | 专业方法论（工具 + 框架） |
| [Prompt-to-Ontology](https://github.com/wenhaoyu-bryan/Prompt-to-Ontology) | 案例项目（Ontology 驱动的 AI 产品） |
| [Agent-Space](https://github.com/wenhaoyu-bryan/Agent-Space) | 案例项目（制造业数字员工协同平台） |

## 作者

**余文豪（Wenhao Yu）**
- GitHub: [@wenhaoyu-bryan](https://github.com/wenhaoyu-bryan)
- 专注：工业 AI Agent、Ontology 驱动的产品、PM 主导的 Vibe Coding

## License

MIT
