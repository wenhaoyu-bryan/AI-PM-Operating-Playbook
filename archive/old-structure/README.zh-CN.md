# AI PM Playbook

> AI Product Manager 的实践手册

[![GitHub Stars](https://img.shields.io/github/stars/wenhaoyu-bryan/AI-PM-Playbook?style=social)](https://github.com/wenhaoyu-bryan/AI-PM-Playbook)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/wenhaoyu-bryan/AI-PM-Playbook)](https://github.com/wenhaoyu-bryan/AI-PM-Playbook)

**中文** | **[English](README.md)** — Skills、Workflows、和对 Vibe Coding & Harness Engineering 的日常感悟

[![GitHub Stars](https://img.shields.io/github/stars/wenhaoyu-bryan/AI-PM-Playbook?style=social)](https://github.com/wenhaoyu-bryan/AI-PM-Playbook)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/wenhaoyu-bryan/AI-PM-Playbook)](https://github.com/wenhaoyu-bryan/AI-PM-Playbook)

---

## 📖 关于这个仓库

这是一个 AI Product Manager 的**实践记录**，不是教程，不是指南，而是一个真实从业者在日常工作中的**学习笔记、技能沉淀、和认知迭代**。

**核心理念**：
- 🎯 **实践优先**：所有内容都来自真实项目，不是理论推演
- 🔄 **持续迭代**：每周更新，记录最新的学习和实践
- 💡 **认知沉淀**：不只是记录"怎么做"，更记录"为什么这么做"
- 🛠️ **可复用性**：所有技能都可以直接用在工作中

**适合谁看**：
- 想转型 AI PM 的产品经理
- 想了解 Vibe Coding 的开发者
- 对 AI Agent 产品化感兴趣的人
- 想学习 Harness Engineering 的工程师

---

## 📂 仓库结构

```
AI-PM-Playbook/
├── README.md                    # 你正在读的文件
├── skills/                      # 可复用技能 & 工作流
│   ├── pm-prototype-workflow/   # AI Native 原型开发工作流（React 版）
│   ├── vue3-x6-prototype-stack/ # Vue 3 + Element Plus + AntV X6（B 端）
│   ├── requirements-breakdown/  # 需求拆解框架
│   └── ...
├── workflows/                   # 工作流程
│   ├── vibe-coding.md          # Vibe Coding 实践指南
│   ├── harness-engineering.md  # Harness Engineering 入门
│   └── ...
├── insights/                    # 认知和感悟
│   ├── ai-pm-role.md           # AI PM 角色认知
│   ├── ontology-thinking.md    # 本体论思维
│   └── ...
├── projects/                    # 项目案例
│   ├── Prompt-to-Ontology/     # Ontology OS 项目
│   └── ...
└── resources/                   # 学习资源
    ├── books.md                # 推荐书籍
    ├── courses.md              # 推荐课程
    └── ...
```

---

## 🎯 核心技能

### 1. AI Native 产品开发工作流

**核心理念**：PRD 不是文档，是给 AI 的指令集

```
需求输入 → AI 生成 PRD → AI 生成原型 → 快速迭代 → 交付验证
   ↓           ↓              ↓            ↓          ↓
 10 min     20 min         30 min       按需       即时
```

**效率提升**：从需求到原型 2-4 周 → 1-2 小时（15-20x）

**详细内容**：[skills/pm-prototype-workflow/](skills/pm-prototype-workflow/)

---

### 2. Vibe Coding 实践

**核心理念**：产品经理 + LLM = 全栈开发者

**关键洞察**：
- 不是"学编程"，是"学架构思维"
- 定义边界、指定契约、推理数据流
- 让 LLM 处理语法，PM 处理产品逻辑

**实践案例**：
- Ontology OS：一个人、一个模型、两周迭代
- 产出的不是代码，是认知

**详细内容**：[workflows/vibe-coding.md](workflows/vibe-coding.md)

---

### 3. Harness Engineering

**核心理念**：不是写代码，是驾驭 AI 写代码

**关键技能**：
- Prompt Engineering（给 AI 的指令设计）
- Architecture Design（系统架构设计）
- Error Handling（错误处理和边界情况）
- Quality Assurance（质量保证和验证）

**详细内容**：[workflows/harness-engineering.md](workflows/harness-engineering.md)

---

### 4. Vue 3 + X6 原型技术栈

**核心理念**：用最少代码实现生产级图编辑能力，适合 B 端可视化产品

**技术栈**：
- Vue 3 + TypeScript + Vite 5
- Element Plus（70+ UI 组件）
- AntV X6（图引擎，7 个插件全开）
- dagre（自动布局算法）

**关键优势**：AntV X6 比 D3/react-flow 节省 2-4 周图编辑开发

**效率提升**：60 分钟完成完整图编辑原型（20x 提速）

**成本**：¥0 — 所有库均为 MIT/Apache 2.0 开源许可

**详细内容**：[skills/vue3-x6-prototype-stack/](skills/vue3-x6-prototype-stack/)

---

## 💡 认知和感悟

### AI PM 的角色演变

```
传统 PM：需求 → 文档 → 设计 → 开发 → 测试 → 上线
AI PM：  需求 → AI 指令 → AI 生成 → 验证 → 迭代
```

**核心变化**：
- 从"写文档"到"写指令"
- 从"管理开发"到"驾驭 AI"
- 从"线性流程"到"快速迭代"

**关键能力**：
- 架构思维（定义边界和契约）
- Prompt Engineering（给 AI 的指令设计）
- 质量判断（判断 AI 产出的质量）
- 快速验证（快速验证需求和假设）

---

### 本体论思维

**核心洞察**：
> "构建本体系统最难的部分不是代码，是心智模型。理解图数据库不是本体，本体不是 Schema，Schema 不是数据模型——这些是同心圆的抽象层级，搞对它们是产品问题，不是工程问题。"

**实践案例**：
- Ontology OS：逆向工程 Palantir AIP
- 关键决策：事实表是节点，不是边
- 架构洞察：Neo4j 是数据源，NetworkX 是计算引擎，LLM 是推理层

---

### Vibe Coding 的收获

**最有价值的认知**：
> "构建本体系统最难的部分不是代码，是心智模型。"

**实践收获**：
- 不是"学编程"，是"学架构思维"
- 产出的不是代码，是认知框架
- PM + LLM 可以交付全栈原型

**适用场景**：
- 技术原型验证
- 架构探索
- 快速 MVP 开发

---

## 🛠️ 项目案例

### Prompt to Ontology (Ontology OS)

**定位**：企业本体操作系统

**核心洞察**：
> "把企业数据从'表格'变成'活的知识图谱'"

**技术栈**：
- 前端：React 18 + D3.js + Tailwind CSS 4
- 后端：FastAPI + Neo4j + NetworkX
- LLM：MiniMax / OpenAI / Anthropic

**关键架构决策**：
- Neo4j 是数据源，NetworkX 是计算引擎，LLM 是推理层
- 事实表是节点，不是边
- 动作挂对象，状态驱动行为

**GitHub**：[Prompt-to-Ontology](https://github.com/wenhaoyu-bryan/Prompt-to-Ontology)

**详细内容**：[projects/Prompt-to-Ontology/](projects/Prompt-to-Ontology/)

---

## 📚 学习资源

### 推荐书籍

1. **《Thinking in Systems》** - Donella H. Meadows
   - 理解系统思维
   - 适合：想理解复杂系统的人

2. **《The Design of Everyday Things》** - Don Norman
   - 理解用户体验设计
   - 适合：想提升产品设计能力的人

3. **《Inspired》** - Marty Cagan
   - 理解产品管理
   - 适合：想成为产品经理的人

---

### 推荐课程

1. **Prompt Engineering for Developers**
   - DeepLearning.AI
   - 学习 Prompt Engineering 基础

2. **LangChain for LLM Application Development**
   - DeepLearning.AI
   - 学习 LLM 应用开发

3. **AI Product Management**
   - Coursera
   - 学习 AI 产品管理

---

## 📈 更新日志

### 2026-05-18
- ✅ 创建仓库
- ✅ 添加 PM Prototype Workflow 技能
- ✅ 添加 Requirements Breakdown 技能
- ✅ 添加 Vibe Coding 实践指南
- ✅ 添加 Harness Engineering 入门
- ✅ 添加 AI PM 角色认知
- ✅ 添加 Prompt to Ontology 项目案例
- ✅ 添加学习资源

### 未来计划
- [ ] 添加更多的技能
- [ ] 添加更多的项目案例
- [ ] 添加学习笔记
- [ ] 添加周报/月报

---

## 🤝 如何贡献

这个仓库主要是我的个人学习记录，但欢迎：

1. **提 Issue**：分享你的想法和建议
2. **提 PR**：添加你的实践案例
3. **讨论**：在 Discussions 中讨论

---

## 👥 Contributors

感谢以下贡献者：

- **Wenhao Yu** (余文豪) - 项目创建者和主要维护者
- **Hermes Agent** - AI 助手，协助内容生成、架构设计和代码实现

---

## 📝 许可证

MIT License - 自由使用和分享

---

## 🙏 致谢

感谢所有在 AI PM 道路上给予帮助的人：

- **开源社区**：提供工具和灵感
- **Hermes Agent**：AI 助手，协助完成这个项目

---

**最后更新**：2026-05-26
**维护者**：Wenhao Yu (余文豪)
**状态**：🟢 积极更新中