# AI PM 工作台

将模糊的 AI 产品想法转化为结构化的产品简报、工作流规格、评估计划和编码智能体交接材料。

[打开工作台](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/workbench/) · [查看示例](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/examples/)

---

## 功能

- 用结构化问题定义产品问题
- 设计 AI 或智能体工作流
- 明确人工审核节点和执行边界
- 建立包含指标和验收标准的评估计划
- 导出可交付给团队或编码智能体的复用材料

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

| 示例 | 类型 | 核心挑战 |
|------|------|----------|
| Prompt-to-Ontology | 本体/知识 | 将模糊的业务术语转化为结构化的本体资产 |
| 工业智能体决策支持 | 智能体 | 整合多系统证据，同时将高影响操作置于人工控制之下 |
| RAG 知识助手 | RAG | 帮助员工找到准确答案，同时避免暴露敏感或过时内容 |

## 隐私

所有项目数据存储在浏览器本地，不会上传到任何服务器。

## 技术栈

- **Astro** + **React** 静态站点 + 交互式岛屿
- **TypeScript** 类型安全
- **Tailwind CSS** 样式
- **GitHub Pages** 部署

## 配套方法论

本工具是 [AI PM Operating Playbook](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/methodology/) 的一部分——一套 AI 产品思维框架：

- [AI PM 角色](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/ai-pm-role/) — AI 产品经理是什么
- [Vibe Coding](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/vibe-coding/) — 用编码智能体做产品原型
- [Harness Engineering](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/harness-engineering/) — 可靠地指挥 AI 写代码
- [智能体产品设计](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/agent-product-design/) — 设计目标驱动的 AI 工作流
- [Prompt-to-Ontology 案例](https://wenhaoyu-bryan.github.io/AI-PM-Workbench/zh-CN/prompt-to-ontology/) — 真实项目示例

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
