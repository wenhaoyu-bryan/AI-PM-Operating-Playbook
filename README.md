# AI PM Workbench

Turn fuzzy AI product ideas into structured delivery artifacts. No backend, no API keys, no accounts — everything runs in your browser.

**English** | [中文](README.zh-CN.md)

---

## What is this

A static workbench that helps AI Product Managers go from ambiguous product concepts to actionable documents in 4 steps:

1. **Product Framing** — Define the user, problem, business scenario, and knowledge context
2. **Design Intelligence** — Choose the right AI capability (RAG, agent, classification, generation) and design the workflow
3. **Evaluate & Risk** — Set metrics, acceptance criteria, and identify production risks
4. **Export** — Generate 6 structured documents ready for stakeholder review or coding agent handoff

**Try it:** https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/workbench/

## What you get

The Workbench generates 6 documents from your inputs:

| Document | Purpose |
|----------|---------|
| **AI Product Brief** | Structured concept summary for stakeholder alignment |
| **Workflow Specification** | Step-by-step AI/agent workflow with Mermaid diagram |
| **Evaluation Plan** | Metrics, datasets, and review processes |
| **Acceptance Criteria** | Testable checklist for prototype and production |
| **Coding Agent Handoff** | Implementation brief optimized for AI coding tools |
| **CLAUDE.md Starter** | Project context file for Claude Code |

## Example projects

The Workbench ships with 3 pre-built examples you can load and modify:

- **Prompt-to-Ontology** — Turn messy business concepts into structured ontology assets
- **Industrial Agent Decision Support** — Diagnose manufacturing equipment issues with AI-assisted workflows
- **RAG Knowledge Assistant** — Help employees find answers from internal documentation

## Methodology

The Workbench is built on a set of frameworks for AI product thinking:

- **AI PM Canvas** — 12-dimension planning framework for structured AI product analysis
- **Agent Product Design** — Designing goal-directed AI workflows with tools, boundaries, and human review
- **Vibe Coding** — Using coding agents to turn product intent into testable prototypes
- **Harness Engineering** — Context, tools, constraints, checks, and feedback loops for reliable coding agents

Read more: [Methodology](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/methodology/)

## Content library

| Section | Content |
|---------|---------|
| [01-product-thinking/](src/content/docs/en/ai-pm-role.md) | AI PM role, competency model, growth path |
| [02-ai-native-delivery/](src/content/docs/en/vibe-coding.md) | Vibe Coding, Harness Engineering, prototype development |
| [03-agent-and-ontology-systems/](src/content/docs/en/agent-product-design.md) | Agent product design, ontology product methodology |
| [04-case-studies/](src/content/docs/en/prompt-to-ontology.md) | Project case notes |
| [05-templates/](src/content/docs/en/ai_prd_lite_template.md) | Canvas, PRD Lite, case study templates |
| [06-resources/](src/content/docs/en/books.md) | Recommended books and courses |

## Tech stack

- **Framework:** Astro 7.x + React 19
- **UI:** shadcn/ui + Tailwind CSS 4.x
- **State:** localStorage (client-side only, no backend)
- **Deploy:** GitHub Pages
- **i18n:** English + Chinese bilingual

## Local development

```bash
npm install
npm run dev        # http://localhost:4322
npm run build      # production build to dist/
```

## Author

**Wenhao Yu (余文豪)**
- GitHub: [@wenhaoyu-bryan](https://github.com/wenhaoyu-bryan)
- Homepage: [wenhaoyu-bryan.github.io](https://wenhaoyu-bryan.github.io/)
- Focus: Industrial AI Agent, ontology-driven products, AI-native prototyping

## License

MIT
