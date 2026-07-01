---
title: "Tool, Knowledge, and Workflow Pattern"
description: "Designing the operational layer of industrial AI agents — tool registries, knowledge sources, workflow orchestration, and why tool design is product design."
section: "case-studies"
---

# Tool, Knowledge, and Workflow Pattern

## Core Idea

Industrial agents need structured access to tools and knowledge. The product design should define what the agent can read, what it can generate, what it can recommend, and — critically — what it cannot execute.

This is the operational layer of agent design. It sits between "what the user wants" (scenario) and "how the agent behaves" (prompt). It determines the agent's effective capabilities and safety boundaries.

**Core principle:** Tool design is product design. Permission design is product design. What the agent can and cannot do is a PM decision, not an engineering afterthought.

## Tool Registry

A tool registry defines every capability available to agents, including its risk level, input/output schema, and whether it requires human approval.

### Example Tool Registry

| Tool ID | Description | Input | Output | Risk Level | Requires HITL |
|---------|-------------|-------|--------|------------|---------------|
| `query_quality_anomalies` | Query quality deviation records by batch ID and time range | `batch_id`, `time_range` | Anomaly records with measurements and spec limits | Low | No |
| `query_equipment_events` | Query equipment event logs by equipment ID and time window | `equipment_id`, `start_time`, `end_time` | Event records with timestamps and descriptions | Low | No |
| `search_sop` | Semantic search over SOP knowledge base | `query`, `max_results` | Ranked SOP chunks with relevance scores | Low | No |
| `get_equipment_context` | Retrieve equipment metadata and maintenance history | `equipment_id` | Equipment profile, last maintenance date, common failure modes | Low | No |
| `generate_report` | Compile agent findings into structured report | `template`, `findings` | Formatted report with all sections | Medium | No (but logged) |
| `dispatch_alert` | Send alert to operations team | `severity`, `message`, `recipients` | Alert confirmation with delivery status | **High** | **Yes** |

### Tool Design Principles

1. **Least privilege:** Agents access only the tools they need. The SOP Assistant does not get `dispatch_alert`.
2. **Explicit risk:** Every tool has a declared risk level. This drives HITL routing automatically.
3. **Schema-defined:** Input and output schemas make tool behavior testable and documentable.
4. **Auditable:** Every tool call is logged with inputs, outputs, timestamps, and the calling agent.

## Knowledge Sources

Knowledge sources determine what the agent "knows" and what it can cite as evidence. The quality and structure of knowledge sources directly affect agent trustworthiness.

| Source | Format | Access Pattern | Example Content |
|--------|--------|---------------|-----------------|
| **Equipment Events** | CSV / time-series | Query by equipment ID and time range | Calibration drift on Press-03 at 14:30 (+0.25mm offset) |
| **Quality Anomaly Records** | CSV / structured | Query by batch ID and deviation type | Batch B-2024-0053: thickness 2.52mm, spec 2.00–2.30mm |
| **SOP Documents** | Text chunks | Semantic search by context | SOP-PRESS-012 Section 4.3: Major drift correction procedure |
| **Historical Reports** | Structured documents | Query by equipment, line, or deviation type | Prior RCA reports for recurrence detection |
| **Domain Ontology** | JSON graph | Term lookup and relationship traversal | Equipment hierarchy, failure mode taxonomy |

### Knowledge Source Design Principles

- **Structure matters:** Well-chunked SOPs with section numbers produce better citations than raw text dumps.
- **Freshness matters:** Stale knowledge sources produce wrong recommendations. Every source needs a `last_updated` field.
- **Gaps must be declared:** If a knowledge source doesn't cover a scenario, the agent should say so — not guess.
- **Quality affects trust:** If the first three times a user checks an evidence citation and finds it wrong, they will never check again.

## Workflow Design

The product manager defines the workflow — the ordered sequence of agent tasks, dependencies, decision gates, and failure paths.

### Workflow Template

For each agent workflow, define:

| Element | Description | Example |
|---------|-------------|---------|
| **Trigger** | What starts the workflow | Auto-sensor detects quality deviation |
| **Agent Tasks** | What each agent does, in what order | Data gathering (parallel) → Hypothesis generation → Review → Report |
| **Dependencies** | Which tasks wait for which others | Hypothesis generation waits for data gathering + SOP retrieval |
| **Tool Access** | Which tools each task can use | Quality Anomaly Agent: `query_equipment_events`, `search_sop` |
| **Evidence Requirement** | What must be cited in the output | Every hypothesis cites ≥ 1 equipment event + ≥ 1 SOP section |
| **Output Format** | Structure of the final output | 10-section RCA report |
| **Review Boundary** | Which outputs route to HITL | High-risk recommendations; confidence < 0.7 |
| **Evaluation Criteria** | How output quality is measured | 7-dimension weighted rubric |

### Quality Anomaly RCA Workflow

```
Trigger: Quality deviation detected by auto-sensor
  │
  ├── T1: Query quality metrics [parallel, Low risk, no HITL]
  ├── T2: Query equipment events (±4h window) [parallel, Low risk, no HITL]
  ├── T3: Retrieve SOP snippets [parallel, Low risk, no HITL]
  │
  └── T4: Generate root cause hypotheses [depends on T1+T2+T3, Medium risk, no HITL]
        │
        └── T5: Reviewer scores output [Medium risk, no HITL]
              │
              ├── Pass → T6: Generate final report
              └── High risk / Low confidence → HITL Queue → T6 (with reviewer decision)
```

**Design note:** T1, T2, and T3 run in parallel because they have no dependencies on each other. T4 waits for all three because a hypothesis must reference equipment data, quality metrics, and SOP context. This parallelism cuts latency roughly in half compared to a sequential pipeline.

## Agent Communication Protocol

Agents communicate via structured task objects — not free-form chat:

```json
{
  "task_id": "TASK-0053",
  "agent": "quality_anomaly_agent",
  "status": "completed",
  "input": {
    "anomaly_id": "ANO-007",
    "batch_id": "B-2024-0053"
  },
  "output": {
    "hypotheses": [...],
    "risk_level": "high",
    "requires_hitl": true
  },
  "tool_calls": [
    { "tool": "query_equipment_events", "timestamp": "...", "result_count": 4 },
    { "tool": "search_sop", "timestamp": "...", "result_count": 3 }
  ],
  "evidence": [
    { "type": "equipment_event", "ref": "EVT-010", "relevance": "..." },
    { "type": "sop_section", "ref": "CHUNK-003", "relevance": "..." }
  ]
}
```

**Why structured task objects matter:** They enable dependency tracking, retry logic, audit logging, and inter-agent handoffs. They also make the system observable — a product manager can inspect any task and understand exactly what happened.

## Failure Mode Design

The agent workflow must handle failures gracefully. Every failure mode needs a defined recovery path:

| Failure Mode | Detection | Recovery | User Impact |
|-------------|-----------|----------|-------------|
| Equipment data missing | `query_equipment_events` returns empty | Expand time window: ±4h → ±8h → ±24h. If still empty, flag as "limited context" | Report delivered with data gap disclaimer |
| No SOP match found | `search_sop` returns zero results above threshold | Broaden search terms. Return closest match with disclaimer | Report delivered with "no exact SOP match" note |
| Conflicting hypotheses | Two hypotheses have confidence delta < 0.15 | Present both, elevate risk level, force HITL routing | Side-by-side comparison with evidence for each |
| Agent confidence below threshold | Confidence < 0.7 on primary hypothesis | Retry with expanded data. If still low, route to HITL | Best available hypothesis with uncertainty warning |
| Agent timeout or crash | No output within expected window | Retry up to 2 times. Then escalate to HITL | Partial results notification |

### Failure Design Principles

1. **Fail loud, not silent:** Every failure is surfaced to the user with a clear explanation.
2. **Graceful degradation:** Partial results are better than no results.
3. **Human escalation:** Uncertainty and conflicts always route to HITL.
4. **Audit trail:** Every failure and recovery action is logged.
5. **No fabrication:** When data is missing, the agent says so — it never invents data to fill gaps.

## PM Design Notes

### Tool design is product design

The tool registry is not an engineering implementation detail. It is a product artifact that defines what the agent can do, what it cannot do, and under what conditions it needs human approval. A PM who cannot read the tool registry cannot reason about the agent's safety boundaries.

### Permission design is product design

Which agent can access which tool, under what conditions, with what risk level — these are product decisions. They reflect product judgment about what is safe, what is valuable, and where the autonomy boundary should be drawn.

### Knowledge source quality affects agent trust

If the SOP knowledge base is outdated or incomplete, the agent will make wrong recommendations — not because the AI is bad, but because the product input is bad. Knowledge source curation is a PM responsibility, not just a data engineering task.

### The agent should expose intermediate reasoning artifacts

Users should see: the investigation plan, the tool calls, the evidence collected, the hypotheses considered, the review state, and the final report. These are product UI artifacts, not hidden chain-of-thought. They build trust by making the agent's reasoning inspectable.

---

**Related:** [Industrial Agent Design Pattern](/AI-PM-Operating-Playbook/en/industrial-agent-design-pattern/) · [Quality Anomaly RCA Agent Case](/AI-PM-Operating-Playbook/en/quality-anomaly-rca-case/) · [HITL Review Pattern](/AI-PM-Operating-Playbook/en/hitl-review-pattern/)
