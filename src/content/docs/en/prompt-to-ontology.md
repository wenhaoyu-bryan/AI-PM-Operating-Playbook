# Ontology OS

> Enterprise Ontology Operating System
> Transform enterprise data from "tables" into "living knowledge graphs"
> Reverse-engineering Palantir AIP through Vibe Coding

**English** | **[中文](README.zh-CN.md)**

---

## Project Overview

**Positioning**: Enterprise Ontology Operating System that transforms enterprise data from "tables" into "living knowledge graphs"

**Core Value**:
- Understand the underlying logic of Palantir AIP
- Validate ontology-driven intelligent agent architecture
- Explore the product paradigm of industrial AI Agents

**Current Status**: MVP v2

---

## Core Insights

### Architecture Insights

**Key Decisions**:
- Neo4j is the data source, NetworkX is the compute engine, LLM is the reasoning layer
- All three are decoupled and can be independently replaced

**Architecture Diagram**:
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │ →   │   Backend   │ →   │   Storage   │
│  React 18   │     │  FastAPI    │     │  Neo4j 5    │
│  D3.js      │     │  NetworkX   │     │  SQLite     │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Product Insights

**Core Cognition**:
> "The hardest part of building an ontology system is not the code, but the mental model. Understanding that a graph database is not an ontology, an ontology is not a schema, and a schema is not a data model — these are concentric circles of abstraction levels, and getting them right is a product problem, not an engineering problem."

**Key Distinctions**:
- Graph Database ≠ Ontology
- Ontology ≠ Schema
- Schema ≠ Data Model

### Technical Insights

**Key Decisions**:
- Fact tables are nodes, not edges
- Actions are attached to objects, state drives behavior
- Agent doesn't auto-execute, requires HITL approval

---

## Tech Stack

| Layer | Technology | Version | Responsibility |
|-------|------------|---------|----------------|
| Frontend Framework | React | 18 | Component Architecture |
| Styling | Tailwind CSS | 4 | Dark Industrial Theme |
| Graph Rendering | D3.js | - | Force-directed Layout |
| CSV Parsing | PapaParse | - | Multi-row Headers |
| Backend Framework | FastAPI | 0.115 | Async REST API |
| Graph Database | Neo4j | 5 | Persistent Graph Storage |
| In-memory Graph Engine | NetworkX | 3.4 | Real-time Graph Computation |
| LLM Integration | MiniMax / OpenAI / Anthropic | - | ReAct Reasoning |
| Data Validation | Pydantic | v2 | Type Safety |
| Lightweight Database | SQLite | - | Seed Data |

---

## Project Structure

```
Ontology MVP Demo/
├── CLAUDE.md                  # Project Memory
├── .gitignore
├── backend/
│   ├── database.py            # Data Layer: SQLite tables + queries + seed data
│   ├── ontology.py            # Semantic Layer: NetworkX graph construction + path analysis
│   ├── agent.py               # Agent Layer: ReAct reasoning + action execution
│   ├── llm_client.py          # LLM Router: 3-backend hot-switching
│   ├── data_pipeline.py       # Data Pipeline: validation + batch import
│   ├── neo4j_connector.py     # Neo4j Connector
│   ├── main.py                # API Layer: FastAPI 14+ endpoints
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx            # Global State + Navigation + View Routing
│       ├── api.js             # Axios API Wrapper
│       ├── index.css          # Dark Industrial Theme Global Styles
│       └── components/
│           ├── DataPipeline.jsx         # Multi-table Data Pipeline
│           ├── GlobalSchemaMapper.jsx   # Global Schema Mapping Editor
│           ├── D3GraphCanvas.jsx        # D3 Graph Canvas
│           ├── OntologySchemaOverview.jsx # Ontology Schema Overview
│           ├── EntityInspector.jsx      # Node 360° Detail Panel
│           ├── OntologyBrowser.jsx      # Ontology Browser
│           ├── AgentWorkshop.jsx        # Agent Reasoning Log
│           └── LinkTooltip.jsx          # Link Hover Tooltip
├── sample-data/               # Demo CSV Datasets
└── docs/
    ├── PRD.md                 # Product Requirements Document
    ├── ARCHITECTURE.md        # Architecture Design Document
    └── phases/                # Development Phase Plans
```

---

## Core Features

### 1. Data Pipeline

**Feature**: Import data from CSV files into knowledge graph

**Flow**:
```
CSV File → PapaParse Parse → LLM Infer Schema → UNWIND Batch Import → Neo4j
```

**Key Features**:
- Multi-row header support
- LLM automatic entity and relationship inference
- Batch import optimization

---

### 2. Knowledge Graph

**Feature**: Visualize entities and relationships

**Technical Implementation**:
- D3.js force-directed layout
- Canvas nodes + SVG connections
- Supports 5000+ nodes

**Interactions**:
- Click node → highlight upstream/downstream
- Drag node → adjust layout
- Zoom and pan

---

### 3. Ontology Schema

**Feature**: Display classes, relationships, properties, cardinality

**Technical Implementation**:
- Automatic extraction from Neo4j
- Class cards + relationship chains + constraint status
- Schema constraint checking

---

### 4. Agent Reasoning

**Feature**: Intelligent reasoning based on knowledge graph

**Technical Implementation**:
- ReAct reasoning engine
- Tool-Calling function calls
- HITL approval workflow

---

## Vibe Coding Practice

### Practice Method

**Method**: A product manager defines product intent, architecture boundaries, and design constraints, while a large language model handles code generation, debugging, and iteration.

**Most Valuable Cognition**:
> "The hardest part of building an ontology system is not the code, but the mental model."

**Practice Gains**:
- Not "learning to code", but "learning to think architecturally"
- The output is not code, but a cognitive framework
- PM + LLM can deliver full-stack prototypes

---

## GitHub

**Repository**: [Prompt-to-Ontology](https://github.com/wenhaoyu-bryan/Prompt-to-Ontology)

---

*Last Updated: 2026-05-18*
*Based on TCL Gechuang Dongzhi Project Practice*
