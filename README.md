# AI PM Operating Playbook

Practical frameworks, workflows, and case notes for AI Product Managers building agents, ontology systems, and AI-native prototypes.

**English** | [中文](README.zh-CN.md)

---

## What is this

A playbook that turns vague business problems into structured AI product concepts, prototypes, and evaluation plans.

This is not a course, not a generic AI resource list, and not a portfolio. This is the operating system behind how I think about product decisions, design agent workflows, plan human review points, and coordinate AI-assisted delivery.

Core content:

- **AI PM Canvas** — 12-dimension planning framework (interactive tool)
- **Vibe Coding** — PM + LLM = Full-Stack Developer
- **Harness Engineering** — Designing the operating framework for AI Agents
- **Ontology Systems** — Enterprise knowledge graph-driven AI products
- **Case Studies** — From Prompt to Ontology, industrial agent prototypes

## Online

**https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/**

## AI PM Canvas — 12-Dimension Planning Tool

The core interactive tool of this project. Use it before writing PRDs, building prototypes, or evaluating AI ideas:

| Group | Dimensions |
|-------|-----------|
| **Context** | Business Scenario · User / Operator · Decision to Support |
| **Knowledge** | Data / Knowledge Sources · Object Model |
| **AI Layer** | AI / Agent Capability · Workflow Boundary · Human Review Point |
| **Delivery** | Evaluation Metric · Prototype Scope · Production Risk · Product Narrative |

Use online: [English](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/canvas/) · [中文](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/zh-CN/canvas/)

## Chapters

| Section | Content |
|---------|---------|
| [01-product-thinking/](src/content/docs/en/ai-pm-role.md) | AI PM role, competency model, growth path |
| [02-ai-native-delivery/](src/content/docs/en/vibe-coding.md) | Vibe Coding, Harness Engineering, prototype development |
| [03-agent-and-ontology-systems/](src/content/docs/en/prompt-to-ontology.md) | Agent workflows, ontology product design |
| [04-case-studies/](src/content/docs/en/prompt-to-ontology.md) | Project case notes |
| [05-templates/](src/content/docs/en/ai_prd_lite_template.md) | Canvas, PRD Lite, case study templates |
| [06-resources/](src/content/docs/en/books.md) | Recommended books and courses |

## Tech Stack

- **Framework:** Astro 7.x + React 19
- **UI:** shadcn/ui + Tailwind CSS 4.x
- **Theme:** Dark (tech / sci-fi aesthetic)
- **Deploy:** GitHub Pages (CI/CD via GitHub Actions)
- **i18n:** English + Chinese bilingual

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Related Projects

| Project | Purpose |
|---------|---------|
| **AI-PM-Operating-Playbook** | Professional methodology (tools + frameworks) |
| [Prompt-to-Ontology](https://github.com/wenhaoyu-bryan/Prompt-to-Ontology) | Case project — ontology-driven AI product |
| [Agent-Space](https://github.com/wenhaoyu-bryan/Agent-Space) | Case project — manufacturing digital worker platform |

## Author

**Wenhao Yu (余文豪)**
- GitHub: [@wenhaoyu-bryan](https://github.com/wenhaoyu-bryan)
- Homepage: [wenhaoyu-bryan.github.io](https://wenhaoyu-bryan.github.io/)
- Focus: Industrial AI Agent, ontology-driven products, PM-led Vibe Coding

## License

MIT
