# Harness Engineering：面向 AI 辅助产品交付的约束体系设计

**English** | **[Chinese](harness-engineering.zh-CN.md)**

> Designing the context, constraints, tools, checks, and feedback loops that help coding agents work reliably.

---

## What Is Harness Engineering?

Harness Engineering is the discipline of designing the **environment** in which a coding agent operates. A large language model can generate and reason. An agent adds a loop around the model — planning, acting, observing, and iterating. The harness wraps that agent loop with the context, tools, constraints, checks, memory, and recovery mechanisms it needs to produce reliable results.

The improvement does not come from a single larger prompt. It comes from creating a staged workflow in which each phase produces an artifact that constrains and improves the next phase.

### Model, Agent, and Harness

| Layer | Role |
|-------|------|
| **Model** | Generates text, reasons about code, drafts solutions |
| **Agent loop** | Plans a step, takes an action (edit a file, run a test), observes the result, and iterates |
| **Harness** | Provides repository instructions, product context, architecture decisions, tool access, scope constraints, automated checks, and session memory |

The harness is the **environment** around the agent — not just the prompt. It includes project files, CI checks, tool definitions, decision logs, and the workflow structure that guides work from idea to shipped product.

---

## The Six Parts of a Harness

A well-designed harness has six parts:

### 1. Context

Repository instructions, product intent, architecture decisions, domain terminology, and concrete examples — including counter-examples that show what not to do. Context is what the agent reads before it starts working.

Examples of context artifacts:
- `CLAUDE.md` or `AGENTS.md` — top-level instructions for the coding agent
- `docs/product-context.md` — who the user is, what problem is being solved, what success looks like
- `docs/architecture.md` — system boundaries, tech stack, key patterns

### 2. Workflow

The staged sequence of work: brainstorming, specification, implementation planning, incremental execution, review, and correction. Each phase produces a written artifact that the next phase depends on.

### 3. Tools

The capabilities available to the agent: file access, terminal commands, test runners, linters, browser or screenshot tools, and documentation lookup. The set of tools should be intentional — each tool the agent can call is a capability, and each missing tool is a boundary.

### 4. Constraints

Scope limits, architecture boundaries, security restrictions, non-goals, and invariants. Constraints prevent the agent from expanding scope, introducing unsupported patterns, or violating safety requirements. They are most effective when written as explicit rules in project-level instructions.

### 5. Sensors and Evaluation

Automated checks that give the agent feedback: build checks, test suites, linting, visual inspection, acceptance criteria, and regression detection. Sensors close the loop — without them the agent cannot know whether its output is correct.

### 6. State and Handoff

Project memory, decision logs, implementation plans, progress artifacts, version control history, and the context prepared for the next session. State is what lets work continue across sessions and across people.

---

## Staged Workflow

```
Ambiguous idea
    |
    v
Structured brainstorming
    |
    v
Agreed product direction
    |
    v
Written specification
    |
    v
Implementation plan
    |
    v
Incremental coding-agent execution
    |
    v
Build / test / visual review
    |
    v
Content and product judgment
    |
    v
Update the harness and repeat
```

Each phase produces a concrete artifact: a brainstorm summary, a product direction document, a specification, an implementation plan, working code, test results, review notes. The next phase inherits the constraints and context from the previous one. This is what makes agent work reliable — not a better prompt, but a better structure.

---

## What the AI PM Owns in the Harness

Harness Engineering is not solely an engineering discipline. The product manager owns specific parts of the harness that are about intent, scope, and judgment.

**What the AI PM owns:**

- Product intent and user/business context
- Scope definition and non-goals
- Interaction and workflow requirements
- Examples and counter-examples
- Acceptance criteria and evaluation metrics
- Human review points — where a person must inspect before the work continues
- Business and product risk assessment
- Stakeholder narrative — what to communicate and when

**What still requires engineering judgment:**

- Security architecture and threat modeling
- Infrastructure and deployment design
- Scalability and performance characteristics
- Production data handling and privacy
- Observability, logging, and alerting
- Code maintainability and technical debt
- Integration reliability and failure recovery
- Incident response procedures

The PM defines what good looks like. Engineering defines how to make it safe and reliable.

---

## Project Structure Example

A harness lives in the repository itself. The exact structure depends on the project, but the pattern is consistent:

```
CLAUDE.md / AGENTS.md          # Top-level agent instructions
docs/
  product-context.md            # Who the user is, what problem we solve
  architecture.md               # System boundaries, tech stack, patterns
  decisions.md                  # Log of key decisions and rationale
  acceptance-criteria.md        # What "done" means for this project
  plans/                        # Implementation plans for each work phase
tests/                          # Automated checks the agent can run
scripts/                        # Helper scripts (build, deploy, lint)
```

**Purpose of each artifact:**

- **`CLAUDE.md` / `AGENTS.md`** — The first thing the agent reads. Contains project-wide rules, constraints, and conventions.
- **`product-context.md`** — Keeps the agent aligned with user needs and business goals across sessions.
- **`architecture.md`** — Documents system design decisions so the agent does not introduce incompatible patterns.
- **`decisions.md`** — A running log of why choices were made, preventing the agent from revisiting settled decisions.
- **`acceptance-criteria.md`** — Defines the definition of done. Agents and humans both use this to evaluate output.
- **`plans/`** — Step-by-step implementation plans that break work into reviewable increments.
- **`tests/`** — The sensors that give the agent feedback on whether its code works.
- **`scripts/`** — Automation that keeps the feedback loop fast and consistent.

---

## Key Principles

### Structure over prompts

A single prompt, no matter how detailed, cannot substitute for a structured workflow. Build the scaffolding first — the agent will use it.

### Artifacts over conversations

Every important decision should be written down in a file the agent can read, not buried in a chat history. Documents persist. Conversations do not.

### Constraints over instructions

Telling the agent what not to do is often more effective than telling it what to do. Explicit constraints — scope limits, banned patterns, non-goals — reduce the space of possible errors.

### Feedback over trust

Never assume the agent's output is correct. Build checks — tests, linters, visual reviews, acceptance criteria — that make correctness verifiable rather than assumed.

### Incremental over monolithic

Break work into small, reviewable steps. Each step should produce something testable. This makes errors visible early and corrections cheap.

---

## Further Reading

- [Anthropic — Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Anthropic — Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic — Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-for-long-running-application-development)

---

*Last updated: 2026-06-25*
