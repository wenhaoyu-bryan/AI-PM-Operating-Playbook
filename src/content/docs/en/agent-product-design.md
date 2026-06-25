**[English](agent-product-design.md)** | [中文](agent-product-design.md)

# Agent Product Design

> Designing goal-directed AI workflows with tools, knowledge, boundaries, human review, and measurable outcomes.

---

## Agent Is Not a Chatbot

A chatbot and an agent differ in structure, not just in capability.

A chatbot is a stateless, turn-by-turn interaction. The user asks a question; the model generates an answer. Each exchange is independent. There is no persistent goal, no workflow, and no tool use beyond retrieval. The value is in the response itself.

An agent product is fundamentally different. It combines several elements into a coherent system:

- **Goal** -- a defined outcome the agent pursues across multiple steps
- **Contextual knowledge** -- information about the domain, user, and current situation
- **A sequence of decisions** -- not a single call, but a structured progression
- **Tool use** -- the ability to read, write, search, calculate, or invoke external systems
- **State** -- information retained across steps, not reset between turns
- **Boundaries** -- explicit limits on what the agent may and may not do
- **Feedback** -- signals from the environment or from checks that inform the next step
- **Human intervention** -- checkpoints where a person reviews, approves, or corrects

A chatbot answers. An agent works. The product design challenge is to define what work the agent should do, what it should not do, and how a human stays in control of the outcome.

---

## When an Agent Is Appropriate

Not every problem needs an agent. The decision to use one should be deliberate, based on the nature of the work.

### Use an agent when:

- **Work requires multiple steps.** A single lookup does not need an agent. A workflow that involves gathering information, reasoning about it, taking action, and verifying the result does.
- **The path cannot be fully predefined.** If every step is known in advance, a deterministic workflow or script is simpler and more reliable. Agents are valuable when the sequence depends on intermediate results.
- **Tools or systems must be consulted.** The agent needs to read from a database, call an API, search a knowledge base, or interact with an external service as part of its reasoning.
- **Intermediate evidence matters.** The quality of the final output depends on the quality of information gathered and decisions made along the way. The agent must be able to evaluate evidence, not just produce a response.
- **The workflow benefits from adaptive reasoning.** The same trigger may lead to different paths depending on context, and the agent should adjust its approach based on what it finds.

### Do not use an agent when:

- **A deterministic rule is sufficient.** If the input-to-output mapping is fixed and well-understood, a rule engine or simple script is faster, cheaper, and more predictable.
- **A simple search or form is sufficient.** If the user needs a document lookup or a form submission, a dedicated interface is clearer and less error-prone than an agent loop.
- **Mistakes have high impact without review.** If an incorrect action cannot be easily corrected -- financial transactions, legal filings, safety-critical systems -- an agent should not act autonomously.
- **The action cannot be observed or reversed.** If you cannot see what the agent did or undo it, the risk is too high. Every agent action should be traceable and, where possible, reversible.

The right question is not "Can an agent do this?" but "Does this work benefit from an agent's structure -- goal pursuit, multi-step reasoning, tool use, adaptive behavior -- enough to justify the added complexity?"

---

## Agent Product Canvas

The Agent Product Canvas is a design tool for defining what an agent product does and how it works. It has ten dimensions. Each one should be answered concretely before implementation begins.

### 1. Goal

What outcome does the agent pursue? This is the single most important design decision. The goal must be specific enough to guide the agent's behavior and measurable enough to evaluate success. Vague goals like "help the user" or "provide insights" do not produce reliable agents.

### 2. Trigger

What starts the workflow? A trigger can be a user request, a scheduled event, a signal from another system, or a threshold being crossed. The trigger determines when the agent wakes up and what initial context it receives.

### 3. User / Operator

Who interacts with the agent during the workflow, and who oversees it after the fact? These may be different people. The user provides input and receives output. The operator monitors performance, reviews decisions, and adjusts the system over time.

### 4. Context and Knowledge

What information does the agent need to do its work? This includes domain knowledge, user history, current state of the system, relevant documents, and any prior decisions. Context is what makes the agent's behavior situationally appropriate rather than generic.

### 5. Tools

What systems can the agent access? Each tool represents a capability: reading a database, writing to a spreadsheet, calling an API, running a calculation, searching a knowledge base. The set of tools should be intentional -- each tool the agent can call is a capability, and each missing tool is a boundary.

### 6. Workflow and State

What is the sequence of decisions the agent makes, and what information does it retain across steps? The workflow defines the structure of the agent's behavior. State is what allows the agent to build on prior steps rather than starting from scratch each time.

### 7. Autonomy Boundary

Where does the agent act independently, and where does it require approval? This is the most important safety design decision. High-confidence, low-impact actions may be autonomous. High-impact, irreversible, or uncertain actions should require human approval.

### 8. Human Review

What checkpoints require human judgment? Human review is not a failure of automation -- it is a design choice. Good agent products make it easy for a human to inspect intermediate results, approve or reject proposed actions, and provide corrections that improve future behavior.

### 9. Evaluation

How do you measure success? Evaluation should go beyond answer quality. Measure workflow completion rates, decision accuracy, tool usage patterns, human override frequency, and end-to-end outcome quality. The metrics should reflect whether the agent achieved its goal, not just whether it produced a plausible response.

### 10. Failure and Recovery

What happens when things go wrong? Every agent will encounter situations it cannot handle -- missing data, ambiguous instructions, tool failures, unexpected inputs. The product must define how the agent detects failure, what it does when it fails (retry, escalate, halt), and how the system recovers.

---

## Reference Workflow

The following workflow describes the general structure of an agent product. Not every agent follows every step, but the pattern is common enough to serve as a starting point.

```
Signal or user request
    |
    v
Collect context
    |
    v
Form a plan
    |
    v
Call tools
    |
    v
Evaluate evidence
    |
    v
Propose an action
    |
    v
Human approval when required
    |
    v
Execute, record, and learn
```

**Signal or user request.** The workflow begins with a trigger -- a user message, an event from an external system, or a scheduled check. The trigger provides the initial intent.

**Collect context.** The agent gathers the information it needs: relevant documents, current system state, user history, domain knowledge. This step determines the quality of everything that follows.

**Form a plan.** Based on the goal and the available context, the agent determines what steps to take. The plan may be explicit (a written list) or implicit (a structured chain of reasoning). What matters is that the agent has a strategy before it acts.

**Call tools.** The agent executes the planned steps -- querying databases, reading documents, running calculations, calling APIs. Each tool call is an action in the real world, and should be treated with corresponding care.

**Evaluate evidence.** After gathering information, the agent assesses whether the evidence is sufficient, whether the results are consistent, and whether the plan needs to be adjusted. This is the adaptive reasoning step -- where an agent differs from a simple script.

**Propose an action.** The agent recommends a concrete next step: a draft response, a suggested edit, a recommended decision. The proposal should include the reasoning behind it and the evidence that supports it.

**Human approval when required.** Based on the autonomy boundary defined in the product canvas, some actions require human review before execution. The interface for this review should be designed as carefully as any other part of the product.

**Execute, record, and learn.** After approval (or for autonomous actions, after proposal), the agent executes the action, records what it did and why, and stores information that may be useful for future workflow instances.

---

## Product Anti-Patterns

The following patterns are common in agent product design and should be avoided.

**Calling a single LLM response an "agent."** A single prompt-response pair is not an agent. It is a chatbot call. An agent has a goal, a workflow, tools, state, and evaluation. Rebranding a chatbot as an agent does not change the product -- it only changes expectations.

**Starting from model capability instead of user decision.** "We have a model that can do X, so let's build a product around X" is capability-driven design. It produces products that are technically impressive but do not solve a specific problem. Start from the decision the user needs to make, then determine what capability is required.

**Giving tools without defining permissions.** An agent with access to a database can read and write. If you do not define which tables it can read, which it can write, and which it must never touch, you have not given the agent a tool -- you have given it a risk.

**Adding memory without defining what should be remembered.** Memory is not always helpful. If the agent remembers everything, it accumulates noise. If it remembers nothing, it cannot learn from prior interactions. Define what should be remembered, for how long, and under what conditions it should be forgotten.

**Automating high-impact actions without review.** Automation is valuable when the action is reversible, low-impact, and well-understood. Automating a high-impact action without a review checkpoint is not a feature -- it is a liability.

**Evaluating only answer quality instead of workflow outcomes.** A correct answer in the wrong workflow is a bad product. Evaluate whether the agent achieved the goal, not just whether its individual responses were plausible. Measure completion rates, decision accuracy, user satisfaction with the outcome, and the frequency of human corrections.

**Hiding uncertainty and evidence from the user.** Users trust agents more when they can see the reasoning. Hiding uncertainty -- presenting uncertain conclusions with the same confidence as well-supported ones -- erodes trust and makes it harder for users to provide useful corrections.

**Building an agent where deterministic automation is better.** If the workflow is fixed, the inputs are structured, and the outputs are predictable, a script or rule engine is simpler, faster, cheaper, and more reliable. An agent adds value only when the workflow requires adaptive reasoning, unstructured inputs, or dynamic tool use.

---

## Connection to the AI PM Canvas

The Agent Product Canvas maps directly to the 12-dimension AI PM Canvas used elsewhere in this playbook. The relationship is structural -- the Agent Product Canvas is a specialization of the AI PM Canvas for agent-based products.

| Agent Product Canvas | AI PM Canvas |
|---|---|
| Goal | Decision to Support |
| Context and Knowledge | Data / Knowledge Sources + Object Model |
| Tools | AI / Agent Capability |
| Workflow and State | Workflow Boundary |
| Autonomy Boundary | Workflow Boundary + Failure Modes |
| Human Review | Human Review Points |
| Evaluation | Evaluation Criteria |
| Failure and Recovery | Failure Modes |
| Trigger | Business Scenario |
| User / Operator | User / Operator |

If you have already filled out an AI PM Canvas for your product, the Agent Product Canvas refines and extends it for the specific case where the product is an agent. If you have not, start with the AI PM Canvas first -- it provides the broader framing that the agent-specific canvas builds on.

---

## Further Reading

- [Harness Engineering](harness-engineering.md) -- designing the environment in which an agent operates: context, tools, constraints, checks, and state.
- [AI PM Canvas](../AI_PM_CANVAS.md) -- the 12-dimension framework for structured AI product thinking.
- [Anthropic -- Building Effective Agents](https://docs.anthropic.com/en/docs/agents) -- reference documentation for agent design patterns and the Claude Agent SDK.
