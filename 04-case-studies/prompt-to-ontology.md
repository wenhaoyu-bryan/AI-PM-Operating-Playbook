**[English](prompt-to-ontology.md)** | [中文](prompt-to-ontology.md)

# Prompt-to-Ontology

> A public product experiment for turning messy business concepts into structured ontology assets.

---

## 1. Context

An AI Product Manager exploring ontology-driven product design through hands-on prototyping. The approach draws on publicly documented ideas about how structured knowledge representation can drive smarter enterprise products — particularly the concept of linking business entities into an explicit object model rather than leaving relationships implicit in flat tables.

The core question: can an AI PM, working with an LLM coding agent, convert ambiguous business language into a usable ontology without an engineering team?

---

## 2. Product Problem

Business data lives in flat tables, spreadsheets, and documents. Relationships between entities — such as which supplier feeds which production line, or which defect pattern links to a specific material batch — are implicit. They exist in people's heads, tribal knowledge, or buried in unstructured documents.

Decision-makers lack structured context. When someone asks "what is affected if this supplier goes down?", the answer requires manual cross-referencing across multiple systems. There is no single structured representation of how business objects relate to each other.

---

## 3. Why Ontology

Ontologies make entity relationships explicit. Instead of relying on joins across flat tables or asking an expert, an ontology declares:

- **What objects exist** (entities like Supplier, ProductionLine, Material)
- **How they relate** (relationships like SUPPLIES, USES, PRODUCES)
- **What properties they carry** (attributes, constraints, cardinality)

This structured representation enables three things:

1. **Reasoning over structured knowledge** — graph traversal can answer multi-hop questions that flat queries cannot.
2. **Bridging human understanding and machine reasoning** — the ontology is readable by both domain experts and AI agents.
3. **Making implicit knowledge explicit** — tribal knowledge becomes a queryable, auditable asset.

---

## 4. Product Hypothesis

> If we can convert flat business language into structured ontology assets, we can enable more intelligent search, reasoning, and decision support.

Specifically:

- LLMs can extract entities and relationships from unstructured business descriptions.
- A human expert can validate and refine the extracted structure.
- The resulting ontology can serve as the reasoning backbone for downstream AI features — intelligent search, impact analysis, and agent-guided workflows.

---

## 5. User Workflow

The end-to-end flow is designed as a human-AI collaboration loop:

1. **Input** — The user provides messy business concepts: a process description, a domain glossary, a set of flat data tables, or expert notes.
2. **LLM Extraction** — An LLM analyzes the input and proposes entities, relationships, and a draft ontology schema. It identifies objects (nodes), their connections (edges), and key properties.
3. **Human Review** — A domain expert reviews the proposed structure. They confirm, reject, or modify entities and relationships. Confidence thresholds flag uncertain extractions for manual attention.
4. **Ontology Generation** — Validated entities and relationships are compiled into structured ontology assets — a schema definition and an instance-level knowledge graph.
5. **Knowledge Graph Construction** — The ontology is materialized into a graph database, enabling traversal, querying, and visualization.

This loop is iterative. Each pass refines the ontology as more domain input is added.

---

## 6. Data and Knowledge Inputs

The prototype was tested against generic categories of business knowledge:

- **Business documents** — process descriptions, SOPs, operational reports
- **Domain glossaries** — terminology lists, taxonomies, classification schemes
- **Expert knowledge** — verbal descriptions of how things relate, captured as structured notes
- **Tabular data** — CSV exports with entity records (suppliers, materials, orders, defects)

No specific employer data is referenced. The methodology is designed to work with any domain where entities and relationships can be described in natural language.

---

## 7. Object and Relationship Model

The prototype uses a three-layer approach:

### Raw Data Layer
Flat files — CSV tables, documents, glossaries. No relationships declared. This is where most business data lives today.

### Knowledge Graph Layer
Entities become nodes; relationships become edges. Each node carries typed properties. This layer is the materialized instance of the ontology — the actual graph you can query and traverse.

### Ontology Schema Layer
The meta-level: what classes of objects exist, what relationship types are valid, what constraints apply (cardinality, required properties). This is the "schema of the schema" — it governs what the knowledge graph is allowed to contain.

**Key product insight:** These three layers are not the same thing. A graph database is not an ontology. An ontology is not a schema. A schema is not a data model. They are concentric circles of abstraction, and confusing them is a product design error, not just a technical one.

---

## 8. AI-Assisted Workflow

LLMs assist at three points in the pipeline:

1. **Entity Extraction** — Given a business document or glossary, the LLM identifies candidate entities (objects, concepts, roles) and classifies them by type.

2. **Relationship Inference** — The LLM proposes relationships between extracted entities, including relationship type, direction, and cardinality hints. For example: "Supplier SUPPLIES Material" (1:N), "ProductionLine USES Material" (M:N).

3. **Schema Suggestion** — The LLM proposes a draft ontology schema — class definitions, property types, and constraint rules — based on the extracted structure.

These capabilities are tool-agnostic. The prototype used commercial LLM APIs, but the methodology applies to any sufficiently capable language model. The LLM does not "understand" the domain — it proposes structure that a human must validate.

---

## 9. Human Review and Governance

AI extraction is the starting point, not the output. Human review is required at every stage:

- **Entity validation** — Domain experts confirm whether extracted entities are real, correctly named, and properly typed. LLM hallucinations (entities that don't exist) are filtered here.
- **Relationship validation** — Experts verify that proposed relationships are accurate. A wrong relationship in the graph is worse than a missing one — it leads to incorrect reasoning.
- **Confidence thresholds** — Extractions below a confidence threshold are flagged for manual review rather than auto-accepted. This prevents low-confidence noise from polluting the ontology.
- **Domain accuracy** — Technical domains (manufacturing, supply chain, finance) require subject-matter expert judgment that no LLM can fully replace.

The governance model is: LLM proposes, human disposes.

---

## 10. Evaluation Approach

How to measure whether the ontology extraction is working:

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Ontology Coverage** | % of domain-relevant entities captured | Covers the core domain; does not need to be exhaustive |
| **Relationship Accuracy** | % of proposed relationships confirmed by experts | High precision — wrong relationships are costly |
| **Expert Agreement Rate** | Inter-rater reliability on entity/relationship validation | Agreement among independent reviewers |
| **Downstream Utility** | Can the ontology answer real business questions? | Tested via graph traversal queries against use cases |

The evaluation is qualitative as much as quantitative. A smaller, accurate ontology is more useful than a large, noisy one.

---

## 11. Prototype Scope and Non-Goals

### In Scope
- Single-domain ontology extraction (one business area at a time)
- Prototype-level quality (demonstrates the methodology, not production-ready)
- Manual data input (CSV files, text documents)
- Batch processing (not real-time)
- Knowledge graph visualization for inspection

### Non-Goals
- Production deployment or operational SLAs
- Multi-domain ontology scaling
- Real-time streaming data ingestion
- Automated ontology evolution without human review
- Full autonomous agent reasoning over the ontology

The prototype exists to validate the product hypothesis, not to ship a product.

---

## 12. Key Product Lessons

- **The hardest part is the mental model, not the code.** Understanding the difference between a graph database, an ontology, a schema, and a data model — and why each layer matters — is a product design challenge, not an engineering one.

- **An ontology is not a schema; a schema is not a data model.** These are distinct abstraction layers. Confusing them leads to systems that store data but cannot reason over it.

- **LLM extraction requires human validation for domain accuracy.** LLMs are good at proposing structure, but they hallucinate entities, mislabel relationships, and miss domain-specific nuances. Expert review is not optional.

- **Starting with a small, well-defined domain works better than trying to model everything.** A single business area with clear boundaries produces a better ontology than an ambitious attempt to capture the entire organization.

- **The value is in making implicit relationships explicit.** The biggest product insight is not the technology — it is that most business knowledge lives in people's heads. Ontology extraction surfaces that knowledge in a structured, queryable form.

- **Fact tables are nodes, not edges.** A common modeling mistake is treating transactional records (orders, inspections, shipments) as relationships. They are entities with their own properties, states, and actions.

- **Actions belong to objects.** Ontology nodes are not passive data points. They carry verbs — a Supplier can be audited, a Material can be quarantined, a ProductionLine can be paused. Attaching actions to the ontology turns it from a static map into an operational tool.

---

## 13. Implementation Notes

The prototype was built with a minimal, commodity stack:

- **Language:** Python (backend), React (frontend visualization)
- **Graph storage:** Neo4j for persistent graph storage; NetworkX for in-memory graph computation and path analysis
- **LLM integration:** Commercial LLM APIs for entity extraction, relationship inference, and schema suggestion
- **Visualization:** D3.js force-directed graph layout for inspecting the knowledge graph

The architecture deliberately separates storage, computation, and reasoning into independent layers so each can be swapped without affecting the others. This is a prototype architecture — it prioritizes learning speed over operational robustness.

---

## 14. Links

- **Source repository:** [Prompt-to-Ontology on GitHub](https://github.com/wenhaoyu-bryan/Prompt-to-Ontology)
- **AI PM Canvas:** [Open AI PM Canvas](/AI-PM-Operating-Playbook/en/canvas/) — the 12-dimension framework used to structure this case study
- **Methodology pages:** [Return to all pages](/AI-PM-Operating-Playbook/en/)

---

## Canvas Snapshot

| Dimension | Summary |
|-----------|---------|
| **Business Scenario** | Business knowledge scattered across flat tables, documents, and tribal knowledge — no structured representation of entity relationships. |
| **User / Operator** | AI PM as primary operator; domain experts as reviewers and validators of extracted ontology. |
| **Decision to Support** | How do business objects relate to each other, and what is affected when one changes? |
| **Data / Knowledge Sources** | Business documents, domain glossaries, expert knowledge, flat CSV data tables. |
| **Object Model** | Three-layer model: raw data layer, knowledge graph layer (nodes + edges), ontology schema layer (classes + constraints). |
| **AI / Agent Capability** | LLM-assisted entity extraction, relationship inference, and draft schema generation. |
| **Workflow Boundary** | Ends at validated ontology + knowledge graph. Does not include production deployment or autonomous agent actions. |
| **Human Review Point** | Every extraction output — entities, relationships, and schema suggestions — requires domain expert validation before acceptance. |
| **Evaluation Metric** | Ontology coverage, relationship accuracy, expert agreement rate, downstream query utility. |
| **Prototype Scope** | Single-domain, batch-input, prototype-quality ontology extraction with manual review loop. |
| **Production Risk** | LLM hallucination in entity/relationship extraction; domain accuracy requires ongoing expert involvement; scaling to multiple domains is untested. |
| **Product Narrative** | A PM-led experiment demonstrating that LLMs can bootstrap structured ontology from messy business language, with human review as the essential governance layer. |

---

View source repository · [Open AI PM Canvas](/AI-PM-Operating-Playbook/en/canvas/) · [Return to all pages](/AI-PM-Operating-Playbook/en/)
