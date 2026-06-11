# Vibe Coding Practice Guide

**English** | **[中文](vibe-coding.zh-CN.md)**


> Product Manager + LLM = Full-Stack Developer
> Not "learning to code" — "learning to think architecturally"

---

## What is Vibe Coding?

**Definition**: A product manager defines product intent, architectural boundaries, and design constraints, while a large language model handles code generation, debugging, and iteration.

**Core Value**:
- Product managers work directly with implementation, no traditional software engineers needed
- The output is not code — it's understanding
- Understand systems by building them, not by reading documentation

**Use Cases**:
- Technical prototype validation
- Architecture exploration
- Rapid MVP development

---

## My Practice Cases

### Ontology OS

**Background**: Entering the semiconductor industry as an AI PM, needing to understand the underlying logic of Palantir AIP.

**Approach**:
- One person, one model (Claude), two weeks of iteration
- No traditional software engineers involved
- No Sprint Planning, no Stand-ups

**Output**:
- A working ontology operating system
- A complete architectural understanding framework
- A deep-dive technical blog post

**Key Insight**:
> "The hardest part of building an ontology system isn't the code — it's the mental model. Understanding that a graph database is not an ontology, an ontology is not a schema, and a schema is not a data model — these are concentric layers of abstraction, and getting them right is a product problem, not an engineering problem."

---

## Key Skills for Vibe Coding

### 1. Architectural Thinking

**Core Competencies**:
- Defining system boundaries
- Specifying inter-layer contracts
- Reasoning about data flows

**Practices**:
- Draw the architecture diagram before writing code
- Define clear API interfaces
- Clarify data flow directions and dependencies

### 2. Prompt Engineering

**Core Competencies**:
- Translating requirements into instructions AI can understand
- Designing clear constraints and acceptance criteria
- Handling edge cases and errors

**Practices**:
- Describe requirements in a structured way
- Provide concrete examples and counter-examples
- Specify technical constraints and limitations

### 3. Quality Judgment

**Core Competencies**:
- Evaluating the quality of AI output
- Identifying potential issues and risks
- Deciding when human intervention is needed

**Practices**:
- Establish a quality checklist
- Test key features and edge cases
- Validate the soundness of architectural decisions

---

## Vibe Coding Workflow

### Phase 1: Requirements Definition (10 min)

```markdown
## Product Intent
[One paragraph describing the product positioning]

## Architectural Boundaries
- Input: [What data comes in]
- Processing: [How it's processed]
- Output: [What results come out]

## Design Constraints
- Tech Stack: [React + Vite + Tailwind CSS]
- Performance Requirements: [Response time < 100ms]
- Security Requirements: [Login authentication required]
```

### Phase 2: Architecture Design (20 min)

```markdown
## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │ →   │   Backend   │ →   │  Database   │
│   React     │     │   FastAPI   │     │   Neo4j     │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Data Flow
1. User Input → Frontend Component
2. Frontend Component → API Call
3. API Call → Backend Processing
4. Backend Processing → Database Query
5. Database Query → Return Result

## API Contract
- GET /api/data → Returns data list
- POST /api/data → Creates new data
- PUT /api/data/:id → Updates data
- DELETE /api/data/:id → Deletes data
```

### Phase 3: Code Generation (30 min)

```markdown
## Prompt Template

You are a senior frontend engineer skilled at rapidly building prototypes with React + Vite + Tailwind CSS.

Based on the architecture design below, generate a runnable project.

Requirements:
1. Use React 19 + Vite 8 + Tailwind CSS 4
2. All components must be functional components with hooks
3. All styling must use Tailwind CSS
4. Use Lucide React icons
5. Use mock data for data

Architecture Design:
[Paste the architecture design from Phase 2]
```

### Phase 4: Iterative Refinement (As Needed)

```markdown
## Iteration Prompt

Based on the current code, make the following changes:

1. [Change 1]: [Specific description]
2. [Change 2]: [Specific description]

Requirements:
- Keep the existing architecture unchanged
- Only modify the specified parts
- Ensure other features are not affected
```

---

## Vibe Coding Best Practices

### 1. Understand Before Building

**Wrong Approach**:
- Having AI write code directly
- Making changes without understanding the architecture
- Starting over when encountering problems

**Right Approach**:
- Understand the business requirements first
- Design the system architecture first
- Define the interface contracts first

### 2. Define Clear Boundaries

**Wrong Approach**:
- Vague requirement descriptions
- Unclear technical constraints
- No acceptance criteria

**Right Approach**:
- Structured requirement documents
- Explicit technical constraints
- Specific acceptance criteria

### 3. Iterate, Don't Rewrite

**Wrong Approach**:
- Rewriting when encountering problems
- Not preserving previous code
- Starting from scratch every time

**Right Approach**:
- Iterate on the existing foundation
- Preserve useful code
- Optimize and improve incrementally

### 4. Verify, Don't Trust

**Wrong Approach**:
- Fully trusting AI output
- Using without testing
- Not verifying edge cases

**Right Approach**:
- Test key features
- Verify edge cases
- Check error handling

---

## What Vibe Coding Delivers

### Cognitive Level

**Most Valuable Insight**:
> "The hardest part of building an ontology system isn't the code — it's the mental model."

**Practical Takeaways**:
- Not "learning to code" — "learning to think architecturally"
- The output is not code — it's a cognitive framework
- PM + LLM can deliver full-stack prototypes

### Skill Level

**Skills Acquired**:
- System architecture design
- Prompt Engineering
- Quality judgment and validation
- Rapid iteration and optimization

**Applicable Scenarios**:
- Technical prototype validation
- Architecture exploration
- Rapid MVP development

### Efficiency Level

**Efficiency Gains**:
- From requirements to prototype: 2–4 weeks → 1–2 hours
- Iteration cycle: 2–3 days → 10 minutes
- Communication cost: Multiple meetings → One conversation

---

## Vibe Coding Caveats

### Applicable Scenarios

✅ **Suitable For**:
- Prototype validation
- Internal demos
- Rapid iteration
- Technical exploration

❌ **Not Suitable For**:
- Production-grade code
- Complex business logic
- High-performance requirements
- Enterprise-grade security

### Risk Control

**Risks**:
- AI-generated code may contain bugs
- Architectural decisions may be suboptimal
- Performance may fall short

**Mitigation**:
- Test key features
- Validate architectural decisions
- Assess performance metrics

---

## Summary

**Core Philosophy**:
- A PRD is not a document — it's an instruction set for AI
- A prototype is not code — it's an interactive requirements specification
- Iteration is not development — it's conversational refinement

**Efficiency Gains**:
- From requirements to prototype: 2–4 weeks → 1–2 hours
- Iteration cycle: 2–3 days → 10 minutes
- Communication cost: Multiple meetings → One conversation

**Toolchain**:
- Requirements Input: Markdown
- PRD Generation: AI (Claude/GPT)
- Prototype Generation: Claude Code
- Tech Stack: React + Vite + Tailwind CSS

---

*Last Updated: 2026-05-26*
*Based on practice from the Ontology OS and Fab Agent Space projects*
