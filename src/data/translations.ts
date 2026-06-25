import type { Lang } from '../lib/workbench/schema';

const T = {
  nav: {
    workbench: { en: 'Workbench', zh: '工作台' },
    examples: { en: 'Examples', zh: '示例' },
    templates: { en: 'Templates', zh: '模板' },
    methodology: { en: 'Methodology', zh: '方法论' },
    github: { en: 'GitHub', zh: 'GitHub' },
  },
  workbench: {
    steps: {
      framing: { en: 'Framing', zh: '问题定义' },
      design: { en: 'Design', zh: '方案设计' },
      evaluate: { en: 'Evaluate', zh: '评估验收' },
      export: { en: 'Export', zh: '导出' },
    },
    buttons: {
      next: { en: 'Next', zh: '下一步' },
      prev: { en: 'Back', zh: '上一步' },
      clearProject: { en: 'Clear Project', zh: '清空项目' },
      loadExample: { en: 'Load Example', zh: '加载示例' },
      startBlank: { en: 'Start Blank', zh: '从空白开始' },
      copyAll: { en: 'Copy All', zh: '全部复制' },
      downloadAll: { en: 'Download All', zh: '全部下载' },
      downloadJson: { en: 'Download JSON', zh: '下载 JSON' },
      copyReviewPrompt: { en: 'Copy Review Prompt', zh: '复制评审提示词' },
      copyImplPrompt: { en: 'Copy Implementation Prompt', zh: '复制实施提示词' },
    },
    labels: {
      savedLocally: { en: 'Saved locally', zh: '已本地保存' },
      notUploaded: { en: 'Data is never uploaded', zh: '数据不会上传到任何服务器' },
      completionStatus: { en: 'Completion', zh: '完成度' },
      exportLang: { en: 'Export language', zh: '导出语言' },
      requiredFieldsMissing: { en: 'Required fields are missing', zh: '必填项未填写' },
      productName: { en: 'Project name', zh: '项目名称' },
      oneLineIdea: { en: 'One-line idea', zh: '一句话描述' },
      productType: { en: 'Product type', zh: '产品类型' },
    },
    framing: {
      metadata: { en: 'Project Metadata', zh: '项目基本信息' },
      problemContext: { en: 'Problem Context', zh: '问题上下文' },
      knowledgeContext: { en: 'Knowledge Context', zh: '知识上下文' },
      fields: {
        projectName: {
          label: { en: 'Project Name', zh: '项目名称' },
          hint: { en: 'A short, descriptive name for this project', zh: '项目简短描述性名称' },
          placeholder: { en: 'e.g. Customer Support Triage Agent', zh: '例如：客户支持分流智能体' },
        },
        oneLineIdea: {
          label: { en: 'One-Line Idea', zh: '一句话描述' },
          hint: { en: 'Summarize the product concept in one sentence', zh: '用一句话概括产品概念' },
          placeholder: { en: 'e.g. An AI agent that classifies and routes support tickets', zh: '例如：自动分类和路由客服工单的 AI 智能体' },
        },
        productType: {
          label: { en: 'Product Type', zh: '产品类型' },
          hint: { en: 'Select the AI product pattern that best fits', zh: '选择最匹配的 AI 产品模式' },
          options: {
            empty: { en: '-- Select type --', zh: '-- 选择类型 --' },
            agent: { en: 'Agent', zh: '智能体' },
            rag: { en: 'RAG', zh: 'RAG（检索增强生成）' },
            'content-generation': { en: 'Content Generation', zh: '内容生成' },
            classification: { en: 'Classification', zh: '分类模型' },
            'ontology-knowledge': { en: 'Ontology / Knowledge', zh: '本体/知识图谱' },
            'workflow-automation': { en: 'Workflow Automation', zh: '工作流自动化' },
            other: { en: 'Other', zh: '其他' },
          },
        },
        businessScenario: {
          label: { en: 'Business Scenario', zh: '业务场景' },
          hint: { en: 'What business context does this product operate in?', zh: '该产品在什么业务环境中运作？' },
        },
        targetUser: {
          label: { en: 'Target User', zh: '目标用户' },
          hint: { en: 'Who uses this? Who operates or maintains it?', zh: '谁使用它？谁运营或维护它？' },
        },
        currentWorkflow: {
          label: { en: 'Current Workflow', zh: '现有流程' },
          hint: { en: 'What does the current process look like?', zh: '目前的工作流程是什么样的？' },
        },
        decisionToSupport: {
          label: { en: 'Decision to Support', zh: '需要支持的决策' },
          hint: { en: 'What decision does this product help the user make?', zh: '该产品帮助用户做出什么决策？' },
        },
        problemEvidence: {
          label: { en: 'Problem Evidence', zh: '问题依据' },
          hint: { en: 'What evidence exists that this problem is real?', zh: '有什么证据表明这个问题确实存在？' },
        },
        expectedOutcome: {
          label: { en: 'Expected Outcome', zh: '预期成果' },
          hint: { en: 'What does success look like?', zh: '成功的标准是什么？' },
        },
        dataSources: {
          label: { en: 'Data Sources', zh: '数据来源' },
          hint: { en: 'What structured data is available?', zh: '有哪些可用的结构化数据？' },
        },
        knowledgeSources: {
          label: { en: 'Knowledge Sources', zh: '知识来源' },
          hint: { en: 'What documents, SOPs, or expert knowledge exists?', zh: '有哪些文档、SOP 或专家知识？' },
        },
        coreObjects: {
          label: { en: 'Core Objects', zh: '核心对象' },
          hint: { en: 'What are the main business objects or entities?', zh: '主要的业务对象或实体是什么？' },
        },
        keyRelationships: {
          label: { en: 'Key Relationships', zh: '关键关系' },
          hint: { en: 'How do these objects relate to each other?', zh: '这些对象之间如何关联？' },
        },
        assumptions: {
          label: { en: 'Assumptions', zh: '假设前提' },
          hint: { en: 'What assumptions are you making?', zh: '你做了哪些假设？' },
        },
      },
    },
    stepTitles: {
      framing: {
        businessScenario: { en: 'Business scenario', zh: '业务场景' },
        targetUser: { en: 'Target user', zh: '目标用户' },
        currentWorkflow: { en: 'Current workflow', zh: '现有流程' },
        decisionToSupport: { en: 'Decision to support', zh: '需要支持的决策' },
        problemEvidence: { en: 'Problem evidence', zh: '问题依据' },
        expectedOutcome: { en: 'Expected outcome', zh: '预期成果' },
      },
      design: {
        dataSources: { en: 'Data sources', zh: '数据来源' },
        knowledgeSources: { en: 'Knowledge sources', zh: '知识来源' },
        coreObjects: { en: 'Core objects', zh: '核心对象' },
        keyRelationships: { en: 'Key relationships', zh: '关键关系' },
        assumptions: { en: 'Assumptions', zh: '假设前提' },
        aiCapability: { en: 'AI capability', zh: 'AI 能力' },
        agentRequired: { en: 'Agent required', zh: '是否需要 Agent' },
        agentReasoning: { en: 'Agent reasoning', zh: '选择理由' },
        tools: { en: 'Tools', zh: '工具' },
        workflowSteps: { en: 'Workflow steps', zh: '工作流步骤' },
        autonomyBoundary: { en: 'Autonomy boundary', zh: '自主性边界' },
        humanReview: { en: 'Human review', zh: '人工审核' },
        failureHandling: { en: 'Failure handling', zh: '失败处理' },
        // Hints
        aiCapabilityHint: { en: 'What AI capabilities does this product use?', zh: '这个产品用到什么 AI 能力？' },
        agentRequiredHint: { en: 'Does this product require an agent (multi-step reasoning)?', zh: '这个产品是否需要 Agent（多步推理）？' },
        agentReasoningHint: { en: 'Why does this product need (or not need) an agent?', zh: '为什么这个产品需要（或不需要）Agent？' },
        toolsHint: { en: 'What tools or systems does the AI interact with?', zh: 'AI 会与哪些工具或系统交互？' },
        workflowStepsHint: { en: 'List the workflow steps, one per line', zh: '列出工作流步骤，每行一个' },
        autonomyBoundaryHint: { en: 'Where does AI automation end and human work begin?', zh: 'AI 自动化在哪里结束，人工在哪里开始？' },
        humanReviewHint: { en: 'Where does a human need to review or approve?', zh: '哪里需要人工审核或批准？' },
        failureHandlingHint: { en: 'What happens when the AI fails or is uncertain?', zh: '当 AI 失败或不确定时会发生什么？' },
        // Agent suitability
        agentSuitability: { en: 'Do you need an agent?', zh: '你需要 Agent 吗？' },
        agentYesLabel: { en: 'Yes — multi-step reasoning', zh: '是 — 多步推理' },
        agentNoLabel: { en: 'No — single-step is enough', zh: '否 — 单步足够' },
        agentYesButton: { en: 'Yes, I need an agent', zh: '是，我需要 Agent' },
        agentNoButton: { en: 'No, single-step is enough', zh: '否，单步足够' },
        agentMayBeAppropriate: { en: 'Agent may be appropriate', zh: '适合使用 Agent' },
        agentMayNotBeNeeded: { en: 'Agent may not be needed', zh: '可能不需要 Agent' },
        agentAppropriate1: { en: 'Multi-step workflow with dependencies', zh: '有依赖关系的多步工作流' },
        agentAppropriate2: { en: 'External tools or APIs needed', zh: '需要外部工具或 API' },
        agentAppropriate3: { en: 'Intermediate decisions along the way', zh: '过程中需要中间决策' },
        agentAppropriate4: { en: 'Context-dependent adaptive behavior', zh: '需要根据上下文自适应行为' },
        agentNotNeeded1: { en: 'Deterministic rules are sufficient', zh: '确定性规则已足够' },
        agentNotNeeded2: { en: 'Simple retrieval-only flow', zh: '简单的纯检索流程' },
        agentNotNeeded3: { en: 'High-impact irreversible actions', zh: '高影响不可逆操作' },
        agentNotNeeded4: { en: 'Short, predictable workflow', zh: '短且可预测的工作流' },
        change: { en: 'Change', zh: '更改' },
        selectPlaceholder: { en: 'Select...', zh: '请选择...' },
        // Section headers
        aiWorkflowSection: { en: 'AI / Agent Workflow', zh: 'AI / Agent 工作流' },
        workflowPreview: { en: 'Workflow Preview', zh: '工作流预览' },
      },
      evaluate: {
        prototypeScope: { en: 'Prototype scope', zh: '原型范围' },
        nonGoals: { en: 'Non-goals', zh: '非目标' },
        evaluationMetrics: { en: 'Evaluation metrics', zh: '评估指标' },
        acceptanceCriteria: { en: 'Acceptance criteria', zh: '验收标准' },
        productionRisks: { en: 'Production risks', zh: '生产风险' },
        dependencies: { en: 'Dependencies', zh: '依赖项' },
        openQuestions: { en: 'Open questions', zh: '待定问题' },
      },
      export: {
        title: { en: 'Export Documents', zh: '导出文档' },
      },
    },
  },
  homepage: {
    eyebrow: { en: 'AI Product Manager Toolkit', zh: 'AI 产品经理工具集' },
    title: { en: 'AI PM Operating Playbook', zh: 'AI PM 工作手册' },
    subtitle: {
      en: 'A structured workbench for AI product managers to frame problems, design solutions, and deliver better AI products faster.',
      zh: '一个结构化的工作台，帮助 AI 产品经理定义问题、设计方案、更快更好地交付 AI 产品。',
    },
    primaryCta: { en: 'Open Workbench', zh: '打开工作台' },
    secondaryCta: { en: 'View Examples', zh: '查看示例' },
    workflowSteps: [
      { en: 'Frame the problem', zh: '定义问题' },
      { en: 'Design the solution', zh: '设计方案' },
      { en: 'Evaluate & validate', zh: '评估验证' },
      { en: 'Export artifacts', zh: '导出文档' },
    ],
    outputs: [
      { en: 'Product Brief', zh: '产品简报' },
      { en: 'Workflow Spec', zh: '工作流规范' },
      { en: 'Evaluation Plan', zh: '评估计划' },
      { en: 'Acceptance Criteria', zh: '验收标准' },
      { en: 'Coding Agent Handoff', zh: '编程代理交付文档' },
      { en: 'CLAUDE.md Starter', zh: 'CLAUDE.md 起始文件' },
    ],
    examplesTitle: { en: 'Examples', zh: '示例' },
    authorTitle: { en: 'About the Author', zh: '关于作者' },
    authorBio: {
      en: 'Built by AI PMs, for AI PMs. This playbook is the distillation of real-world experience shipping AI products in enterprise settings.',
      zh: '由 AI 产品经理打造，为 AI 产品经理服务。这本工作手册是企业级 AI 产品实战经验的结晶。',
    },
  },
  examples: {
    title: { en: 'Example Projects', zh: '示例项目' },
    openInWorkbench: { en: 'Open in Workbench', zh: '在工作台中打开' },
    confirmLoad: {
      en: 'This will overwrite your current project. Continue?',
      zh: '这将覆盖当前项目内容，是否继续？',
    },
  },
  templates: {
    title: { en: 'Templates', zh: '模板' },
    description: {
      en: 'Pre-built project templates for common AI product patterns.',
      zh: '针对常见 AI 产品模式的预建项目模板。',
    },
    whenToUse: { en: 'When to use', zh: '适用场景' },
    openWorkbench: { en: 'Start with this template', zh: '使用此模板开始' },
  },
} as const;

type NestedRecord = { [key: string]: string | Record<string, string> | readonly { en: string; zh: string }[] };

function resolve(obj: unknown, parts: string[]): string | undefined {
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === 'string') return current;
  return undefined;
}

export function t(keyPath: string, lang: Lang): string {
  const parts = keyPath.split('.');
  const val = resolve(T, parts);
  if (typeof val === 'string') return val;
  // Try to find a {en, zh} object at this path
  const node = parts.reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && !Array.isArray(acc)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, T);
  if (
    node &&
    typeof node === 'object' &&
    'en' in (node as Record<string, unknown>) &&
    'zh' in (node as Record<string, unknown>)
  ) {
    return (node as Record<string, string>)[lang] ?? (node as Record<string, string>).en;
  }
  return keyPath;
}

export { T };
export type { NestedRecord };
