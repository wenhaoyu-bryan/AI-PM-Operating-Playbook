---
title: "HITL Review Pattern for Enterprise Agents"
description: "Designing human-in-the-loop review for industrial AI agents — risk classification, escalation SLAs, reviewer roles, and audit trail requirements."
section: "case-studies"
---

# HITL Review Pattern for Enterprise Agents

## Why HITL Matters

In enterprise and industrial environments, agent outputs may affect operations, compliance, safety, or cost. The agent should assist decision-making but should not directly execute high-risk actions without human approval.

HITL (Human-in-the-Loop) is not a safety checkbox. It is a product trust mechanism. Every approved recommendation builds user confidence. Every rejected or modified recommendation improves the system.

**Core principle:** The agent does the data-heavy work. The human makes the operational decision.

## Action Risk Levels

Not all agent outputs need human review. The risk classification determines what routes to HITL:

| Risk Level | Example Agent Output | Auto Allowed? | Review Required? | SLA |
|-----------|---------------------|---------------|------------------|-----|
| **Low** | Query equipment event logs | Yes | No | N/A |
| **Medium** | Generate root cause hypothesis | Yes (logged) | No (but logged) | N/A |
| **High** | Recommend line stop for recalibration | No | **Yes** | 30 minutes |
| **Critical** | Change equipment parameter or shut down line | No | **Yes, dual approval** | 15 minutes |

### Design Rationale

- **Low-risk actions** (data retrieval) should auto-pass. Requiring review for every query creates alert fatigue.
- **Medium-risk actions** (analysis, reporting) auto-pass but are logged. If later review finds issues, the log enables retrospective audit.
- **High-risk actions** (operational recommendations) must route to a qualified reviewer. These have SLA timers — unreviewed items escalate.
- **Critical actions** (system changes, safety decisions) require dual approval: two independent reviewers must both approve.

## Review Flow

```
Agent Recommendation
  → Risk Classification (Low / Medium / High / Critical)
    → Auto-pass (Low, Medium) → Logged & delivered
    → HITL Queue (High, Critical)
      → Human Decision:
        ├── Approved → Execute & log
        ├── Modified → Apply changes, re-validate, execute & log
        ├── Rejected → Log reason, notify agent, re-investigate
        └── SLA Timeout → Escalate to next authority level
  → Audit Log (every decision recorded)
  → Final Report (includes HITL decision trail)
```

## Reviewer Actions

The review interface should give reviewers clear options:

| Action | When to Use | Effect |
|--------|------------|--------|
| **Approve** | Agent output is correct and complete | Recommendation executes as-is |
| **Reject** | Agent output is wrong or unsafe | Returns to agent with rejection reason for re-investigation |
| **Request Revision** | Agent output is directionally correct but needs refinement | Agent revises specific sections without restarting full investigation |
| **Add Comment** | Reviewer wants to add domain context | Comment appended to report without blocking execution |
| **Change Risk Level** | Agent misclassified the risk | Re-routes to correct queue with updated SLA |
| **Escalate** | Reviewer lacks authority or context | Moves to next authority level |

### Reviewer Modification Is a Feature, Not a Failure

In the quality anomaly case, the shift supervisor approved the core recommendation (line stop for calibration) but added a supplementary action: "Check die alignment per SOP-DIE-003 — we've seen die wear contribute to drift on this press."

This is the HITL system working as designed. The agent handled the data correlation. The human added domain knowledge the agent's knowledge base didn't cover. This is the intended collaboration model — not "human overrides agent" but "agent does the heavy lifting, human adds judgment."

## Reviewer Roles

| Role | Scope | Can Approve | Can Override |
|------|-------|-------------|-------------|
| **Shift Supervisor** | High-risk actions on their shift | Yes | Agent recommendations |
| **Operations Manager** | Critical actions, escalated items | Yes | Supervisor decisions |
| **Quality Auditor** | Quality-related actions, compliance | Yes | All quality decisions |
| **Plant Director** | Final escalation authority | Yes | All decisions |

## Escalation Rules

If the assigned reviewer does not act within the SLA:

| Scenario | Primary Reviewer | SLA | Escalation Target |
|----------|-----------------|-----|-------------------|
| Standard high-risk recommendation | Shift Supervisor | 30 min | Operations Manager |
| Critical line stop | Operations Manager | 15 min | Plant Director |
| Low-confidence hypothesis (confidence < 0.7) | Shift Supervisor | 30 min | Operations Manager |
| SOP contradicts equipment data | Operations Manager + Quality Auditor | 30 min | Plant Director |
| Agent timeout / system error | Shift Supervisor | 15 min | IT Operations |

### Escalation Principles

1. **Time-bound:** Every review has an SLA. Unreviewed items never block the system indefinitely.
2. **Progressive:** Escalation moves up the authority chain, not sideways.
3. **Dual approval for critical:** Safety-critical actions require two independent approvals.
4. **Graceful timeout:** If all escalation levels are exhausted, results are delivered with an "unverified" label — not blocked.
5. **Audit trail:** Every escalation is logged with reason, timestamp, and resolution.

## Audit Log Requirements

Every HITL decision must be logged with:

| Field | Description |
|-------|-------------|
| Who reviewed | Reviewer ID and role |
| What was recommended | Agent's original recommendation |
| What evidence was shown | Evidence references visible to the reviewer |
| What decision was made | Approved / Modified / Rejected |
| When it happened | Timestamp (ISO-8601) |
| Why | Reviewer's stated rationale |
| SLA status | Met / Breached / Extended |
| Final report version | Link to the report that includes the decision |

```json
{
  "event_id": "HITL-0053",
  "timestamp": "2024-03-18T15:04:00Z",
  "task_id": "TASK-0053",
  "agent": "quality_anomaly_agent",
  "risk_level": "high",
  "reviewer": "SUP-0088",
  "role": "shift_supervisor",
  "decision": "approved_with_modification",
  "rationale": "Agree with Hypothesis 1 and line stop. Add: check die alignment per SOP-DIE-003.",
  "sla_minutes": 30,
  "response_time_minutes": 12,
  "sla_status": "met",
  "evidence_refs": ["EVT-010", "EVT-001", "CHUNK-003"]
}
```

## PM Design Notes

### HITL is not just a safety layer — it is a product trust mechanism

Users don't trust agents that act autonomously on their first day. HITL creates a gradual trust-building path: the agent recommends, the human approves, the system learns. Over time, consistent correct recommendations may earn auto-approval for lower-risk categories.

### Review design affects adoption

If the review queue is confusing, slow, or noisy, reviewers will bypass it. The interface must show: what the agent wants to do, why (evidence), how confident it is, how urgent it is (SLA), and what happens if the reviewer does nothing (escalation). Every piece of information on the review screen is a product decision.

### The reviewer should see evidence, not just conclusions

A review screen that shows "Agent recommends line stop (confidence 0.92)" is insufficient. The reviewer must be able to inspect the evidence chain — the specific equipment events, measurements, and SOP sections the agent used. This enables informed judgment, not blind approval.

### Track decision quality over time

Reviewer decisions are a data source for product improvement. If a particular agent consistently has its recommendations modified or rejected, that's a signal to improve prompts, knowledge sources, or workflow design. HITL data closes the feedback loop between agent behavior and product quality.

---

**Related:** [Industrial Agent Design Pattern](industrial-agent-design-pattern) · [Quality Anomaly RCA Agent Case](quality-anomaly-rca-case) · [Agent Evaluation Pattern](agent-evaluation-pattern)
