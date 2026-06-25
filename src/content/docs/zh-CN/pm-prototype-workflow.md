name: pm-prototype-workflow
description: AI Native 产品原型开发工作流 - 从需求到可交互原型的高效流程
category: product-management
tags:
  - product-management
  - prototyping
  - vibe-coding
  - react
  - tailwind
  - ai-native
triggers:
  - "需要快速生成原型"
  - "从需求到原型"
  - "PRD 转原型"
  - "竞品复刻"
  - "产品演示"
version: 1.0.0
last_updated: 2026-05-18
---

# PM Prototype Workflow — AI Native 产品原型开发工作流

**[English](pm-prototype-workflow.md)** | **中文**

> 从产品需求到可交互原型的 AI Native 工作流
> 核心理念：PRD 不是文档，是给 AI 的指令集

---

## 适用场景

- 新产品/功能的快速原型验证
- 竞品分析后的功能复刻
- 用户调研后的需求可视化
- 内部汇报/演示用的 Demo
- 技术方案验证（Vibe Coding）

---

## 工作流总览

```
需求输入 → AI 生成 PRD → AI 生成原型 → 快速迭代 → 交付验证
```

---

## 第一阶段：需求输入

### 输入模板

```markdown
## 需求背景
- 目标用户：[谁会用这个功能？]
- 核心问题：[解决什么问题？]
- 业务价值：[为什么要做？]

## 参考竞品
- 竞品 A：[名称] - [参考点]
- 竞品 B：[名称] - [参考点]

## 核心功能（MoSCoW）
### Must Have
- [ ] 功能 1：[描述]
- [ ] 功能 2：[描述]

### Should Have
- [ ] 功能 3：[描述]

### Could Have
- [ ] 功能 4：[描述]

## UI/UX 参考
- 设计风格：[极简/工业/现代/...]
- 参考链接：[Dribbble/Behance/竞品截图]
- 交互模式：[单页/多页/抽屉/弹窗/...]
```

### 示例：工业智能体平台原型 需求

```markdown
## 需求背景
- 目标用户：半导体 FAB 工程师
- 核心问题：工程师需要在多个系统间切换查询信息
- 业务价值：提升工程师效率，减少停机时间

## 参考竞品
- 竞品 A：本体驱动的企业平台 - 本体驱动的智能体界面
- 竞品 B：企业 IT 平台 - 任务工单系统

## 核心功能（MoSCoW）
### Must Have
- [ ] 仪表盘：展示关键指标和待办任务
- [ ] 工作台：工程师的主要工作界面
- [ ] 任务大厅：任务列表和筛选

### Should Have
- [ ] Agent 构建器：可视化配置 Agent
- [ ] 专家中心：专家知识库

### Could Have
- [ ] Copilot：AI 辅助助手

## UI/UX 参考
- 设计风格：暗黑工业风（参考企业级平台设计）
- 参考链接：[截图/链接]
- 交互模式：左侧导航 + 主内容区
```

---

## 第二阶段：AI 生成 PRD

### Prompt 模板

```markdown
你是一个资深产品经理，擅长将模糊需求转化为结构化 PRD。

基于以下需求，生成一份面向 AI 编码工具（Claude Code）的 PRD。

要求：
1. 不要写传统的文档式 PRD，要写成给 AI 的指令集
2. 每个功能点都要有明确的验收标准
3. 技术栈固定：React + Vite + Tailwind CSS
4. 组件命名要清晰，便于 AI 理解
5. 交互逻辑要具体，不要模糊描述

需求输入：
[粘贴第一阶段的需求]

输出格式：
1. 产品概述（一段话）
2. 核心功能清单（表格）
3. 页面结构（组件树）
4. 交互流程（状态机）
5. 技术约束（明确边界）
```

### PRD 输出模板

```markdown
# [产品名称] PRD

## 产品概述
[一段话描述产品定位、目标用户、核心价值]

## 核心功能清单

| 功能模块 | 组件名 | 优先级 | 验收标准 |
|----------|--------|--------|----------|
| 仪表盘 | Dashboard | P0 | 展示 3 个核心指标卡片 |
| 工作台 | Workbench | P0 | 支持拖拽排列工作区 |
| 任务大厅 | TaskHall | P1 | 支持筛选和排序 |

## 页面结构

```
App
├── Sidebar（左侧导航）
│   ├── Logo
│   ├── NavMenu
│   └── UserProfile
├── Dashboard（仪表盘）
│   ├── MetricCards
│   ├── RecentTasks
│   └── QuickActions
├── Workbench（工作台）
│   ├── TaskPanel
│   ├── AgentChat
│   └── ContextPanel
└── TaskHall（任务大厅）
    ├── FilterBar
    ├── TaskList
    └── TaskDetail
```

## 交互流程

### 状态机：任务状态
```
[待处理] → [进行中] → [已完成]
    ↓          ↓          ↓
  [暂停]    [阻塞]     [归档]
```

### 交互细节
- 点击任务卡片 → 右侧抽屉展示详情
- 拖拽任务 → 改变状态
- 双击任务 → 进入编辑模式

## 技术约束
- 框架：React 19 + Vite 8 + Tailwind CSS 4
- 状态管理：useState + useContext（无 Redux）
- 路由：React Router v6
- 图标：Lucide React
- 样式：Tailwind CSS（无 CSS-in-JS）
- 端口：5175
- 部署：GitHub Pages（base: './'）
```

---

## 第三阶段：AI 生成原型

### Prompt 模板

```markdown
你是一个资深前端工程师，擅长用 React + Vite + Tailwind CSS 快速构建原型。

基于以下 PRD，生成一个可运行的原型项目。

要求：
1. 使用 React 19 + Vite 8 + Tailwind CSS 4
2. 所有组件都要是 functional component + hooks
3. 样式全部用 Tailwind CSS，不要写自定义 CSS
4. 使用 Lucide React 图标
5. 数据用 mock 数据，不要调用真实 API
6. 交互要完整（点击、筛选、跳转等）
7. 响应式设计（支持桌面端）

PRD：
[粘贴第二阶段的 PRD]

输出：
1. 项目初始化命令
2. 目录结构
3. 核心组件代码
4. Mock 数据
5. 启动命令
```

### 生成流程

```bash
# 1. 初始化项目
npm create vite@latest my-prototype -- --template react
cd my-prototype
npm install

# 2. 安装依赖
npm install tailwindcss @tailwindcss/vite lucide-react react-router-dom

# 3. 配置 Tailwind CSS（在 vite.config.js 中）
# 4. 创建目录结构
mkdir -p src/components src/lib src/data

# 5. 让 Claude Code 生成组件
# （基于 PRD 逐个生成）
```

### Claude Code 使用技巧

```bash
# 启动 Claude Code
claude

# 然后用自然语言描述需求
"根据 PRD 生成 Dashboard 组件，包含 3 个指标卡片"

"生成 TaskHall 组件，支持按状态筛选任务"

"添加左侧导航栏，支持路由跳转"

"把所有 mock 数据放到 src/data/mock.js"
```

---

## 第四阶段：快速迭代（按需）

### 迭代 Prompt 模板

```markdown
基于当前原型，进行以下修改：

1. [修改点 1]：[具体描述]
2. [修改点 2]：[具体描述]

要求：
- 保持现有架构不变
- 只修改指定部分
- 确保其他功能不受影响
```

### 常见迭代场景

**场景 1：UI 调整**
```markdown
把 Dashboard 的指标卡片从 3 列改为 4 列，增加一个"待办任务"卡片
```

**场景 2：交互优化**
```markdown
点击任务卡片时，右侧弹出抽屉展示详情，而不是跳转新页面
```

**场景 3：功能新增**
```markdown
在 TaskHall 添加"创建任务"按钮，点击后弹出模态框
```

**场景 4：样式调整**
```markdown
整体色调从暗黑改为浅色，但保持工业风设计语言
```

---

## 第五阶段：交付验证

### 验证清单

- [ ] 所有核心功能可交互
- [ ] 响应式布局正常
- [ ] 无控制台报错
- [ ] Mock 数据完整
- [ ] 路由跳转正常
- [ ] 状态管理正确

### 交付物

```
prototype/
├── src/
│   ├── components/     # 所有组件
│   ├── data/          # Mock 数据
│   ├── lib/           # 工具函数
│   └── App.jsx        # 主入口
├── public/            # 静态资源
├── package.json
└── README.md          # 使用说明
```

### 演示方式

```bash
# 本地演示
npm run dev

# 部署到 GitHub Pages
npm run build
# 把 dist/ 目录推送到 gh-pages 分支
```

---

## 工具链

### 必备工具
- **Claude Code**：AI 编码助手
- **Node.js 18+**：运行环境
- **Git**：版本控制

### 推荐工具
- **Figma**：设计参考（可选）
- **Excalidraw**：手绘风格线框图（可选）
- **Vercel/Netlify**：快速部署（可选）

---

## 最佳实践

### 1. PRD 要写给 AI，不是写给人

```markdown
❌ 传统 PRD：系统应支持任务管理功能
✅ AI PRD：创建 TaskHall 组件，包含 TaskList 和 TaskDetail 两个子组件
```

### 2. 组件命名要清晰

```markdown
❌ 模糊命名：Card、List、Panel
✅ 清晰命名：MetricCard、TaskList、ContextPanel
```

### 3. 交互描述要具体

```markdown
❌ 模糊描述：用户可以筛选任务
✅ 具体描述：顶部 FilterBar 包含状态下拉（全部/待处理/进行中/已完成）和搜索框
```

### 4. 技术约束要明确

```markdown
❌ 模糊约束：使用现代前端框架
✅ 明确约束：React 19 + Vite 8 + Tailwind CSS 4，无 Redux
```

### 5. Mock 数据要真实

```markdown
❌ 随意数据：{ name: "test" }
✅ 真实数据：{ id: "TASK-001", title: "拉晶断苞分析", status: "进行中", assignee: "张工" }
```

---

## 案例：工业智能体平台原型

### 需求输入
- 目标用户：半导体 FAB 工程师
- 核心问题：多系统切换，信息分散
- 参考竞品：本体驱动的企业平台、企业 IT 平台

### PRD 生成
- 10 个核心组件
- 暗黑工业风设计
- 左侧导航 + 主内容区布局

### 原型生成
- React 19 + Vite 8 + Tailwind CSS 4
- 完整的组件树和路由
- Mock 数据和交互逻辑

### 迭代优化（按需）
- 添加专家照片系统
- 优化任务筛选交互
- 增加 Agent 构建器

### 最终交付
- 状态：✅ 可演示

---

## 进阶用法

### 1. 竞品截图 → 原型

```markdown
我有一张竞品截图（附图），帮我：
1. 分析页面结构和组件
2. 用 React + Tailwind CSS 复刻
3. 保持交互逻辑一致
```

### 2. 设计稿 → 原型

```markdown
我有一个 Figma 设计稿（附链接），帮我：
1. 提取设计规范（颜色、字体、间距）
2. 生成对应的 Tailwind 配置
3. 逐个组件实现
```

### 3. 用户反馈 → 迭代

```markdown
用户反馈：
- 任务列表加载太慢
- 筛选功能不够明显
- 希望有快捷操作

帮我优化：
1. 添加加载状态
2. 突出筛选栏
3. 增加快捷操作按钮
```

---

## 效率对比

在范围明确的原型验证中，部分阶段可能较快完成。实际所需时间取决于范围、数据就绪度、技术约束和质量要求。

---

## 注意事项

### 适用场景
- ✅ 原型验证
- ✅ 内部演示
- ✅ 快速迭代
- ✅ 技术探索

### 不适用场景
- ❌ 生产环境代码
- ❌ 复杂业务逻辑
- ❌ 高性能要求
- ❌ 企业级安全

---

## 总结

**核心理念**：
- PRD 不是文档，是给 AI 的指令集
- 原型不是代码，是可交互的需求说明
- 迭代不是开发，是对话式的调整
