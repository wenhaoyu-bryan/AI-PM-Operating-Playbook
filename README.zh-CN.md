# AI PM 工作台

将模糊的 AI 产品想法转化为结构化交付物。无后端、无 API Key、无账号——一切在浏览器中运行。

[English](README.md) | **中文**

---

## 这是什么

一个静态工作台，帮助 AI 产品经理在 4 个步骤内，从模糊的产品概念走向可执行的交付文档：

1. **产品定义** — 明确用户、问题、业务场景和知识上下文
2. **智能设计** — 选择合适的 AI 能力（RAG、智能体、分类、生成）并设计工作流
3. **评估与风险** — 设定指标、验收标准，识别生产风险
4. **导出** — 生成 6 份结构化文档，可直接用于干系人评审或编码智能体交接

**在线体验：** https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/zh-CN/workbench/

## 你能得到什么

工作台根据你的输入生成 6 份文档：

| 文档 | 用途 |
|------|------|
| **AI 产品简报** | 结构化概念摘要，用于干系人对齐 |
| **工作流规格** | 分步 AI/智能体工作流，附 Mermaid 流程图 |
| **评估计划** | 指标、数据集和评审流程 |
| **验收标准** | 原型和生产环境的可测试检查清单 |
| **编码智能体交接文档** | 面向 AI 编码工具优化的实施简报 |
| **CLAUDE.md 初始模板** | Claude Code 的项目上下文文件 |

## 示例项目

工作台内置 3 个预构建示例，可直接加载和修改：

- **Prompt-to-Ontology** — 将杂乱的业务概念转化为结构化的本体资产
- **工业智能体决策支持** — 用 AI 辅助工作流诊断制造设备问题
- **RAG 知识助手** — 帮助员工从内部文档中找到答案

## 方法论

工作台建立在一套 AI 产品思维框架之上：

- **AI PM Canvas** — 12 维度规划框架，用于结构化 AI 产品分析
- **智能体产品设计** — 设计目标驱动的 AI 工作流：工具、边界、人工审核
- **Vibe Coding** — 用编码智能体把产品意图转化为可测试的原型
- **Harness Engineering** — 面向编码智能体的上下文、工具、约束、检查与反馈体系

了解更多：[方法论](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/zh-CN/methodology/)

## 内容库

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
- **状态：** localStorage（纯客户端，无后端）
- **部署：** GitHub Pages
- **i18n：** 英文 + 中文双语

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4322
npm run build      # 生产构建到 dist/
```

## 作者

**余文豪（Wenhao Yu）**
- GitHub：[@wenhaoyu-bryan](https://github.com/wenhaoyu-bryan)
- 个人主页：[wenhaoyu-bryan.github.io](https://wenhaoyu-bryan.github.io/)
- 方向：工业 AI Agent、本体驱动产品、AI 原型开发

## 许可证

MIT
