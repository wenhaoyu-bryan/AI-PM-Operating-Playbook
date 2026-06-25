# AI PM Operating Playbook

A static, privacy-friendly operating playbook that helps AI Product Managers turn fuzzy product concepts into structured briefs, evaluation plans, and coding agent handoffs.

[Open Operating Playbook](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/workbench/) · [View Examples](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/examples/)

---

## Product positioning

The AI PM Operating Playbook is a structured thinking tool for AI product managers. It replaces scattered notes and ad-hoc documents with a four-step workflow that produces reusable delivery artifacts. It is not a course, not a resource list, and not a portfolio.

## Open Operating Playbook

- [English Operating Playbook](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/workbench/)
- [Chinese Operating Playbook (操作手册)](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/zh-CN/workbench/)
- [Example Concepts](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/examples/)

## Core workflow

| Step | Purpose |
|------|---------|
| 1. Product Framing | Define the user, problem, business context, and knowledge sources |
| 2. AI Workflow Design | Choose the right AI capability, design the workflow boundary, and set human review points |
| 3. Evaluation & Risk | Set metrics, acceptance criteria, and production risks |
| 4. Export | Generate a reusable document pack for your team or coding agent |

## Generated outputs

| Artifact | Purpose |
|----------|---------|
| AI Product Brief | Structured concept summary for stakeholder alignment |
| Workflow Specification | Step-by-step AI/agent workflow with Mermaid diagram |
| Evaluation Plan | Metrics, datasets, and review processes |
| Acceptance Criteria | Testable checklist for prototype and production |
| Coding Agent Handoff | Implementation brief optimized for AI coding tools |
| CLAUDE.md Starter | Project context file for Claude Code |

## Example projects

Illustrative examples using simulated assumptions. Metrics and targets must be validated for each real project.

| Example | Type | Key Challenge |
|---------|------|---------------|
| Prompt-to-Ontology | Ontology / Knowledge | Turn ambiguous business terms into structured ontology assets |
| Industrial Agent Decision Support | Agent | Combine multi-system evidence while keeping high-impact actions under human control |
| RAG Knowledge Assistant | RAG | Help employees find accurate answers without surfacing sensitive or outdated content |

## Privacy

Project content is stored locally in the browser. The tool does not upload user-entered project data to a server.

## Import/export and local recovery

- Export your project as a JSON file at any time from the header menu.
- Import a previously exported JSON file to restore a project.
- The operating playbook auto-saves your work to localStorage as you type.
- No account or sign-in is required.

## Technology

- **Astro** + **React** for static site with interactive islands
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **GitHub Pages** for deployment

## Local development

```bash
npm install
npm run dev        # Open the local URL shown in the terminal
npm run check      # Type-check
npm run build      # Production build to dist/
```

## Supporting methodology

This tool is part of the [AI PM Operating Playbook](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/methodology/) — a collection of frameworks for AI product thinking:

- [AI PM Role](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/ai-pm-role/) — What it means to be an AI Product Manager
- [Vibe Coding](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/vibe-coding/) — Using coding agents for product prototyping
- [Harness Engineering](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/harness-engineering/) — Directing AI to write code reliably
- [Agent Product Design](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/agent-product-design/) — Designing goal-directed AI workflows
- [Prompt-to-Ontology Case Study](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/prompt-to-ontology/) — Real project example

## Author

**Wenhao Yu (余文豪)**
- GitHub: [@wenhaoyu-bryan](https://github.com/wenhaoyu-bryan)
- Homepage: [wenhaoyu-bryan.github.io](https://wenhaoyu-bryan.github.io/)
- Focus: Industrial AI Agent, ontology-driven products, AI-native prototyping

## License

MIT
