# Harness Engineering Primer

**English** | **[中文](harness-engineering.zh-CN.md)**


> Not writing code — harnessing AI to write code
> Core Skills: Prompt Engineering + Architecture Design + Quality Assurance

---

## What is Harness Engineering?

**Definition**: The engineering practice of harnessing AI tools (such as Claude Code, Cursor) for software development.

**Core Philosophy**:
- Not "writing code" — "harnessing AI to write code"
- Not "learning to code" — "learning to think architecturally"
- Not "managing development" — "managing AI development"

**How It Differs from Traditional Development**:

| Dimension | Traditional Development | Harness Engineering |
|-----------|------------------------|---------------------|
| Core Skill | Programming Languages | Prompt Engineering |
| Working Style | Writing Code | Harnessing AI to Write Code |
| Knowledge Focus | Syntax Details | Architecture Design |
| Quality Assurance | Unit Tests | Acceptance Criteria |
| Iteration Style | Modify Code | Modify Instructions |

---

## Core Skills

### 1. Prompt Engineering

**Definition**: Designing instructions for AI so that it understands your intent and produces high-quality code.

**Key Elements**:
- **Clear Requirement Descriptions**: Describe requirements in a structured way
- **Explicit Technical Constraints**: Specify tech stack, performance requirements, security restrictions
- **Specific Acceptance Criteria**: Define what "done" and "correct" mean
- **Edge Case Handling**: Account for anomalies and error handling

**Prompt Template**:

```markdown
You are a senior [role], skilled at [skill].

Based on the following [input], generate [output].

Requirements:
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

Constraints:
- [Constraint 1]
- [Constraint 2]

Acceptance Criteria:
- [Criterion 1]
- [Criterion 2]

Input:
[Paste input content]
```

**Example**:

```markdown
You are a senior frontend engineer skilled at rapidly building prototypes with React + Vite + Tailwind CSS.

Based on the following PRD, generate a runnable prototype project.

Requirements:
1. Use React 19 + Vite 8 + Tailwind CSS 4
2. All components must be functional components with hooks
3. All styling must use Tailwind CSS — no custom CSS
4. Use Lucide React icons
5. Use mock data — do not call real APIs

Constraints:
- Fixed port 5175
- Deploy to GitHub Pages (base: './')
- Responsive design (desktop support)

Acceptance Criteria:
- All core features are interactive
- No console errors
- Responsive layout works correctly

PRD:
[Paste PRD content]
```

---

### 2. Architecture Design

**Definition**: Designing system architecture, defining component boundaries and data flows.

**Key Elements**:
- **System Layering**: Frontend, backend, database
- **Component Design**: Component responsibilities, interfaces, dependencies
- **Data Flow**: How data moves through the system
- **API Design**: Interface definitions, request/response formats

**Architecture Diagram Template**:

```markdown
## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │ →   │   Backend   │ →   │  Database   │
│   React     │     │   FastAPI   │     │   Neo4j     │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Component Tree

```
App
├── Sidebar (Left Navigation)
│   ├── Logo
│   ├── NavMenu
│   └── UserProfile
├── Dashboard
│   ├── MetricCards
│   ├── RecentTasks
│   └── QuickActions
└── Workbench
    ├── TaskPanel
    ├── AgentChat
    └── ContextPanel
```

## Data Flow

1. User Click → Frontend Component
2. Frontend Component → API Call
3. API Call → Backend Processing
4. Backend Processing → Database Query
5. Database Query → Return Result
6. Return Result → Frontend Rendering

## API Contract

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| /api/tasks | GET | Get task list | - | Task[] |
| /api/tasks | POST | Create task | Task | Task |
| /api/tasks/:id | PUT | Update task | Task | Task |
| /api/tasks/:id | DELETE | Delete task | - | - |
```

---

### 3. Quality Assurance

**Definition**: Ensuring the quality of AI-generated code, identifying and fixing issues.

**Key Elements**:
- **Functional Verification**: Do core features work correctly?
- **Edge Case Testing**: Are anomalies handled properly?
- **Performance Evaluation**: Response times, resource usage
- **Security Review**: Are there security vulnerabilities?

**Quality Checklist**:

```markdown
## Functional Verification
- [ ] Core feature 1 works correctly
- [ ] Core feature 2 works correctly
- [ ] Core feature 3 works correctly

## Edge Case Testing
- [ ] Empty input handling
- [ ] Excessively long input handling
- [ ] Special character handling
- [ ] Concurrent request handling

## Performance Evaluation
- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] Reasonable memory usage

## Security Review
- [ ] Input validation
- [ ] Access control
- [ ] Sensitive data protection
- [ ] SQL injection prevention
```

---

### 4. Iteration Management

**Definition**: Managing the iteration process of AI development, rapid validation and optimization.

**Key Elements**:
- **Rapid Validation**: Quickly validate requirements and assumptions
- **Continuous Improvement**: Optimize based on feedback
- **Version Control**: Preserve useful code versions
- **Knowledge Capture**: Document lessons learned

**Iteration Process**:

```markdown
## Iteration Process

### 1. Requirements Input (10 min)
- Clarify the changes needed
- Define acceptance criteria

### 2. AI Generation (10 min)
- Describe requirements in a prompt
- Generate code

### 3. Validation Testing (10 min)
- Test functionality
- Verify edge cases

### 4. Feedback & Refinement (As Needed)
- Document issues
- Refine the prompt
- Regenerate
```

---

## Toolchain

### Essential Tools

| Tool | Purpose | Recommended |
|------|---------|-------------|
| Claude Code | AI coding assistant | ✅ |
| Cursor | AI coding assistant | ✅ |
| Node.js | Runtime environment | 18+ |
| Git | Version control | ✅ |

### Recommended Tools

| Tool | Purpose | Recommended |
|------|---------|-------------|
| Figma | Design reference | Optional |
| Excalidraw | Wireframing | Optional |
| Vercel | Quick deployment | Optional |

---

## Practice Cases

### Case 1: Fab Agent Space

**Requirement**: An intelligent knowledge engine for semiconductor FAB engineers

**Tech Stack**: React 19 + Vite 8 + Tailwind CSS 4

**Development Process**:
1. Requirements Definition (10 min)
2. Architecture Design (20 min)
3. Code Generation (30 min)
4. Iterative Refinement (As Needed)

**Results**:
- 10 core components
- Complete interaction logic
- Port 5175
- GitHub Pages deployment

---

### Case 2: Ontology OS

**Requirement**: An enterprise ontology operating system

**Tech Stack**:
- Frontend: React 18 + D3.js + Tailwind CSS 4
- Backend: FastAPI + Neo4j + NetworkX
- LLM: MiniMax / OpenAI / Anthropic

**Development Process**:
1. Reverse-engineered Palantir AIP
2. Designed ontology architecture
3. Implemented data pipeline
4. Integrated LLM reasoning

**Results**:
- 53 nodes, 100+ semantic links
- ReAct agent
- HITL approval workflow
- Multi-LLM support

---

## Best Practices

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

## Efficiency Comparison

| Phase | Traditional Development | Harness Engineering | Improvement |
|-------|------------------------|---------------------|-------------|
| Requirements Analysis | 2–3 days | 10 min | 15x |
| Architecture Design | 3–5 days | 20 min | 15x |
| Code Development | 1–2 weeks | 30 min | 20x |
| Iterative Refinement | 2–3 days/round | 10 min/round | 15x |
| **Total** | **2–4 weeks** | **1–2 hours** | **15–20x** |

---

## Summary

**Core Philosophy**:
- Not "writing code" — "harnessing AI to write code"
- Not "learning to code" — "learning to think architecturally"
- Not "managing development" — "managing AI development"

**Core Skills**:
- Prompt Engineering (Designing instructions for AI)
- Architecture Design (System architecture design)
- Quality Assurance (Quality assurance and validation)
- Iteration Management (Iteration management)

**Efficiency Gains**:
- From requirements to prototype: 2–4 weeks → 1–2 hours
- Iteration cycle: 2–3 days → 10 minutes
- Communication cost: Multiple meetings → One conversation

---

*Last Updated: 2026-05-26*
*Based on practice from the Ontology OS and Fab Agent Space projects*
