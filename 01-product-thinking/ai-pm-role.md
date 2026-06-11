# The AI PM Role

**English** | **[中文](ai-pm-role.zh-CN.md)**


> From "writing documents" to "writing instructions"
> From "managing development" to "harnessing AI"
> From "linear processes" to "rapid iteration"

---

## Traditional PM vs AI PM

### Traditional PM

**Core Responsibilities**:
- Requirements analysis and document writing
- Project management and progress tracking
- Cross-department communication and coordination
- Product launch and operations

**Workflow**:
```
Requirements → PRD → Design → Development → Testing → Launch
```

**Core Skills**:
- Requirements analysis
- Document writing
- Project management
- Communication and coordination

**Toolchain**:
- Documentation: Word, Excel, PPT
- Design: Figma, Sketch
- Project management: Jira, Trello
- Communication: Email, meetings

---

### AI PM

**Core Responsibilities**:
- Requirements analysis and AI instruction design
- Architecture design and technology selection
- Quality assessment and verification
- Rapid iteration and optimization

**Workflow**:
```
Requirements → AI Instructions → AI Generation → Verification → Iteration
```

**Core Skills**:
- Prompt Engineering
- Architecture Design
- Quality Assurance
- Iteration Management

**Toolchain**:
- AI tools: Claude Code, Cursor
- Design: Figma (optional)
- Project management: GitHub Issues
- Communication: Slack, Feishu

---

## Core Competencies of an AI PM

### 1. Architectural Thinking

**Definition**: Understanding how systems work, defining component boundaries and data flows.

**Key Abilities**:
- Define system boundaries
- Design component interfaces
- Reason about data flows
- Evaluate technology choices

**Practice Methods**:
- Draw architecture diagrams before writing code
- Define clear API interfaces
- Clarify data flows and dependencies

**Examples**:
- Ontology OS: Neo4j as data source, NetworkX as computation engine, LLM as reasoning layer
- Fab Agent Space: React frontend + mock data + component-based design

---

### 2. Prompt Engineering

**Definition**: Designing instructions for AI so that it understands your intent and produces high-quality results.

**Key Abilities**:
- Translate requirements into instructions AI can understand
- Design clear constraints and acceptance criteria
- Handle edge cases and errors

**Practice Methods**:
- Describe requirements in a structured way
- Provide concrete examples and counterexamples
- Specify technical constraints and limitations

**Prompt Design Principles**:
1. **Clear**: Use concise language to describe requirements
2. **Specific**: Provide concrete examples and constraints
3. **Complete**: Cover all edge cases
4. **Verifiable**: Define clear acceptance criteria

---

### 3. Quality Assessment

**Definition**: Evaluating the quality of AI output, identifying potential issues and risks.

**Key Abilities**:
- Identify code quality issues
- Detect architecture design flaws
- Assess performance and security risks
- Decide when human intervention is needed

**Practice Methods**:
- Establish quality checklists
- Test critical functionality and edge cases
- Verify the validity of architectural decisions

**Quality Check Dimensions**:
- Functional correctness
- Edge case handling
- Performance
- Security

---

### 4. Rapid Validation

**Definition**: Quickly validating requirements and hypotheses, verifying ideas at minimal cost.

**Key Abilities**:
- Design minimum viable products (MVPs)
- Rapidly generate prototypes
- Collect user feedback
- Iterate and optimize

**Practice Methods**:
- Use AI to rapidly generate prototypes
- Have users try and provide feedback
- Iterate quickly based on feedback
- Validate core assumptions

**Validation Checklist**:
- [ ] Does the core functionality solve the user's problem?
- [ ] Is the interaction flow smooth?
- [ ] Are users willing to use it?
- [ ] Is there business value?

---

## AI PM Workflow

### Phase 1: Requirements Analysis (10 min)

**Input**: Vague requirements description

**Output**: Structured requirements document

**Key Activities**:
- Understand the business context
- Identify target users
- Define the core problem
- Determine priorities

**Tools**: Markdown

---

### Phase 2: Architecture Design (20 min)

**Input**: Structured requirements document

**Output**: System architecture and API design

**Key Activities**:
- Design system architecture
- Define component boundaries
- Design API interfaces
- Select technology stack

**Tools**: Markdown, Excalidraw

---

### Phase 3: AI Generation (30 min)

**Input**: System architecture and API design

**Output**: Working prototype

**Key Activities**:
- Write AI instructions (Prompts)
- Generate code
- Verify functionality
- Fix issues

**Tools**: Claude Code, Cursor

---

### Phase 4: Validation & Iteration (as needed)

**Input**: User feedback

**Output**: Optimized version

**Key Activities**:
- Collect user feedback
- Analyze issues
- Optimize prompts
- Regenerate

**Tools**: Claude Code, Cursor

---

## Challenges for AI PMs

### 1. Technical Understanding

**Challenge**: Need to understand technical architecture and implementation details

**Approach**:
- Learn foundational technical knowledge
- Communicate and collaborate with engineers
- Deepen understanding through practice

**Examples**:
- Ontology OS: Understanding ontology systems by reverse-engineering Palantir AIP
- Fab Agent Space: Understanding React architecture by building prototypes

---

### 2. Quality Control

**Challenge**: AI-generated code quality is inconsistent

**Approach**:
- Establish quality checklists
- Test critical functionality and edge cases
- Verify the validity of architectural decisions

**Quality Check Dimensions**:
- Functional correctness
- Edge case handling
- Performance
- Security

---

### 3. Communication & Collaboration

**Challenge**: Need to communicate with engineers, designers, users, and other stakeholders

**Approach**:
- Use prototypes instead of documents
- Use demos instead of meetings
- Let data speak

**Communication Tips**:
- Use prototypes to showcase ideas
- Use data to support decisions
- Use feedback to validate assumptions

---

## AI PM Growth Path

### Phase 1: Learning the Basics (0-3 months)

**Goal**: Master AI tools and foundational skills

**Learning Content**:
- Prompt Engineering fundamentals
- React + Vite + Tailwind CSS
- Version control (Git)
- Basic architecture design

**Practice Projects**:
- Simple CRUD applications
- Static websites
- Data visualization

---

### Phase 2: Practical Application (3-6 months)

**Goal**: Apply AI tools in real projects

**Learning Content**:
- Complex architecture design
- Performance optimization
- User experience design
- Product thinking

**Practice Projects**:
- Internal tools
- MVP products
- Technical validation

---

### Phase 3: Deep Practice (6-12 months)

**Goal**: Become an AI PM expert

**Learning Content**:
- Ontological thinking
- System architecture design
- Product strategy
- Team management

**Practice Projects**:
- Core products
- Technical platforms
- Team building

---

## The Value of AI PMs

### For Individuals

**Skill Development**:
- Architectural thinking
- Prompt Engineering
- Quality assessment
- Rapid validation

**Career Growth**:
- Broader career options
- Higher salary levels
- Stronger competitiveness

---

### For Teams

**Efficiency Gains**:
- Requirements to prototype: 2-4 weeks → 1-2 hours
- Iteration cycle: 2-3 days → 10 minutes
- Communication overhead: Multiple meetings → One conversation

**Quality Improvements**:
- Faster validation speed
- More iteration cycles
- Better user experience

---

### For Companies

**Business Value**:
- Faster time to market
- Lower development costs
- Higher product success rate

**Competitive Advantage**:
- Faster response to market changes
- Stronger innovation capability
- Better user experience

---

## Summary

**Core Shifts**:
- From "writing documents" to "writing instructions"
- From "managing development" to "harnessing AI"
- From "linear processes" to "rapid iteration"

**Core Competencies**:
- Architectural thinking
- Prompt Engineering
- Quality assessment
- Rapid validation

**Core Value**:
- 15-20x efficiency improvement
- Quality improvement
- Cost reduction

---

*Last Updated: 2026-05-26*
*Based on work practices at TCL CGC Dongzhi*
