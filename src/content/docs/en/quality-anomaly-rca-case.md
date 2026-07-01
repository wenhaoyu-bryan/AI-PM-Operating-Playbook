---
title: "Quality Anomaly RCA Agent Case"
description: "A product case study: designing an AI agent that investigates manufacturing quality anomalies using structured workflows, evidence chains, and human-in-the-loop review."
section: "case-studies"
---

# Quality Anomaly RCA Agent Case

## Case Summary

A fully synthetic quality anomaly is detected on a manufacturing line. The agent investigates the anomaly using simulated quality data, equipment events, SOP snippets, and tool context. It generates ranked root cause hypotheses, cites evidence for each, routes risky recommendations to human review, and produces a structured RCA (Root Cause Analysis) report.

**All data is synthetic.** Equipment IDs, batch numbers, SOP content, and event logs are fictional. This case demonstrates product design patterns — not a real production deployment.

## User Problem

These are the user perspectives the product design must address:

| Role | Pain Point |
|------|-----------|
| **Quality Engineer** | Spends 2–4 hours per investigation manually correlating data across quality systems, equipment logs, and SOP documents |
| **Production Supervisor** | Must approve high-risk actions (line stops) based on incomplete information, often without full evidence |
| **Equipment Engineer** | Maintenance decisions depend on tribal knowledge; recurring issues across equipment are hard to detect |
| **AI Product Manager / Platform Owner** | Needs to demonstrate agent ROI while enforcing safety boundaries and building user trust |

## Before Agent: The Manual Workflow

```
Quality deviation detected
  → Engineer pulls data from quality system (15 min)
  → Engineer queries equipment logs manually (30 min)
  → Engineer searches SOP documents by keyword (20 min)
  → Engineer forms root cause hypothesis from experience (varies)
  → Engineer writes free-form report (30 min)
  → If line stop needed: ad hoc supervisor approval (varies)
  → No structured audit trail
  → Investigation quality depends entirely on individual experience
```

**Key problems:**
- Data correlation across 3+ systems is manual and slow
- Hypothesis quality depends on engineer tenure
- SOP search is keyword-based, often returns irrelevant results
- High-risk actions sometimes bypass formal review
- No structured audit trail for compliance reviews

## Agent-Assisted Workflow

The agent does not replace the engineer. It automates the data-heavy correlation work and routes judgment calls to humans:

| Step | Actor | Description |
|------|-------|-------------|
| 1 | **Sensor System** | Quality anomaly detected (auto-sensor triggers agent) |
| 2 | **Planner Agent** | Creates investigation plan with sub-tasks and dependencies |
| 3 | **Quality Anomaly Agent** | Queries quality metrics for the affected batch |
| 4 | **Quality Anomaly Agent** | Queries equipment events within a ±4h window |
| 5 | **SOP Assistant** | Retrieves relevant SOP snippets by semantic search |
| 6 | **Quality Anomaly Agent** | Generates ranked root cause hypotheses with evidence citations |
| 7 | **Quality Anomaly Agent** | Ranks hypotheses by confidence score |
| 8 | **Reviewer Agent** | Scores output against 7-dimension rubric |
| 9 | **HITL System** | Routes high-risk recommendations to human review queue |
| 10 | **Report Generator** | Compiles final structured RCA report |
| 11 | **Evaluation System** | Scores output and adds case to regression suite |

## Example Synthetic Case

The following is a fully fictional example used to illustrate the agent's workflow:

| Field | Value |
|-------|-------|
| Anomaly ID | ANO-007 |
| Batch ID | B-2024-0053 |
| Product | PC-AL-200 (precision aluminum housing) |
| Line | LN-03 |
| Metric | `thickness` |
| Measured Value | 2.52mm |
| Spec Range | 2.00–2.30mm |
| Deviation | +0.22mm above upper spec limit |
| Severity | **High** |
| Detected At | 2024-03-18 14:45 UTC |
| Detection Method | Auto sensor |

### Evidence Retrieved by Agent

**Equipment Events (within ±4h window):**

| Event ID | Equipment | Event Type | Severity | Timestamp | Description |
|----------|-----------|-----------|----------|-----------|-------------|
| EVT-010 | Press-03 | Calibration drift | High | 14:30 | Offset worsened to +0.25mm on Z-axis |
| EVT-001 | Press-03 | Calibration drift | Medium | 08:22 | Offset detected at +0.12mm (progressive pattern) |
| EVT-004 | Press-03 | Pressure drop | Medium | 14:17 | Hydraulic pressure at 85% of nominal |
| EVT-009 | Robot-04 | Positioning error | Medium | 10:05 | Error exceeded tolerance: 0.08mm |

**SOP Matches:**

| Chunk | SOP | Section | Relevance | Key Content |
|-------|-----|---------|-----------|-------------|
| CHUNK-003 | SOP-PRESS-012 | 4.3 (Major Drift) | 0.95 | Offset > 0.15mm → line stop, full recalibration, supervisor sign-off |
| CHUNK-002 | SOP-PRESS-012 | 4.2 (Minor Drift) | 0.82 | Offset ≤ 0.15mm → schedule recalibration within 4h |
| CHUNK-001 | SOP-PRESS-012 | 4.1 (Assessment) | 0.71 | Record offset, check tolerance table, determine severity |

### Key Correlations

1. **EVT-010 → ANO-007**: Calibration drift (+0.25mm) detected 15 minutes before the anomaly. The measured deviation (+0.22mm) is consistent with the offset minus normal process variation.
2. **EVT-001 → EVT-010**: The same equipment showed drift earlier that morning (+0.12mm). The offset worsened over 6 hours — a progressive degradation pattern.
3. **Historical link**: ANO-001 (same line, same deviation type, 3 days prior) had a +0.12mm offset. This is a **recurring issue** — not an isolated incident.

### Ranked Hypotheses

The agent generates 3 hypotheses with confidence scores:

| Rank | Hypothesis | Confidence | Risk Level | HITL Required |
|------|-----------|-----------|------------|---------------|
| 1 | Progressive calibration drift on Press-03 Z-axis caused thickness deviation | 0.92 | High | **Yes** |
| 2 | Hydraulic pressure drop compounded the calibration drift effect | 0.45 | Medium | No |
| 3 | Robot-04 positioning error — weak correlation, different equipment unit | 0.15 | Low | No |

**Hypothesis 1** correctly identifies the root cause: the offset (+0.25mm) exceeds SOP-PRESS-012 Section 4.3's threshold (0.15mm), requiring a line stop and full recalibration. The agent correctly deprioritizes Hypothesis 3 (Robot-04 is a different equipment unit with no causal link).

## Agent Output Structure

The final RCA report follows a standardized 10-section structure:

1. **Executive Summary** — What happened, root cause, recommendation, reviewer decision
2. **Anomaly Details** — Measurement data, spec limits, detection method, severity
3. **Investigation Timeline** — Chronological log of triggers, tool calls, hypotheses, reviews
4. **Equipment Correlation** — Temporal analysis of related equipment events
5. **SOP References** — Relevant procedure sections with relevance scores
6. **Root Cause Hypotheses** — Ranked by confidence with evidence arrays
7. **Recommended Actions** — Specific steps with SOP citations, risk levels, approval status
8. **Evidence Appendix** — Full data for all cited events, measurements, and SOP chunks
9. **HITL Decision** — Reviewer identity, decision (approve/modify/reject), rationale, response time
10. **Audit Log** — Complete tool call trace with timestamps

## Product Design Decisions

This section captures the explicit PM judgments embedded in the design:

### Why the agent should not directly stop a production line

Line stops have operational and financial consequences. The agent can *recommend* a stop and cite the SOP that requires it, but the decision must come from a human who understands the broader production context (downstream orders, staffing, safety). The agent's role is to present evidence; the human's role is to make the operational decision.

### Why evidence citations are required

Without citations, the agent's output is indistinguishable from hallucination. Every hypothesis must reference specific data points (equipment events, measurements, SOP sections). This makes the output auditable — an engineer can verify each claim by checking the cited source.

### Why confidence levels are shown

A single answer with "92% confidence" is more honest than an unqualified assertion. Confidence scores signal to the reviewer how much weight to give the agent's output. They also create a natural escalation path: low-confidence outputs route to human review regardless of risk level.

### Why HITL is required for risky recommendations

This is not a safety checkbox — it is a product trust mechanism. If the first time a user sees the agent recommend a line stop, and it happens with zero human review, the user will never trust the system again. HITL builds trust incrementally: each approved recommendation becomes evidence that the agent is reliable.

### Why evaluation is part of the workflow, not an afterthought

Agent quality is measured, not assumed. Each investigation output is scored against a 7-dimension rubric. Cases that expose weaknesses become regression test cases. Without this, prompt changes that fix one scenario can silently break another.

### Why the MVP uses mock data before real integration

The product pattern must be validated before any integration work begins. Mock data allows the team to test the workflow, HITL routing, and report structure without waiting for API access to real production systems. This de-risks the product investment: if the workflow doesn't make sense with clean synthetic data, it won't work with messy real data.

## Before vs. After

| Metric | Manual Process | With Agent | Improvement |
|--------|---------------|------------|-------------|
| Time to hypothesis | 2–4 hours | < 5 minutes | **~96% faster** |
| Evidence sources consulted | 2–3 (varies by engineer) | 5+ (systematic) | **More comprehensive** |
| Temporal correlation | Manual, often missed | Automated ±4h scan | **No missed patterns** |
| SOP coverage | Keyword search, gaps | Semantic search, ranked | **Relevant sections surfaced** |
| Hypothesis format | Free-form, experience-dependent | Multi-hypothesis with confidence | **Structured, comparable** |
| HITL enforcement | Ad hoc | Automatic risk-based routing | **100% compliance** |
| Audit trail | Manual notes | Automatic tool call log | **Full traceability** |
| Report consistency | Free-form, varies by author | 10-section structured template | **Standardized** |

## What This Case Demonstrates

This case is designed to be interview-ready. It demonstrates:

- **Scenario thinking:** Translating a messy real-world investigation into a clean agent workflow
- **Architecture literacy:** Multi-agent design with tool registries and knowledge sources
- **Safety judgment:** Knowing where to draw the autonomy boundary
- **Evaluation rigor:** Measuring agent quality with structured rubrics, not vibes
- **Product pragmatism:** Choosing mock data for MVP, building regression suites before scaling

---

**Related:** [Industrial Agent Design Pattern](/AI-PM-Operating-Playbook/en/industrial-agent-design-pattern/) · [HITL Review Pattern](/AI-PM-Operating-Playbook/en/hitl-review-pattern/) · [Agent Evaluation Pattern](/AI-PM-Operating-Playbook/en/agent-evaluation-pattern/)
