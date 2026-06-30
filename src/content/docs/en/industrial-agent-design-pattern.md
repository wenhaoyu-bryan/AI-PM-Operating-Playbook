---
title: "Industrial Agent Design Pattern"
description: "Why industrial agents are not chatbots — a structured framework for building AI agents that handle enterprise workflows, evidence, HITL review, safety, and evaluation."
section: "case-studies"
---

# Industrial Agent Design Pattern

## Why This Module Exists

Most AI agent demos stop at chat-based interaction. A user asks a question, the agent responds. This is fine for customer support bots, but it breaks in industrial and enterprise environments.

Industrial agent products require structured workflow, evidence chains, tool boundaries, human review gates, safety classifications, permissions, auditability, and evaluation — none of which a chatbot architecture provides.

This module is a sanitized case pattern adapted from a public Industrial Agent Product Sandbox project. It demonstrates how an AI Product Manager translates industrial knowledge work (quality anomaly investigation, SOP retrieval, equipment event correlation) into a structured agentic product system.

**Core message:** Industrial agents are not just chatbots. They are workflow systems that combine business events, agent planning, tool registries, knowledge retrieval, evidence chains, human-in-the-loop review, safety boundaries, and evaluation.

## Core Product Pattern

```
Business Event
  → Agent Planner
    → Tool Registry
    → Knowledge Retrieval
    → Evidence Chain
    → Root Cause Hypothesis
    → HITL Review
    → Final Report
    → Evaluation & Audit Log
```

Every step in this flow is a product design decision, not an engineering implementation detail. The AI PM defines:

- What triggers the agent (business event)
- What the agent can access (tool registry + knowledge sources)
- What evidence it must cite (evidence chain requirement)
- Who reviews what (HITL boundaries)
- How quality is measured (evaluation)
- What gets logged (audit trail)

## What Makes Industrial Agents Different from Chatbots

| Dimension | Chatbot Agent | Industrial Agent |
|-----------|--------------|------------------|
| **Environment** | Low-stakes Q&A | High-stakes operations |
| **Output** | Fluent answer | Structured evidence + hypothesis |
| **Tool access** | Unbounded or single API | Scoped tool registry with risk levels |
| **Safety** | Content filtering | Risk classification + HITL routing |
| **Evidence** | Optional, often uncited | Required, every claim cites a data source |
| **Human review** | None | Built into the workflow for high-risk actions |
| **Audit trail** | Not required | Every tool call, decision, and review logged |
| **Evaluation** | "Is the answer helpful?" | 7-dimension weighted rubric with pass/fail thresholds |
| **Interaction** | Conversation-driven | Workflow-driven |

Industrial agents operate in environments where a wrong recommendation can stop a production line, cause a safety incident, or produce defective products. The product architecture must reflect this reality — not by making the agent more powerful, but by designing the right boundaries around it.

## Core Product Objects

These objects form the shared language between AI PMs, engineers, and domain experts when designing industrial agent systems:

| Object | What It Is | Why It Matters | Example (Quality Anomaly Case) |
|--------|-----------|----------------|-------------------------------|
| **Agent** | A scoped AI role with specific tools, knowledge, and outputs | Defines boundaries; prevents one "god agent" from doing everything | Quality Anomaly Agent, SOP Assistant, Reviewer Agent |
| **Tool** | A registered capability with input/output schemas, risk level, and permissions | Makes agent capabilities explicit and auditable | `query_equipment_events`, `search_sop`, `generate_report` |
| **Knowledge Source** | Structured data or documents the agent can access | Determines what the agent "knows" and what it can cite | Equipment events CSV, SOP chunks, quality anomaly records |
| **Workflow** | The ordered sequence of agent tasks with dependencies and decision gates | Translates human process into agent-executable steps | Trigger → Data gathering → Hypothesis → Review → Report |
| **Task** | A unit of work assigned to a specific agent with defined inputs and outputs | Enables parallel execution, dependency tracking, and retry logic | "Query equipment events ±4h window for batch B-2024-0053" |
| **Evidence** | A cited data point that supports or refutes a hypothesis | Makes agent reasoning inspectable; required for audit and compliance | EVT-010 calibration drift event at T-15min before anomaly |
| **Review** | Human evaluation of agent output before risky actions are executed | Safety gate; prevents autonomous execution of high-stakes decisions | Shift supervisor approves/rejects/modifies line stop recommendation |
| **Report** | Structured output with executive summary, evidence, hypotheses, and recommendations | Standardizes output format for operations, compliance, and quality teams | 10-section RCA investigation report |
| **Evaluation Case** | A test scenario with expected behavior that gates quality before changes | Prevents regression; catches prompt drift; enforces quality standards | EVAL-002: high-risk escalation with HITL review |
| **Audit Log** | Immutable record of every agent action, tool call, review decision, and timestamp | Required for compliance, incident analysis, and process improvement | Full trace: planner → tool calls → hypotheses → HITL decision → report |

## What This Demonstrates for AI PMs

This case module demonstrates the following AI PM capabilities:

| Capability | What It Shows |
|------------|---------------|
| **Scenario abstraction** | Translating real industrial workflows (quality investigation, SOP retrieval) into structured agent scenarios without copying proprietary processes |
| **Agent architecture design** | Defining agent roles, tool registries, knowledge sources, and collaboration patterns — not just prompt engineering |
| **Enterprise workflow design** | Designing multi-step workflows with parallel execution, dependency graphs, retry logic, and failure modes |
| **HITL design** | Risk classification (Low/Medium/High/Critical), escalation SLAs, reviewer roles, and audit requirements |
| **Safety and permission thinking** | Tool-level access control, prompt injection defense, data classification, and the principle of least privilege |
| **Evaluation design** | Weighted multi-dimension rubrics, structured eval cases, calibration processes, and regression testing cadences |
| **Cross-functional communication** | Translating between domain experts (quality engineers), engineers (agent architecture), and stakeholders (operations managers) |
| **Product judgment** | Knowing what the agent should NOT do — where to draw the autonomy boundary and when to escalate to humans |

## Related Pages

- [Quality Anomaly RCA Agent Case](quality-anomaly-rca-case)
- [HITL Review Pattern for Enterprise Agents](hitl-review-pattern)
- [Agent Evaluation Pattern](agent-evaluation-pattern)
- [Tool, Knowledge, and Workflow Pattern](tool-knowledge-workflow-pattern)
- [Interactive Demo](industrial-agent-demo-reference)

---

> **Note:** This module is adapted from the Industrial Agent Product Sandbox, a public product exploration project. All data, scenarios, and examples are synthetic. No real company data, systems, or customers are referenced.
