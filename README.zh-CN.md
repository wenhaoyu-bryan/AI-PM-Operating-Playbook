# AI PM 工作台

一个静态、隐私友好的工作台，帮助 AI 产品经理将模糊的产品概念转化为结构化的产品简报、评估方案和编码智能体交接材料。

[打开工作台](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/workbench/) · [查看示例](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/examples/)

---

## 产品定位

AI PM 工作台是面向 AI 产品经理的结构化思维工具。它用四步工作流取代零散的笔记和临时文档，生成可复用的交付物。它不是课程，不是资源列表，也不是个人作品集。

## 打开工作台

- [中文工作台](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/workbench/)
- [English Workbench](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/en/workbench/)
- [示例概念](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/examples/)

## 核心工作流

| 步骤 | 目的 |
|------|------|
| 1. 产品定义 | 明确用户、问题、业务背景和知识来源 |
| 2. AI 工作流设计 | 选择合适的 AI 能力，设计工作流边界，设定人工审核节点 |
| 3. 评估与风险 | 设定指标、验收标准和生产风险 |
| 4. 导出交付物 | 生成可交付给团队或编码智能体的文档包 |

## 生成的交付物

| 交付物 | 用途 |
|--------|------|
| AI 产品简报 | 结构化概念摘要，用于干系人对齐 |
| 工作流规格 | 分步 AI/智能体工作流，附 Mermaid 流程图 |
| 评估计划 | 指标、数据集和评审流程 |
| 验收标准 | 原型和生产环境的可测试检查清单 |
| 编码智能体交接文档 | 面向 AI 编码工具优化的实施简报 |
| CLAUDE.md 初始模板 | Claude Code 的项目上下文文件 |

## 示例项目

以下为使用模拟假设构建的示例。真实项目中的指标与目标需要另行验证。

| 示例 | 类型 | 核心挑战 |
|------|------|----------|
| Prompt-to-Ontology | 本体/知识 | 将模糊的业务术语转化为结构化的本体资产 |
| 工业智能体决策支持 | 智能体 | 整合多系统证据，同时将高影响操作置于人工控制之下 |
| RAG 知识助手 | RAG | 帮助员工找到准确答案，同时避免暴露敏感或过时内容 |

## 隐私

项目内容存储在浏览器本地。工具不会将用户输入的项目数据上传到服务器。

## 导入导出与本地恢复

- 随时从标题栏菜单将项目导出为 JSON 文件。
- 导入之前导出的 JSON 文件以恢复项目。
- 工作台在输入时自动将内容保存到 localStorage。
- 无需注册或登录。

## 技术栈

- **Astro** + **React** 静态站点 + 交互式岛屿
- **TypeScript** 类型安全
- **Tailwind CSS** 样式
- **GitHub Pages** 部署

## 本地开发

```bash
npm install
npm run dev        # 打开终端中显示的本地 URL
npm run check      # 类型检查
npm run build      # 生产构建到 dist/
```

## 配套方法论

本工具是 [AI PM Operating Playbook](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/methodology/) 的一部分——一套 AI 产品思维框架：

- [AI PM 角色](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/ai-pm-role/) — AI 产品经理是什么
- [Vibe Coding](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/vibe-coding/) — 用编码智能体做产品原型
- [Harness Engineering](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/harness-engineering/) — 可靠地指挥 AI 写代码
- [智能体产品设计](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/agent-product-design/) — 设计目标驱动的 AI 工作流
- [Prompt-to-Ontology 案例](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/prompt-to-ontology/) — 真实项目示例

## 作者

**余文豪（Wenhao Yu）**
- GitHub：[@wenhaoyu-bryan](https://github.com/wenhaoyu-bryan)
- 个人主页：[wenhaoyu-bryan.github.io](https://wenhaoyu-bryan.github.io/)
- 方向：工业 AI Agent、本体驱动产品、AI 原型开发

## 许可证

MIT
