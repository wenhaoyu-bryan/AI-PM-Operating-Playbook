# AI PM Operating Playbook

面向 AI 产品经理的方法论工具集，将模糊的 AI 产品想法转化为结构化产品简报、工作流规格、评估计划和编码智能体交接材料。

[打开 AI PM Operating Playbook →](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/)

## 快速工具

交互式规划工具引导你完成四个步骤：

1. **产品定义** — 定义业务场景、目标用户、要支持的决策和预期结果。
2. **AI 工作流设计** — 选择合适的 AI 能力（分类、生成、RAG、智能体），设计工作流步骤，定义人工审查。
3. **评估与风险** — 设定评估指标、验收标准，识别生产环境风险。
4. **导出** — 为利益相关者和编码智能体生成结构化交付物。

[打开快速工具 →](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/zh-CN/workbench/)

## 生成的交付物

- 产品简报
- AI / 智能体工作流规格
- 评估计划
- 验收标准
- 编码智能体交接文档
- CLAUDE.md 初始模板

## 示例

三个示例项目展示不同的 AI 产品模式：

- **Prompt-to-Ontology** — 本体驱动的知识产品
- **工业智能体决策支持** — 智能体工作流产品
- **RAG 知识助手** — 检索增强生成产品

所有示例使用模拟假设构建。真实项目中的指标与目标需要另行验证。

## 方法论与写作

长篇方法论文章维护在[余文豪的个人网站](https://wenhaoyu-bryan.github.io/zh/playbook/)：

- Harness Engineering
- Loop Engineering
- 面向产品探索的 Vibe Coding
- 智能体产品设计
- Prompt-to-Ontology

本仓库专注于交互工具及其技术实现。

## 隐私

- 所有项目数据保存在浏览器中（localStorage）。
- 不会上传任何数据到服务器。
- 无需注册账号。

## 技术栈

- [Astro](https://astro.build/) 7.x（静态站点）
- React 19 + Tailwind CSS 4.x
- TypeScript（严格模式）
- GitHub Pages 部署

## 本地开发

```bash
npm install
npm run dev        # 启动开发服务器
npm run check      # 类型检查
npm run build      # 生产构建
```

## 作者

[余文豪](https://wenhaoyu-bryan.github.io/) 构建 — AI 产品经理，专注于智能体工作流、本体驱动系统和 AI 原生产品交付。

## 许可证

MIT
