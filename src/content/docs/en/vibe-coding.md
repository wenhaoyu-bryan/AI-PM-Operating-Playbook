# Vibe Coding for Product Discovery and Prototyping

**English** | **[中文](../zh-CN/vibe-coding.md)**

Using coding agents to turn product intent into testable prototypes — without confusing prototypes with production software.

> **In this playbook**, vibe coding means AI-assisted product prototyping in which the PM defines product intent, scope, constraints, examples, and acceptance criteria while a coding agent assists with implementation. It does not mean accepting generated code without understanding or verification.

> Product judgment + coding agents = a faster prototype and learning loop

---

## What Is Vibe Coding?

**Definition**: A product manager defines product intent, architectural boundaries, and design constraints, while a coding agent handles code generation, debugging, and iteration. The PM retains responsibility for what gets built and why.

**Core Value**:
- AI PMs can independently build many early prototypes, reducing engineering dependency during discovery
- The output is not code — it is a deeper understanding of the problem domain
- You learn systems by building them, not by reading specifications alone

**Use Cases**:
- Interaction prototypes and workflow demonstrations
- Technical exploration and architecture feasibility checks
- Internal tools with controlled risk
- Product concept validation
- Executable specifications for engineering handoff

---

## Practice Cases

### An Ontology Product Experiment

**Background**: Entering the semiconductor industry as an AI PM, needing to understand the underlying logic of ontology-driven enterprise platforms through hands-on exploration.

**Approach**:
- One person, one coding agent (Claude), iterative cycles over two weeks
- No Sprint Planning, no Stand-ups — direct product-to-prototype workflow

**Output**:
- A working ontology prototype demonstrating graph-based entity relationships
- A complete architectural understanding framework
- A technical write-up capturing domain insights

**Key Insight**:
> "The hardest part of building an ontology system is not the code — it is the mental model. Understanding that a graph database is not an ontology, an ontology is not a schema, and a schema is not a data model — these are concentric layers of abstraction, and getting them right is a product problem, not an engineering problem."

### An Industrial Agent Platform Prototype

**Background**: Validating whether a manufacturing digital-worker coordination platform was feasible before committing engineering resources.

**Approach**:
- PM-defined workflow sketches turned into interactive prototypes using a coding agent
- Architecture exploration through working code rather than static diagrams
- Iterative refinement driven by stakeholder feedback on the prototype itself

**Output**:
- A navigable prototype that served as a concrete communication artifact
- Sharper requirements that reduced ambiguity in the subsequent engineering sprint
- Clearer boundary decisions about what the platform should and should not do

---

## Key Skills for Vibe Coding

### 1. Architectural Thinking

**Core Competencies**:
- Defining system boundaries
- Specifying inter-layer contracts
- Reasoning about data flows and failure modes

**Practices**:
- Draw the architecture diagram before prompting the agent
- Define clear API interfaces and data contracts
- Identify where the prototype must be faithful to production constraints and where it can simplify

### 2. Quality Judgment

**Core Competencies**:
- Evaluating the correctness and completeness of agent output
- Identifying potential issues, missing edge cases, and architectural risks
- Deciding when a prototype is "good enough to learn from" versus "good enough to ship"

**Practices**:
- Establish a quality checklist before each iteration
- Test key interaction paths and boundary conditions
- Validate that architectural decisions hold up under realistic data

### 3. Prompt Engineering (Supporting Skill)

**Core Competencies**:
- Translating product intent into structured instructions a coding agent can execute
- Designing clear constraints, acceptance criteria, and examples
- Handling edge cases through explicit specification rather than hope

**Practices**:
- Describe requirements in a structured, layered way (intent, scope, constraints, examples)
- Provide concrete examples and counter-examples
- Specify technical constraints and non-functional expectations upfront

> Prompt engineering is a supporting skill — the primary value comes from product judgment, domain understanding, and architectural clarity. Good prompts are a consequence of clear thinking, not a substitute for it.

---

## Vibe Coding Workflow

### Phase 1: Requirements Definition

```markdown
## Product Intent
[One paragraph describing the product positioning and the question this prototype should answer]

## Architectural Boundaries
- Input: [What data comes in]
- Processing: [How it is processed]
- Output: [What results come out]

## Design Constraints
- Tech Stack: [e.g. React + Vite + Tailwind CSS]
- Performance Requirements: [e.g. Response time < 100ms]
- Scope Limits: [What this prototype intentionally does NOT cover]
```

### Phase 2: Architecture Design

```markdown
## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │ →   │   Backend   │ →   │  Database   │
│   React     │     │   FastAPI   │     │   SQLite    │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Data Flow
1. User Input → Frontend Component
2. Frontend Component → API Call
3. API Call → Backend Processing
4. Backend Processing → Database Query
5. Database Query → Return Result

## API Contract
- GET /api/items → Returns item list
- POST /api/items → Creates new item
- PUT /api/items/:id → Updates item
- DELETE /api/items/:id → Deletes item
```

### Phase 3: Code Generation

```markdown
## Prompt Template

You are a senior frontend engineer skilled at rapidly building prototypes
with React + Vite + Tailwind CSS.

Based on the architecture design below, generate a runnable project.

Requirements:
1. Use React 19 + Vite + Tailwind CSS 4
2. All components must be functional components with hooks
3. All styling must use Tailwind CSS
4. Use mock data for all data sources
5. Include basic error handling for API calls

Architecture Design:
[Paste the architecture design from Phase 2]
```

### Phase 4: Iterative Refinement

```markdown
## Iteration Prompt

Based on the current code, make the following changes:

1. [Change 1]: [Specific description]
2. [Change 2]: [Specific description]

Constraints:
- Keep the existing architecture unchanged
- Only modify the specified parts
- Ensure other features are not affected
- Note any assumptions you are making
```

---

## Best Practices

### 1. Understand Before Building

**Wrong Approach**:
- Having the agent write code directly without a mental model
- Making changes without understanding the architecture
- Starting over when encountering problems

**Right Approach**:
- Understand the business requirements and the question the prototype should answer first
- Design or sketch the system architecture first
- Define the interface contracts and data models first

### 2. Define Clear Boundaries

**Wrong Approach**:
- Vague requirement descriptions
- Unclear technical constraints
- No acceptance criteria

**Right Approach**:
- Structured requirement documents with explicit scope limits
- Explicit technical constraints and non-functional expectations
- Specific acceptance criteria that determine when the prototype is "done"

### 3. Iterate, Don't Rewrite

**Wrong Approach**:
- Rewriting from scratch when encountering problems
- Not preserving useful code from previous iterations
- Losing architectural decisions by regenerating everything

**Right Approach**:
- Iterate on the existing foundation
- Preserve and refactor useful code
- Optimize and improve incrementally, documenting what changed and why

### 4. Verify, Don't Trust

**Wrong Approach**:
- Fully trusting agent output without inspection
- Using generated code without testing
- Not verifying edge cases or error handling

**Right Approach**:
- Test key interaction paths
- Verify edge cases and boundary conditions
- Check error handling and failure modes
- Inspect generated code for obvious security or logic issues

---

## Where the Leverage Comes From

The value of PM-led prototyping is not raw speed. It is:

- **Reducing translation loss** between idea and prototype — the person who understands the problem can direct the implementation directly
- **Validating interaction and workflow assumptions earlier** — before engineering commits to an architecture
- **Making requirements executable and inspectable** — a working prototype removes ambiguity that documents cannot
- **Allowing more low-cost iterations** before engineering commitment — each cycle sharpens the requirements
- **Improving communication** through working demonstrations rather than abstract specifications

> The actual gain varies by scope, technical complexity, data availability, and production requirements. Some prototypes can be built in hours; others require days of careful iteration. The point is faster learning, not a fixed time guarantee.

---

## Caveats and Boundaries

### Suitable For

- Interaction prototypes and workflow demonstrations
- Technical exploration and feasibility checks
- Internal tools with controlled, bounded risk
- Product concept validation with stakeholders
- Executable specifications to hand off to engineering

### Requires Engineering Review

Work in this category can start as a PM-led prototype but must go through engineering review before any real-world deployment:

- Anything touching real user data
- Authentication and authorization logic
- External API integrations
- Persistent databases and data migrations
- Business-critical workflows
- Deployment beyond controlled internal demos

### Not Safe as Prototype-Only Work

These domains require engineering ownership from the start. A PM prototype may be useful for communication, but must not be mistaken for a viable system:

- Financial transactions or monetary calculations
- Regulated decisions (medical, legal, compliance)
- Safety-critical industrial control systems
- Sensitive personal data processing
- Production security architecture
- Autonomous high-impact actions without human oversight

---

## Summary

**Core Position**:
- An AI-native PRD can also function as an instruction set for coding agents
- A prototype can serve as an interactive requirements specification
- Conversational refinement can shorten some prototype iteration loops

**What PM-Led Prototyping Changes**:
- AI PMs can independently build many early prototypes
- This reduces engineering dependency during discovery, not the need for engineering in production
- Engineers remain essential for architecture, security, reliability, maintainability, performance, integration, and operations
- The value of PM-led prototyping is faster learning and more precise communication — not replacing engineering expertise

**Toolchain**:
- Requirements Input: Markdown
- Prototype Generation: Coding agents (Claude, etc.)
- Typical Stack: React + Vite + Tailwind CSS (or any stack the agent can scaffold)

---

*Last Updated: 2026-06-25*
*Based on practice from ontology-driven product experiments and industrial agent platform prototyping*
