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

# Vue 3 + Element Plus + AntV X6 Prototype Stack

> A frontend prototype tech stack for B-side products with complex visualization needs
> Core advantage: Production-grade graph editing with minimal code

---

## When to Use This Stack

### ✅ Best For
- Ontology/knowledge graph modeling tools
- Workflow/rule engine visual editors
- Industrial IoT dashboards
- Data governance platforms
- Any product that needs drag-and-drop node editing

### ❌ Not Ideal For
- Simple CRUD admin panels (use React + Ant Design instead)
- Consumer-facing apps (use React + Tailwind)
- Mobile-first products
- Content-heavy websites

---

## Tech Stack Overview

| Layer | Library | Version | License | Purpose |
|-------|---------|---------|---------|---------|
| Framework | Vue 3 | 3.3.x | MIT | Composition API + TypeScript |
| Build | Vite | 5.x | MIT | Fast HMR and build |
| UI Library | Element Plus | 2.13.x | MIT | 70+ components out of box |
| Graph Engine | AntV X6 | 2.19.x | MIT | Graph editing (nodes, edges, layouts) |
| Graph Visualization | AntV G6 | 5.x | MIT | Read-only graph rendering |
| State | Pinia | 3.x | MIT | State management with devtools |
| Router | Vue Router | 5.x | MIT | Hash-mode routing |
| Layout Algorithm | dagre | 0.8.x | BSD | Auto-layout for directed graphs |
| CSS | Sass | 1.x | MIT | CSS variables for theming |

**Total cost: $0** — All libraries are MIT/Apache 2.0 licensed.

---

## Why This Stack (vs React + Tailwind)

| Dimension | Vue 3 + Element Plus + X6 | React + Tailwind + D3 |
|-----------|---------------------------|------------------------|
| Graph editing | Built-in (7 plugins) | Manual (weeks of work) |
| UI components | 70+ ready-made | Need to build or buy |
| Learning curve | Lower (template syntax) | Higher (JSX + hooks) |
| Theme system | CSS variables + Sass | Tailwind config |
| Best for | B-side, visualization | Consumer, content |

**Key insight:** If your product needs graph editing (nodes, edges, drag-drop), AntV X6 saves 2-4 weeks of development vs building with D3 or react-flow.

---

## Project Structure

```
project/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.ts                    # Entry point
    ├── App.vue                    # Root component
    ├── router/
    │   └── index.ts               # Route config
    ├── stores/
    │   ├── theme.ts               # Dark/light theme
    │   └── user.ts                # User state
    ├── styles/
    │   └── global.scss            # CSS variables
    ├── layouts/
    │   └── MainLayout.vue         # Header + sidebar + content
    ├── components/
    │   └── X6Canvas.vue           # Reusable graph canvas
    ├── utils/
    │   └── x6-node-factory.ts     # Node style factory
    └── views/
        ├── Dashboard.vue          # Overview page
        └── CanvasDemo.vue         # Graph editing demo
```

---

## Core Components

### 1. X6Canvas.vue — Reusable Graph Canvas

The most important component. Wraps AntV X6 with 7 plugins:

```
Plugins enabled:
├── Keyboard      → Ctrl+Z/Y undo/redo, Delete, Ctrl+C/V
├── Selection     → Click to select, multi-select
├── Clipboard     → Copy/paste nodes
├── History       → Undo/redo stack
├── Snapline      → Alignment guides when dragging
├── MiniMap       → Overview panel (bottom-right)
└── Scroller      → Pan and zoom canvas
```

**Usage:**
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

**Exposed methods:**
- `addNode(config)` — Add a node
- `removeNode(id)` — Remove a node
- `addEdge(config)` — Add an edge
- `toJSON()` / `fromJSON(data)` — Serialize/deserialize
- `fitView()` — Auto-fit all nodes
- `layoutGraph()` — Auto-layout with dagre
- `clear()` — Clear canvas

### 2. x6-node-factory.ts — Node Style Factory

Generates consistent node styles:

```typescript
import { createEntityNode } from '@/utils/x6-node-factory'

const node = createEntityNode({
  id: 'node_1',
  x: 100, y: 100,
  label: 'Equipment',
  subLabel: 'CNC-001',
  color: '#667eea',
  data: { type: 'entity', properties: [...] }
})

canvasRef.value.addNode(node)
```

Three node types:
- `createEntityNode()` — Rectangle with border (for objects)
- `createProcessNode()` — Rounded pill (for processes)
- `createDecisionNode()` — Diamond (for decisions)

### 3. MainLayout.vue — App Shell

Standard B-side layout:
- Header: Logo, search, theme toggle, user menu
- Sidebar: Collapsible menu with icons
- Content: `<router-view>` with keep-alive

---

## Adding a New Page

```typescript
// 1. Create component
// src/views/RuleEngine.vue
<template>
  <div class="page-container">
    <X6Canvas ref="canvasRef" @node:click="onNodeClick" />
  </div>
</template>

// 2. Add route
// src/router/index.ts
{
  path: 'rule-engine',
  name: 'RuleEngine',
  component: () => import('@/views/RuleEngine.vue'),
  meta: { title: 'Rule Engine', icon: 'Cpu' }
}

// 3. Add menu item
// src/layouts/MainLayout.vue
<el-menu-item index="/rule-engine">
  <el-icon><Cpu /></el-icon>
  <template #title>Rule Engine</template>
</el-menu-item>
```

---

## Prototype Workflow

```
1. Define pages in router     (5 min)
2. Create layout with X6Canvas (10 min)
3. Define node types in factory (10 min)
4. Add drag-drop interactions  (15 min)
5. Style with Element Plus     (10 min)
6. Add mock data               (10 min)
                               --------
Total: ~60 min for a full graph editing prototype
```

---

## Best Practices

### 1. Always Use the X6Canvas Component
Don't create Graph instances directly. The component handles plugin registration, lifecycle, and cleanup.

### 2. Use the Node Factory
Don't inline node styles. The factory ensures consistency across all node types.

### 3. CSS Variables for Theming
```scss
// Always use variables, never hardcode colors
background: var(--bg-card);      // ✅
background: #ffffff;             // ❌
```

### 4. Element Plus Components First
Before building custom UI, check if Element Plus has it:
- Tables → `el-table`
- Forms → `el-form`
- Dialogs → `el-dialog`
- Menus → `el-menu`
- Tabs → `el-tabs`

### 5. TypeScript for Node Data
```typescript
interface NodeData {
  type: 'entity' | 'process' | 'decision'
  label: string
  properties: Property[]
  rules: Rule[]
}
```

---

## Common Pitfalls

### 1. esbuild fails after macOS update
```bash
# Fix: delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 2. X6 canvas not rendering
Check that the container has explicit height:
```scss
.canvas-wrapper {
  height: 100%;  // Must have height
  overflow: hidden;
}
```

### 3. Drag-drop not working
Ensure `draggable="true"` on source element and `@dragstart` sets data:
```typescript
e.dataTransfer?.setData('node-type', JSON.stringify(item))
```

### 4. dagre layout not applying
Call `fitView()` after `layoutGraph()` with a timeout:
```typescript
layoutGraph()
setTimeout(() => fitView(), 100)
```

---

## Efficiency Comparison

| Task | Without This Stack | With This Stack | Speedup |
|------|-------------------|-----------------|---------|
| Graph canvas setup | 2-3 days | 10 min | 30x |
| Node drag-drop | 1-2 days | 5 min | 30x |
| Undo/redo | 1 day | 0 (built-in) | ∞ |
| Auto-layout | 2-3 days | 5 min | 50x |
| Theme system | 1 day | 0 (built-in) | ∞ |
| **Total prototype** | **2-3 weeks** | **1-2 hours** | **20x** |

---

## Starter Template

A ready-to-use project skeleton is available at:
`~/Desktop/Git/Prototype_Dev`

```bash
cd Prototype_Dev
npm install
npm run dev
# Open http://localhost:5173
```

---

## Related Skills

- [pm-prototype-workflow](pm-prototype-workflow.md) — AI Native prototype development workflow (React version)
- [requirements-breakdown](requirements-breakdown.md) — Requirements decomposition framework
