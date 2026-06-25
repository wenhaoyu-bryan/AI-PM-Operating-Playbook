# AI PM Operating Playbook

## 项目定位

AI PM 方法论工具箱 —— 面向 AI 产品经理的实用框架、工作流和案例笔记。

**核心价值：** 把模糊的业务问题转化为结构化的 AI 产品概念、原型和评估方案。

**目标用户：** AI 产品经理、想转型 AI PM 的传统 PM、对 AI 产品感兴趣的创业者。

**这不是：**
- 不是课程（没有结构化课纲）
- 不是资源列表（学习材料是辅助）
- 不是个人作品集（展示怎么做，不是做了什么）
- 不是理论研究笔记（一切基于产品实践）

## 技术栈

- **框架：** Astro 7.x（静态站点生成）
- **UI：** React 19 + Tailwind CSS 4.x
- **代码高亮：** Shiki（github-dark 主题）
- **部署：** GitHub Pages（https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook）
- **包管理：** npm

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（默认端口 4322）
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 目录结构

```
AI-PM-Operating-Playbook/
├── AI_PM_CANVAS.md              # 核心：12 维度 AI PM Canvas 框架
├── AI_PM_CANVAS.zh-CN.md        # 中文版 Canvas
├── 01-product-thinking/          # AI PM 角色、能力、成长路径
│   ├── ai-pm-role.md
│   └── ai-pm-role.zh-CN.md
├── 02-ai-native-delivery/        # Vibe Coding、Harness Engineering、原型开发
│   ├── vibe-coding.md            # Vibe Coding 实践指南
│   ├── harness-engineering.md    # Harness Engineering 概念
│   ├── pm-prototype-workflow.md  # PM 原型开发工作流
│   ├── requirements-breakdown.md # 需求拆解方法
│   └── vue3-x6-prototype-stack.md # Vue3 + X6 技术栈
├── 03-agent-and-ontology-systems/ # Agent 和 Ontology 系统（待补充）
├── 04-case-studies/               # 项目案例
│   └── prompt-to-ontology.md     # Prompt to Ontology 案例
├── 05-templates/                  # 可复用模板
│   ├── AI_PRD_LITE_TEMPLATE.md   # 轻量 PRD 模板
│   └── AI_PM_CASE_STUDY_TEMPLATE.md # 案例研究模板
├── 06-resources/                  # 学习资源
│   ├── books.md                  # 推荐书籍
│   └── courses.md                # 推荐课程
├── archive/                       # 历史版本
├── src/                           # Astro 源码
│   ├── content/docs/en/          # 英文文档内容
│   ├── content/docs/zh-CN/       # 中文文档内容
│   ├── components/ui/            # React 组件
│   └── styles/global.css         # 全局样式
├── public/                        # 静态资源
└── dist/                          # 构建输出
```

## 核心内容

### AI PM Canvas（12 维度框架）

项目的核心框架，用于在写 PRD、做原型、评估 AI 想法之前进行结构化思考：

1. **Business Scenario** — 业务场景（不是技术，是 situation）
2. **User / Operator** — 用户/操作者（实际使用系统的人）
3. **Decision to Support** — 要支持的决策（不是"提供洞察"，是具体决策）
4. **Data / Knowledge Sources** — 数据/知识来源
5. **Object Model** — 对象模型（Ontology）
6. **AI / Agent Capability** — AI/Agent 能力
7. **Workflow Boundary** — 工作流边界
8. **Human Review Points** — 人工审查点
9. **Evaluation Criteria** — 评估标准
10. **Failure Modes** — 失败模式
11. **Iteration Strategy** — 迭代策略
12. **Go/No-Go Criteria** — Go/No-Go 标准

### 关键概念

- **Vibe Coding：** 产品判断 + 编码智能体 = 更快的原型迭代。不是"学写代码"，是"学架构思维"
- **Harness Engineering：** 为编码智能体设计上下文、工具、约束、检查和反馈体系
- **Loop Engineering：** 设计自动 prompt AI 的循环系统（你设计系统，系统 prompt AI）
- **Ontology：** 企业知识图谱，把"表格"变成"活的知识网络"

## 多语言支持

所有文档都有中英文版本：
- 英文：`filename.md`
- 中文：`filename.zh-CN.md`

Astro 内容在 `src/content/docs/en/` 和 `src/content/docs/zh-CN/` 下。

## 当前状态

**已完成：**
- ✅ 基础框架搭建（Astro + React + Tailwind）
- ✅ AI PM Canvas 框架（12 维度）+ 交互工具
- ✅ Vibe Coding 实践指南
- ✅ Harness Engineering 概念
- ✅ Agent Product Design（智能体产品设计）
- ✅ PM 原型开发工作流
- ✅ 需求拆解方法
- ✅ Prompt to Ontology 案例
- ✅ PRD 和案例研究模板
- ✅ 推荐书籍和课程

**待补充：**
- ⬜ 更多案例研究
- ⬜ Loop Engineering 内容

## 与其他项目的关系

- **Personal Page（my-site）：** 个人品牌（简历 + 博客）
- **AI-PM-Operating-Playbook：** 专业方法论（工具 + 框架）
- **Prompt to Ontology：** 案例项目（Ontology 驱动的 AI 产品）

## 注意事项

1. **不要重写内容** — 只改 UI 层，保留所有文档内容
2. **保持中英文同步** — 改了英文版要同步改中文版
3. **Astro 特性** — 使用 Astro 的内容集合（Content Collections）管理文档
4. **路由结构** — 文档路由由 `src/content/docs/` 目录结构决定
5. **代码高亮** — 使用 Shiki，主题是 github-dark
6. **部署** — 推送到 main 分支自动部署到 GitHub Pages

## 作者

- 专注：工业 AI Agent、Ontology 驱动的产品、PM 主导的 Vibe Coding
