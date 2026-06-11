---
name: vue3-x6-prototype-stack
description: Vue 3 + Element Plus + AntV X6 前端原型技术栈 - 适合可视化建模和复杂交互的 B 端产品原型
category: product-management
tags:
  - vue3
  - element-plus
  - antv-x6
  - prototyping
  - visualization
  - b-side
  - ontology-modeling
triggers:
  - "需要可视化建模原型"
  - "图编辑器"
  - "本体建模"
  - "B 端产品原型"
  - "拖拽连线"
  - "Vue 3 原型"
version: 1.0.0
author: Wenhao Yu
last_updated: 2026-05-26
---

# Vue 3 + Element Plus + AntV X6 前端原型技术栈

> 适合 B 端产品复杂可视化需求的前端原型技术栈
> 核心优势：用最少代码实现生产级图编辑能力

---

## 适用场景

### ✅ 最佳适用
- 本体/知识图谱建模工具
- 工作流/规则引擎可视化编辑器
- 工业 IoT 仪表盘
- 数据治理平台
- 任何需要拖拽节点连线的产品

### ❌ 不适用
- 简单 CRUD 后台（用 React + Ant Design）
- C 端产品（用 React + Tailwind）
- 移动端优先产品
- 内容型网站

---

## 技术栈总览

| 层级 | 库 | 版本 | 许可证 | 用途 |
|------|-----|------|--------|------|
| 框架 | Vue 3 | 3.3.x | MIT | Composition API + TypeScript |
| 构建 | Vite | 5.x | MIT | 极速 HMR 和构建 |
| UI 组件库 | Element Plus | 2.13.x | MIT | 70+ 开箱即用组件 |
| 图引擎 | AntV X6 | 2.19.x | MIT | 图编辑（节点、连线、布局） |
| 图可视化 | AntV G6 | 5.x | MIT | 只读图渲染 |
| 状态管理 | Pinia | 3.x | MIT | 带 devtools 的状态管理 |
| 路由 | Vue Router | 5.x | MIT | Hash 模式路由 |
| 布局算法 | dagre | 0.8.x | BSD | 有向图自动布局 |
| CSS | Sass | 1.x | MIT | CSS 变量驱动主题 |

**总成本：¥0** — 所有库均为 MIT/Apache 2.0 开源许可。

---

## 为什么选这套（vs React + Tailwind）

| 维度 | Vue 3 + Element Plus + X6 | React + Tailwind + D3 |
|------|---------------------------|------------------------|
| 图编辑能力 | 内置（7 个插件） | 手写（2-4 周工作量） |
| UI 组件 | 70+ 现成组件 | 需要自己造或购买 |
| 学习曲线 | 较低（模板语法） | 较高（JSX + hooks） |
| 主题系统 | CSS 变量 + Sass | Tailwind config |
| 最佳场景 | B 端、可视化 | C 端、内容型 |

**关键洞察：** 如果产品需要图编辑（节点、连线、拖拽），AntV X6 比用 D3 或 react-flow 开发节省 2-4 周。

---

## 项目结构

```
project/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.ts                    # 入口文件
    ├── App.vue                    # 根组件
    ├── router/
    │   └── index.ts               # 路由配置
    ├── stores/
    │   ├── theme.ts               # 深色/浅色主题
    │   └── user.ts                # 用户状态
    ├── styles/
    │   └── global.scss            # CSS 变量系统
    ├── layouts/
    │   └── MainLayout.vue         # 顶栏+侧边栏+主内容区
    ├── components/
    │   └── X6Canvas.vue           # 可复用画布组件
    ├── utils/
    │   └── x6-node-factory.ts     # 节点样式工厂
    └── views/
        ├── Dashboard.vue          # 首页概览
        └── CanvasDemo.vue         # 画布演示
```

---

## 核心组件

### 1. X6Canvas.vue — 可复用画布组件

最重要的组件，封装了 AntV X6 和 7 个插件：

```
已启用插件：
├── Keyboard      → Ctrl+Z/Y 撤销重做、Delete 删除、Ctrl+C/V 复制粘贴
├── Selection     → 点击选中、框选
├── Clipboard     → 节点复制粘贴
├── History       → 撤销重做栈
├── Snapline      → 拖拽时对齐参考线
├── MiniMap       → 右下角全局预览小窗
└── Scroller      → 画布平移和缩放
```

**使用方式：**
```vue
<X6Canvas
  ref="canvasRef"
  :grid-visible="true"
  :enable-mini-map="true"
  :enable-snapline="true"
  @node:click="handleNodeClick"
  @canvas:drop="handleDrop"
/>
```

**暴露的方法：**
- `addNode(config)` — 添加节点
- `removeNode(id)` — 删除节点
- `addEdge(config)` — 添加连线
- `toJSON()` / `fromJSON(data)` — 序列化/反序列化
- `fitView()` — 自适应视图
- `layoutGraph()` — dagre 自动布局
- `clear()` — 清空画布

### 2. x6-node-factory.ts — 节点样式工厂

生成统一风格的节点：

```typescript
import { createEntityNode } from '@/utils/x6-node-factory'

const node = createEntityNode({
  id: 'node_1',
  x: 100, y: 100,
  label: '设备',
  subLabel: 'CNC-001',
  color: '#667eea',
  data: { type: 'entity', properties: [...] }
})

canvasRef.value.addNode(node)
```

三种节点类型：
- `createEntityNode()` — 矩形边框（用于对象/实体）
- `createProcessNode()` — 圆角胶囊（用于流程/步骤）
- `createDecisionNode()` — 菱形（用于判断/决策）

### 3. MainLayout.vue — 应用外壳

标准 B 端布局：
- 顶栏：Logo、搜索、主题切换、用户菜单
- 侧边栏：可折叠菜单带图标
- 内容区：`<router-view>` + keep-alive 缓存

---

## 添加新页面

```typescript
// 1. 创建组件
// src/views/RuleEngine.vue
<template>
  <div class="page-container">
    <X6Canvas ref="canvasRef" @node:click="onNodeClick" />
  </div>
</template>

// 2. 添加路由
// src/router/index.ts
{
  path: 'rule-engine',
  name: 'RuleEngine',
  component: () => import('@/views/RuleEngine.vue'),
  meta: { title: '规则引擎', icon: 'Cpu' }
}

// 3. 添加菜单项
// src/layouts/MainLayout.vue
<el-menu-item index="/rule-engine">
  <el-icon><Cpu /></el-icon>
  <template #title>规则引擎</template>
</el-menu-item>
```

---

## 原型开发流程

```
1. 在 router 定义页面        (5 min)
2. 用 X6Canvas 创建布局      (10 min)
3. 在工厂定义节点类型        (10 min)
4. 添加拖拽交互              (15 min)
5. 用 Element Plus 样式化    (10 min)
6. 添加 Mock 数据            (10 min)
                              --------
总计：~60 分钟完成一个完整的图编辑原型
```

---

## 最佳实践

### 1. 始终使用 X6Canvas 组件
不要直接创建 Graph 实例。组件已处理插件注册、生命周期和清理。

### 2. 使用节点工厂
不要内联节点样式。工厂确保所有节点类型风格一致。

### 3. CSS 变量驱动主题
```scss
// 始终使用变量，不要硬编码颜色
background: var(--bg-card);      // ✅
background: #ffffff;             // ❌
```

### 4. 优先使用 Element Plus 组件
自建 UI 前先查 Element Plus 有没有：
- 表格 → `el-table`
- 表单 → `el-form`
- 弹窗 → `el-dialog`
- 菜单 → `el-menu`
- 标签页 → `el-tabs`

### 5. TypeScript 定义节点数据
```typescript
interface NodeData {
  type: 'entity' | 'process' | 'decision'
  label: string
  properties: Property[]
  rules: Rule[]
}
```

---

## 常见问题

### 1. macOS 更新后 esbuild 安装失败
```bash
# 解决：删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 2. X6 画布不渲染
检查容器是否有明确高度：
```scss
.canvas-wrapper {
  height: 100%;  // 必须有高度
  overflow: hidden;
}
```

### 3. 拖拽不生效
确保源元素有 `draggable="true"` 且 `@dragstart` 设置了数据：
```typescript
e.dataTransfer?.setData('node-type', JSON.stringify(item))
```

### 4. dagre 布局不生效
在 `layoutGraph()` 后用 setTimeout 调用 `fitView()`：
```typescript
layoutGraph()
setTimeout(() => fitView(), 100)
```

---

## 效率对比

| 任务 | 不用此技术栈 | 用此技术栈 | 提升 |
|------|-------------|-----------|------|
| 图画布搭建 | 2-3 天 | 10 min | 30x |
| 节点拖拽 | 1-2 天 | 5 min | 30x |
| 撤销重做 | 1 天 | 0（内置） | ∞ |
| 自动布局 | 2-3 天 | 5 min | 50x |
| 主题系统 | 1 天 | 0（内置） | ∞ |
| **原型总计** | **2-3 周** | **1-2 小时** | **20x** |

---

## 开箱即用模板

已创建好的项目骨架：
`~/Desktop/Git/Prototype_Dev`

```bash
cd Prototype_Dev
npm install
npm run dev
# 打开 http://localhost:5173
```

---

## 相关 Skills

- [pm-prototype-workflow](pm-prototype-workflow.zh-CN.md) — AI Native 产品原型开发工作流（React 版）
- [requirements-breakdown](requirements-breakdown.zh-CN.md) — 需求拆解框架
