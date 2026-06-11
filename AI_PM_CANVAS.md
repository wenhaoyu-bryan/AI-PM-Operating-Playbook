# AI PM Canvas

A 12-dimension planning framework for AI product initiatives.

Use this canvas before writing a PRD, before starting a prototype, or when evaluating whether an AI idea is worth pursuing. It forces structured thinking across the dimensions that separate successful AI products from expensive experiments.

---

## The 12 Dimensions

### 1. Business Scenario

**What it means:** The real-world context where this product creates value. Not the technology — the situation.

**Why it matters:** AI products that start with "we have a model" instead of "we have a problem" rarely succeed. The business scenario grounds every subsequent decision.

**Questions to ask:**
- What business process is slow, expensive, or error-prone today?
- Who feels this pain most acutely?
- What is the cost of doing nothing?
- Is this a one-time problem or a recurring workflow?

---

### 2. User / Operator

**What it means:** The person who will interact with the AI system — not the buyer, not the sponsor, but the human at the keyboard.

**Why it matters:** AI products fail when the operator's actual workflow is ignored. The user determines what the interface must communicate, what decisions require human judgment, and what can be automated.

**Questions to ask:**
- Who uses this system daily?
- What decisions do they make manually today?
- What is their technical skill level?
- How much time do they currently spend on this workflow?

---

### 3. Decision to Support

**What it means:** The specific decision or action the AI system helps the user make or perform. Not "provide insights" — the actual decision.

**Why it matters:** Vague value propositions ("AI-powered analytics") lead to products that do everything and nothing well. A clear decision target focuses the entire product.

**Questions to ask:**
- What decision does the user need to make?
- What information would make that decision faster or better?
- Is the decision binary, ranked, or exploratory?
- What happens if the decision is wrong?

---

### 4. Data / Knowledge Sources

**What it means:** The actual data, documents, databases, or domain knowledge the system needs to function. Raw inputs, not processed outputs.

**Why it matters:** AI products are bounded by their data. Knowing what exists, what is missing, and what is messy upfront prevents expensive surprises later.

**Questions to ask:**
- What data sources exist today?
- What format is the data in?
- How clean and structured is it?
- Who owns the data? Are there access restrictions?
- What knowledge lives only in people's heads?

---

### 5. Object Model

**What it means:** The core entities, relationships, and attributes that represent the business domain in the system. The ontology.

**Why it matters:** Getting the object model wrong is the most expensive mistake in AI product development. If your entities do not match how the business actually thinks, every downstream feature will feel wrong.

**Questions to ask:**
- What are the core objects in this domain?
- How do they relate to each other?
- What attributes matter for the decisions we are supporting?
- Is this model how the business thinks, or how the database stores things?

---

### 6. AI / Agent Capability

**What it means:** What the AI actually does — extraction, classification, reasoning, generation, retrieval, planning. Not "AI" generically, but the specific capability.

**Why it matters:** Matching the right AI capability to the right problem step prevents both over-engineering (using agents where rules suffice) and under-engineering (using keyword search where semantic understanding is needed).

**Questions to ask:**
- What specific AI capability does each step require?
- Does this need LLM reasoning, or would a rule-based approach work?
- Where does the AI add value vs. where does it add risk?
- What is the fallback when the AI is uncertain?

---

### 7. Workflow Boundary

**What it means:** Where the AI workflow starts, where it ends, and what is explicitly out of scope.

**Why it matters:** Scope creep is the primary killer of AI prototypes. A clear workflow boundary keeps the prototype focused and deliverable.

**Questions to ask:**
- What triggers the workflow?
- What is the final output or action?
- What steps are in scope for the prototype?
- What is deliberately excluded?

---

### 8. Human Review Point

**What it means:** Where in the workflow a human checks, approves, corrects, or overrides the AI's output.

**Why it matters:** Human-in-the-loop is not a feature — it is a safety and trust design pattern. Placing review points in the wrong place (too many, too few, at the wrong step) determines whether the system is usable.

**Questions to ask:**
- At which steps is AI output not trustworthy enough for autonomous action?
- What does the human reviewer need to see to make a fast decision?
- What is the cost of a wrong AI decision at each step?
- Can the human override, correct, or send back for retry?

---

### 9. Evaluation Metric

**What it means:** How you measure whether the AI system is working — not vanity metrics, but metrics tied to the decision it supports.

**Why it matters:** Without evaluation metrics, you cannot tell whether iteration is improving the product or just changing it. AI products need both quality metrics (is the output correct?) and workflow metrics (does the user accomplish their task?).

**Questions to ask:**
- How do we measure output quality? (precision, recall, human rating)
- How do we measure workflow efficiency? (time to decision, steps reduced)
- What is the baseline before AI?
- What threshold makes the AI worth using?

---

### 10. Prototype Scope

**What it means:** The minimum viable prototype that validates the core AI product concept — not the full system, but enough to test the key assumptions.

**Why it matters:** AI prototypes can be scoped too large (trying to build the full system) or too small (testing only the model, not the workflow). The right scope tests the end-to-end value proposition with realistic constraints.

**Questions to ask:**
- What is the single most important assumption to validate?
- What data subset can we use for the prototype?
- What can be mocked vs. what must be real?
- What does a convincing demo look like?

---

### 11. Production Risk

**What it means:** What breaks when this prototype goes to production — data quality, latency, cost, security, compliance, user trust, model reliability.

**Why it matters:** Prototypes that ignore production risks create false confidence. Identifying risks early does not mean solving them — it means knowing where the hard problems are.

**Questions to ask:**
- What happens when the AI is wrong in production?
- What are the data privacy and compliance requirements?
- What is the cost per query at scale?
- How does the system degrade when the model is unavailable?
- What monitoring is needed?

---

### 12. Product Narrative

**What it means:** How you explain this product to stakeholders — not the technical architecture, but the business story.

**Why it matters:** AI products need a clear narrative because stakeholders cannot evaluate the technology directly. The narrative determines whether the product gets funded, adopted, and supported.

**Questions to ask:**
- What is the one-sentence value proposition?
- What is the before/after story?
- What demo moment makes the value click?
- What objection will stakeholders raise, and how do you address it?

---

## Canvas Summary Table

| # | Dimension | Key question |
|---|-----------|-------------|
| 1 | Business Scenario | What real-world problem are we solving? |
| 2 | User / Operator | Who is at the keyboard? |
| 3 | Decision to Support | What specific decision does the AI help with? |
| 4 | Data / Knowledge Sources | What data exists and what is missing? |
| 5 | Object Model | What are the core entities and relationships? |
| 6 | AI / Agent Capability | What does the AI actually do at each step? |
| 7 | Workflow Boundary | Where does the workflow start and end? |
| 8 | Human Review Point | Where does a human check the AI's work? |
| 9 | Evaluation Metric | How do we measure if it works? |
| 10 | Prototype Scope | What is the minimum viable prototype? |
| 11 | Production Risk | What breaks in production? |
| 12 | Product Narrative | How do we explain this to stakeholders? |

---

## How this maps to my projects

| Project | Business Scenario | AI Capability | PM Value |
|---|---|---|---|
| Prompt-to-Ontology | Turning business language into structured ontology concepts | LLM-assisted schema, entity, and relation extraction | Ontology-driven product thinking |
| Industrial Agent Prototype | Simulating how an agent supports industrial diagnosis and decision workflows | Agent workflow + structured knowledge + human review | Industrial AI product design |
| Email Workflow Automation Toolkit | Automating repetitive email classification and routing | Classification + rules + workflow automation | Practical business automation |
| RAG Data Preparation Toolkit | Preparing messy documents for downstream retrieval and AI workflows | Cleaning, chunking, metadata extraction, ingestion | Understanding AI system foundations |

---

## How to use this canvas

1. **Before a new AI product idea:** Fill in all 12 dimensions. If you cannot answer a dimension, that is the first thing to investigate.

2. **Before starting a prototype:** Focus on dimensions 3, 6, 7, 8, 10. These define what the prototype must demonstrate.

3. **When evaluating an existing product:** Use dimensions 9, 11, 12 to assess maturity and identify gaps.

4. **When briefing a team:** Share the filled canvas so everyone understands the product concept, constraints, and success criteria.

---

**[Back to README](README.md)**
