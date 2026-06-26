import type { WorkbenchProject, Lang, ProductType } from './schema';

export type ReviewSeverity = 'missing' | 'warning' | 'suggestion';

export interface DesignReviewFinding {
  id: string;
  severity: ReviewSeverity;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  step: 0 | 1 | 2;
  fieldPath?: string;
  category?: 'framing' | 'workflow' | 'evaluation' | 'risk';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isEmpty(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

function hasKeywords(
  text: string,
  keywords: string[],
  caseInsensitive = true
): boolean {
  if (isEmpty(text)) return false;
  const haystack = caseInsensitive ? text.toLowerCase() : text;
  return keywords.some((kw) =>
    haystack.includes(caseInsensitive ? kw.toLowerCase() : kw)
  );
}

function countWorkflowSteps(text: string): number {
  if (isEmpty(text)) return 0;
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && /^(\d+[.)]\s*|[-•*]\s*)/.test(l)).length;
}

function isOnlyVague(text: string): boolean {
  if (isEmpty(text)) return false;
  const vaguePhrases = [
    'good quality',
    'high quality',
    'high accuracy',
    'fast',
    'quick',
    'user likes it',
    'users like it',
    'works well',
    'works good',
    'effective',
    'great',
    'excellent',
    'perfect',
    'nice',
    'better',
    'improve',
    // Chinese
    '好',
    '质量好',
    '质量高',
    '快',
    '速度快',
    '用户喜欢',
    '效果好',
    '好用',
    '高效',
    '优秀',
    '完美',
    '不错',
    '提升',
    '改善',
  ];
  let remaining = text.trim().toLowerCase();
  for (const phrase of vaguePhrases) {
    // Remove the phrase and surrounding punctuation / whitespace
    remaining = remaining
      .split(phrase)
      .join(' ')
      .replace(/[,，;；.。、\s]+/g, ' ')
      .trim();
  }
  return remaining.length === 0;
}

const HIGH_IMPACT_VERBS_EN = [
  'delete',
  'approve',
  'reject',
  'publish',
  'send',
  'pay',
  'transfer',
  'stop',
  'execute',
  'deploy',
];
const HIGH_IMPACT_VERBS_ZH = [
  '删除',
  '批准',
  '拒绝',
  '发布',
  '发送',
  '付款',
  '转账',
  '停机',
  '执行',
  '部署',
];
const HIGH_IMPACT_VERBS = [...HIGH_IMPACT_VERBS_EN, ...HIGH_IMPACT_VERBS_ZH];

const APPROVAL_KEYWORDS = [
  'approval',
  'review',
  'approve',
  '审核',
  '批准',
  '审批',
];

function containsHighImpactVerb(text: string): boolean {
  return hasKeywords(text, HIGH_IMPACT_VERBS);
}

function containsApprovalRef(text: string): boolean {
  return hasKeywords(text, APPROVAL_KEYWORDS);
}

/** Count non-empty "substantive" fields across delivery + framing + intelligence. */
function countFilledFields(p: WorkbenchProject): number {
  let count = 0;
  const check = (s: string) => {
    if (!isEmpty(s)) count++;
  };
  // delivery
  check(p.delivery.prototypeScope);
  check(p.delivery.nonGoals);
  check(p.delivery.evaluationMetrics);
  check(p.delivery.evaluationScenarios);
  check(p.delivery.acceptanceCriteria);
  check(p.delivery.productionRisks);
  check(p.delivery.dependencies);
  check(p.delivery.openQuestions);
  // framing
  check(p.framing.businessScenario);
  check(p.framing.targetUser);
  check(p.framing.currentWorkflow);
  check(p.framing.decisionToSupport);
  check(p.framing.problemEvidence);
  check(p.framing.expectedOutcome);
  // intelligence
  check(p.intelligence.aiCapability);
  check(p.intelligence.agentRequired);
  check(p.intelligence.agentReasoning);
  check(p.intelligence.tools);
  check(p.intelligence.workflowSteps);
  check(p.intelligence.autonomyBoundary);
  check(p.intelligence.humanReview);
  check(p.intelligence.failureHandling);
  return count;
}

// ─── Rule Definitions ────────────────────────────────────────────────────────

function rule1(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.metadata.productType === 'rag' &&
    isEmpty(p.knowledge.knowledgeSources) &&
    isEmpty(p.knowledge.dataSources)
  ) {
    return {
      id: 'rule-1',
      severity: 'missing',
      title: {
        en: 'RAG without knowledge source',
        zh: 'RAG 缺少知识来源',
      },
      description: {
        en: 'This is a RAG product but no knowledge sources or data sources are specified. RAG requires at least one retrievable knowledge source.',
        zh: '这是一个 RAG 产品，但未指定任何知识来源或数据源。RAG 至少需要一个可检索的知识来源。',
      },
      step: 0,
      fieldPath: 'knowledge.knowledgeSources',
      category: 'framing',
    };
  }
  return null;
}

function rule2(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.metadata.productType === 'rag' &&
    !hasKeywords(p.delivery.evaluationMetrics, [
      'groundedness',
      'citation',
      'retrieval',
      'relevance',
      'recall',
      'precision',
    ])
  ) {
    return {
      id: 'rule-2',
      severity: 'suggestion',
      title: {
        en: 'RAG without citation / groundedness evaluation',
        zh: 'RAG 缺少引用/事实性评估',
      },
      description: {
        en: 'RAG products should evaluate groundedness, citation accuracy, or retrieval quality (relevance, recall, precision).',
        zh: 'RAG 产品应评估事实性、引用准确性或检索质量（相关性、召回率、精确率）。',
      },
      step: 2,
      fieldPath: 'delivery.evaluationMetrics',
      category: 'evaluation',
    };
  }
  return null;
}

function rule3(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.intelligence.agentRequired === 'yes' &&
    isEmpty(p.intelligence.tools)
  ) {
    return {
      id: 'rule-3',
      severity: 'warning',
      title: {
        en: 'Agent without tools',
        zh: '智能体缺少工具',
      },
      description: {
        en: 'This product requires an agent but no tools are specified. Agents need tools to take actions in the environment.',
        zh: '该产品需要智能体，但未指定任何工具。智能体需要工具来在环境中执行操作。',
      },
      step: 1,
      fieldPath: 'intelligence.tools',
      category: 'workflow',
    };
  }
  return null;
}

function rule4(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.intelligence.agentRequired === 'yes' &&
    isEmpty(p.intelligence.humanReview)
  ) {
    return {
      id: 'rule-4',
      severity: 'missing',
      title: {
        en: 'Agent without human review',
        zh: '智能体缺少人工审核',
      },
      description: {
        en: 'This agent product has no human review points defined. Every autonomous agent needs human oversight checkpoints.',
        zh: '该智能体产品未定义人工审核环节。每个自主智能体都需要人工监督的检查点。',
      },
      step: 1,
      fieldPath: 'intelligence.humanReview',
      category: 'workflow',
    };
  }
  return null;
}

function rule5(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.intelligence.agentRequired === 'yes' &&
    isEmpty(p.intelligence.failureHandling)
  ) {
    return {
      id: 'rule-5',
      severity: 'missing',
      title: {
        en: 'Agent without failure handling',
        zh: '智能体缺少失败处理',
      },
      description: {
        en: 'No failure handling strategy is defined for this agent. Autonomous systems must plan for failures, retries, and fallbacks.',
        zh: '该智能体未定义失败处理策略。自主系统必须规划失败、重试和回退方案。',
      },
      step: 1,
      fieldPath: 'intelligence.failureHandling',
      category: 'risk',
    };
  }
  return null;
}

function rule6(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.intelligence.agentRequired === 'yes' &&
    isEmpty(p.intelligence.autonomyBoundary)
  ) {
    return {
      id: 'rule-6',
      severity: 'missing',
      title: {
        en: 'Agent without autonomy boundary',
        zh: '智能体缺少自主边界',
      },
      description: {
        en: 'No autonomy boundary is defined. Agents should have clear limits on what they can do without human approval.',
        zh: '未定义自主边界。智能体应明确规定在哪些操作中可以不需要人工批准。',
      },
      step: 1,
      fieldPath: 'intelligence.autonomyBoundary',
      category: 'workflow',
    };
  }
  return null;
}

function rule7(p: WorkbenchProject): DesignReviewFinding | null {
  const agenticKeywords = [
    'plan',
    'retry',
    'decide',
    'choose tool',
    'call tool',
    'loop',
    'observe',
    're-plan',
  ];
  if (
    p.intelligence.agentRequired === 'no' &&
    hasKeywords(p.intelligence.workflowSteps, agenticKeywords)
  ) {
    return {
      id: 'rule-7',
      severity: 'suggestion',
      title: {
        en: 'Non-agent with agentic workflow',
        zh: '非智能体包含智能体工作流',
      },
      description: {
        en: 'The workflow contains agent-like patterns (plan, retry, decide, call tool, loop, observe, re-plan) but agent is marked as not required. Consider whether an agent is actually needed.',
        zh: '工作流包含类似智能体的模式（计划、重试、决策、调用工具、循环、观察、重新规划），但未标记为需要智能体。考虑是否确实需要智能体。',
      },
      step: 1,
      fieldPath: 'intelligence.workflowSteps',
      category: 'workflow',
    };
  }
  return null;
}

function rule8(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.intelligence.agentRequired === 'yes'
  ) {
    const stepCount = countWorkflowSteps(p.intelligence.workflowSteps);
    if (stepCount <= 2 && isEmpty(p.intelligence.tools)) {
      return {
        id: 'rule-8',
        severity: 'suggestion',
        title: {
          en: 'Agent with very simple workflow',
          zh: '智能体工作流过于简单',
      },
      description: {
          en: `The workflow has only ${stepCount} step(s) and no tools listed. A simple prompt may be sufficient instead of a full agent.`,
          zh: `工作流仅有 ${stepCount} 个步骤且未列出工具。简单提示可能就够了，不需要完整智能体。`,
        },
        step: 1,
        fieldPath: 'intelligence.workflowSteps',
        category: 'workflow',
      };
    }
  }
  return null;
}

function rule9(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    !isEmpty(p.delivery.evaluationMetrics) &&
    isEmpty(p.delivery.evaluationScenarios)
  ) {
    return {
      id: 'rule-9',
      severity: 'warning',
      title: {
        en: 'Metrics without evaluation scenarios',
        zh: '评估指标缺少评估场景',
      },
      description: {
        en: 'Evaluation metrics are defined but no evaluation scenarios are specified. Metrics need concrete scenarios to be measured against.',
        zh: '定义了评估指标但未指定评估场景。指标需要具体的场景来衡量。',
      },
      step: 2,
      fieldPath: 'delivery.evaluationScenarios',
      category: 'evaluation',
    };
  }
  return null;
}

function rule10(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    !isEmpty(p.delivery.evaluationScenarios) &&
    isEmpty(p.delivery.acceptanceCriteria)
  ) {
    return {
      id: 'rule-10',
      severity: 'warning',
      title: {
        en: 'Scenarios without acceptance criteria',
        zh: '评估场景缺少验收标准',
      },
      description: {
        en: 'Evaluation scenarios are defined but no acceptance criteria are specified. Scenarios need pass/fail criteria to be actionable.',
        zh: '定义了评估场景但未指定验收标准。场景需要通过/失败标准才能落地。',
      },
      step: 2,
      fieldPath: 'delivery.acceptanceCriteria',
      category: 'evaluation',
    };
  }
  return null;
}

function rule11(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    !isEmpty(p.delivery.prototypeScope) &&
    isEmpty(p.delivery.nonGoals)
  ) {
    return {
      id: 'rule-11',
      severity: 'suggestion',
      title: {
        en: 'Prototype scope without non-goals',
        zh: '原型范围缺少非目标',
      },
      description: {
        en: 'Prototype scope is defined but no non-goals are specified. Defining what is out of scope helps prevent scope creep.',
        zh: '定义了原型范围但未指定非目标。明确范围外的内容有助于防止范围蔓延。',
      },
      step: 2,
      fieldPath: 'delivery.nonGoals',
      category: 'framing',
    };
  }
  return null;
}

function rule12(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    !isEmpty(p.delivery.productionRisks) &&
    isEmpty(p.intelligence.failureHandling)
  ) {
    return {
      id: 'rule-12',
      severity: 'warning',
      title: {
        en: 'Production risks without failure handling',
        zh: '生产风险缺少失败处理',
      },
      description: {
        en: 'Production risks are identified but no failure handling strategy is defined. Each risk needs a corresponding mitigation or fallback plan.',
        zh: '已识别生产风险但未定义失败处理策略。每个风险需要相应的缓解或回退计划。',
      },
      step: 2,
      fieldPath: 'intelligence.failureHandling',
      category: 'risk',
    };
  }
  return null;
}

function rule13(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.metadata.productType === 'ontology-knowledge' &&
    isEmpty(p.knowledge.coreObjects)
  ) {
    return {
      id: 'rule-13',
      severity: 'missing',
      title: {
        en: 'Ontology without core objects',
        zh: '本体/知识图谱缺少核心对象',
      },
      description: {
        en: 'This is an ontology/knowledge product but no core objects are defined. Ontologies are built on a well-defined set of entity types.',
        zh: '这是一个本体/知识图谱产品，但未定义核心对象。本体建立在明确的实体类型之上。',
      },
      step: 0,
      fieldPath: 'knowledge.coreObjects',
      category: 'framing',
    };
  }
  return null;
}

function rule14(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.metadata.productType === 'ontology-knowledge' &&
    isEmpty(p.knowledge.keyRelationships)
  ) {
    return {
      id: 'rule-14',
      severity: 'warning',
      title: {
        en: 'Ontology without relationships',
        zh: '本体/知识图谱缺少关系',
      },
      description: {
        en: 'Core objects are present but no key relationships are defined. Relationships between objects are what make ontologies valuable.',
        zh: '有核心对象但未定义关键关系。对象之间的关系是本体的价值所在。',
      },
      step: 0,
      fieldPath: 'knowledge.keyRelationships',
      category: 'framing',
    };
  }
  return null;
}

function rule15(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.metadata.productType === 'classification' &&
    isEmpty(p.knowledge.coreObjects) &&
    isEmpty(p.knowledge.assumptions) &&
    !hasKeywords(p.metadata.oneLineIdea, [
      'label',
      'category',
      'class',
      'taxonomy',
      'routing',
      '标签',
      '类别',
      '分类',
      '分类法',
      '路由',
    ])
  ) {
    return {
      id: 'rule-15',
      severity: 'suggestion',
      title: {
        en: 'Classification without label / taxonomy context',
        zh: '分类缺少标签/分类法上下文',
      },
      description: {
        en: 'This classification product has no labels, taxonomy, or core objects defined. Classification models need a clear set of target classes.',
        zh: '该分类产品未定义标签、分类法或核心对象。分类模型需要清晰的目标类别。',
      },
      step: 0,
      fieldPath: 'knowledge.coreObjects',
      category: 'framing',
    };
  }
  return null;
}

function rule16(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    p.metadata.productType === 'workflow-automation' &&
    isEmpty(p.intelligence.tools) &&
    isEmpty(p.delivery.dependencies)
  ) {
    return {
      id: 'rule-16',
      severity: 'warning',
      title: {
        en: 'Workflow automation without dependencies',
        zh: '工作流自动化缺少依赖',
      },
      description: {
        en: 'This workflow automation product has no tools or dependencies defined. Automation workflows need clear integration points and system dependencies.',
        zh: '该工作流自动化产品未定义工具或依赖。自动化工作流需要明确的集成点和系统依赖。',
      },
      step: 1,
      fieldPath: 'delivery.dependencies',
      category: 'workflow',
    };
  }
  return null;
}

function rule17(p: WorkbenchProject): DesignReviewFinding | null {
  const workflowText = p.intelligence.workflowSteps;
  const capabilityText = p.intelligence.aiCapability;
  const combined = [workflowText, capabilityText].filter(Boolean).join('\n');

  if (!containsHighImpactVerb(combined)) return null;

  const humanReview = p.intelligence.humanReview;
  if (isEmpty(humanReview) || !containsApprovalRef(humanReview)) {
    return {
      id: 'rule-17',
      severity: 'warning',
      title: {
        en: 'High-impact language without approval checkpoint',
        zh: '高影响操作缺少审批检查点',
      },
      description: {
        en: 'The workflow or AI capability mentions high-impact actions (delete, approve, publish, send, pay, deploy, etc.) but no approval or review checkpoint is defined. Ensure human approval gates exist for irreversible actions.',
        zh: '工作流或 AI 能力中提到了高影响操作（删除、批准、发布、发送、付款、部署等），但未定义审批或审核检查点。请确保不可逆操作有审批关卡。',
      },
      step: 1,
      fieldPath: 'intelligence.humanReview',
      category: 'risk',
    };
  }
  return null;
}

function rule18(p: WorkbenchProject): DesignReviewFinding | null {
  if (
    !isEmpty(p.framing.businessScenario) &&
    !isEmpty(p.framing.expectedOutcome) &&
    isEmpty(p.framing.problemEvidence)
  ) {
    return {
      id: 'rule-18',
      severity: 'suggestion',
      title: {
        en: 'No problem evidence provided',
        zh: '未提供问题证据',
      },
      description: {
        en: 'Business scenario and expected outcome are described but no evidence of the problem is given. Adding data, user quotes, or anecdotes strengthens the case.',
        zh: '描述了业务场景和预期结果，但未给出问题的证据。添加数据、用户引用或轶事可以增强说服力。',
      },
      step: 0,
      fieldPath: 'framing.problemEvidence',
      category: 'framing',
    };
  }
  return null;
}

function rule19(p: WorkbenchProject): DesignReviewFinding | null {
  const filledCount = countFilledFields(p);
  if (filledCount >= 12 && isEmpty(p.delivery.openQuestions)) {
    return {
      id: 'rule-19',
      severity: 'suggestion',
      title: {
        en: 'No open questions when most fields are complete',
        zh: '大部分字段已填写但无开放问题',
      },
      description: {
        en: `${filledCount} fields are filled in but no open questions are recorded. Most real projects have unresolved questions worth documenting.`,
        zh: `已填写 ${filledCount} 个字段但未记录任何开放问题。大多数真实项目都有值得记录的未解决问题。`,
      },
      step: 2,
      fieldPath: 'delivery.openQuestions',
      category: 'framing',
    };
  }
  return null;
}

function rule20(p: WorkbenchProject): DesignReviewFinding | null {
  if (isOnlyVague(p.delivery.evaluationMetrics)) {
    return {
      id: 'rule-20',
      severity: 'suggestion',
      title: {
        en: 'Vague evaluation metrics',
        zh: '评估指标过于模糊',
      },
      description: {
        en: 'Evaluation metrics contain only vague phrases like "good quality", "fast", or "user likes it". Use specific, measurable criteria (e.g., "F1 score > 0.85", "response time < 2s").',
        zh: '评估指标仅包含模糊用语如"效果好""快""用户喜欢"。请使用具体、可衡量的标准（如"F1 分数 > 0.85""响应时间 < 2s"）。',
      },
      step: 2,
      fieldPath: 'delivery.evaluationMetrics',
      category: 'evaluation',
    };
  }
  return null;
}

// ─── Main Entry Point ────────────────────────────────────────────────────────

const ALL_RULES: ((p: WorkbenchProject) => DesignReviewFinding | null)[] = [
  rule1,
  rule2,
  rule3,
  rule4,
  rule5,
  rule6,
  rule7,
  rule8,
  rule9,
  rule10,
  rule11,
  rule12,
  rule13,
  rule14,
  rule15,
  rule16,
  rule17,
  rule18,
  rule19,
  rule20,
];

/**
 * Run all 20 design-review rules against a workbench project.
 * Returns an array of findings for rules whose conditions are met.
 */
export function runDesignReview(
  project: WorkbenchProject
): DesignReviewFinding[] {
  const findings: DesignReviewFinding[] = [];
  for (const rule of ALL_RULES) {
    const finding = rule(project);
    if (finding) findings.push(finding);
  }
  return findings;
}

/**
 * Summarize findings by severity.
 */
export function getReviewSummary(findings: DesignReviewFinding[]): {
  missing: number;
  warning: number;
  suggestion: number;
} {
  const summary = { missing: 0, warning: 0, suggestion: 0 };
  for (const f of findings) {
    summary[f.severity]++;
  }
  return summary;
}
