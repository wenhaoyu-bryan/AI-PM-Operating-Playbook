import type { WorkbenchProject, Lang } from './schema';

export interface WorkbenchFieldDefinition {
  path: string;        // e.g. 'metadata.projectName'
  step: 0 | 1 | 2;    // which step owns this field (not step 3/Export)
  required: boolean;
  label: Record<Lang, string>;
}

// ALL fields across steps 0-2
export const WORKBENCH_FIELD_DEFINITIONS: WorkbenchFieldDefinition[] = [
  // Step 0: Product Framing
  { path: 'metadata.projectName', step: 0, required: true, label: { en: 'Project Name', zh: '项目名称' } },
  { path: 'metadata.oneLineIdea', step: 0, required: true, label: { en: 'One-Line Idea', zh: '一句话描述' } },
  { path: 'metadata.productType', step: 0, required: false, label: { en: 'Product Type', zh: '产品类型' } },
  { path: 'framing.businessScenario', step: 0, required: true, label: { en: 'Business Scenario', zh: '业务场景' } },
  { path: 'framing.targetUser', step: 0, required: true, label: { en: 'Target User', zh: '目标用户' } },
  { path: 'framing.currentWorkflow', step: 0, required: false, label: { en: 'Current Workflow', zh: '现有流程' } },
  { path: 'framing.decisionToSupport', step: 0, required: true, label: { en: 'Decision to Support', zh: '需要支持的决策' } },
  { path: 'framing.problemEvidence', step: 0, required: false, label: { en: 'Problem Evidence', zh: '问题依据' } },
  { path: 'framing.expectedOutcome', step: 0, required: true, label: { en: 'Expected Outcome', zh: '预期成果' } },
  { path: 'knowledge.dataSources', step: 0, required: false, label: { en: 'Data Sources', zh: '数据来源' } },
  { path: 'knowledge.knowledgeSources', step: 0, required: false, label: { en: 'Knowledge Sources', zh: '知识来源' } },
  { path: 'knowledge.coreObjects', step: 0, required: false, label: { en: 'Core Objects', zh: '核心对象' } },
  { path: 'knowledge.keyRelationships', step: 0, required: false, label: { en: 'Key Relationships', zh: '关键关系' } },
  { path: 'knowledge.assumptions', step: 0, required: false, label: { en: 'Assumptions', zh: '假设前提' } },

  // Step 1: AI Workflow Design
  { path: 'intelligence.aiCapability', step: 1, required: true, label: { en: 'AI Capability', zh: 'AI 能力' } },
  { path: 'intelligence.agentRequired', step: 1, required: true, label: { en: 'Agent Decision', zh: 'Agent 决策' } },
  { path: 'intelligence.agentReasoning', step: 1, required: false, label: { en: 'Agent Reasoning', zh: '选择理由' } },
  { path: 'intelligence.tools', step: 1, required: false, label: { en: 'Tools / Systems', zh: '工具/系统' } },
  { path: 'intelligence.workflowSteps', step: 1, required: true, label: { en: 'Workflow Steps', zh: '工作流步骤' } },
  { path: 'intelligence.autonomyBoundary', step: 1, required: true, label: { en: 'Execution Boundary', zh: '执行边界' } },
  { path: 'intelligence.humanReview', step: 1, required: true, label: { en: 'Human Review', zh: '人工审核' } },
  { path: 'intelligence.failureHandling', step: 1, required: true, label: { en: 'Failure Handling', zh: '失败处理' } },

  // Step 2: Evaluation & Risk
  { path: 'delivery.prototypeScope', step: 2, required: true, label: { en: 'Prototype Scope', zh: '原型范围' } },
  { path: 'delivery.nonGoals', step: 2, required: true, label: { en: 'Non-Goals', zh: '非目标' } },
  { path: 'delivery.evaluationMetrics', step: 2, required: true, label: { en: 'Evaluation Metrics', zh: '评估指标' } },
  { path: 'delivery.evaluationScenarios', step: 2, required: false, label: { en: 'Evaluation Scenarios', zh: '评估场景' } },
  { path: 'delivery.acceptanceCriteria', step: 2, required: true, label: { en: 'Acceptance Criteria', zh: '验收标准' } },
  { path: 'delivery.productionRisks', step: 2, required: true, label: { en: 'Production Risks', zh: '生产风险' } },
  { path: 'delivery.dependencies', step: 2, required: false, label: { en: 'Dependencies', zh: '依赖项' } },
  { path: 'delivery.openQuestions', step: 2, required: false, label: { en: 'Open Questions', zh: '待定问题' } },
];

export function getFieldValue(project: WorkbenchProject, path: string): string {
  const parts = path.split('.');
  const section = project[parts[0] as keyof WorkbenchProject] as unknown as Record<string, unknown>;
  if (!section || typeof section !== 'object') return '';
  const val = section[parts[1]];
  return typeof val === 'string' ? val : '';
}

export const STEP_FIELD_DEFINITIONS = [0, 1, 2].map(step => ({
  step: step as 0 | 1 | 2,
  fields: WORKBENCH_FIELD_DEFINITIONS.filter(f => f.step === step),
}));

export const REQUIRED_FIELD_DEFINITIONS = WORKBENCH_FIELD_DEFINITIONS.filter(f => f.required);

export function getStepFieldCount(project: WorkbenchProject, step: 0 | 1 | 2): { filled: number; total: number } {
  const fields = WORKBENCH_FIELD_DEFINITIONS.filter(f => f.step === step);
  const filled = fields.filter(f => getFieldValue(project, f.path).trim() !== '').length;
  return { filled, total: fields.length };
}

export function getRequiredStepStatus(project: WorkbenchProject, step: 0 | 1 | 2): 'not-started' | 'in-progress' | 'ready' {
  const required = REQUIRED_FIELD_DEFINITIONS.filter(f => f.step === step);
  const allFields = WORKBENCH_FIELD_DEFINITIONS.filter(f => f.step === step);
  const anyFilled = allFields.some(f => getFieldValue(project, f.path).trim() !== '');
  const allRequiredFilled = required.every(f => getFieldValue(project, f.path).trim() !== '');
  if (allRequiredFilled) return 'ready';
  if (anyFilled) return 'in-progress';
  return 'not-started';
}

export function getExportReady(project: WorkbenchProject): boolean {
  return ([0, 1, 2] as const).every(step => getRequiredStepStatus(project, step) === 'ready');
}

export function getMissingRequiredFields(project: WorkbenchProject, lang: Lang): { step: 0 | 1 | 2; stepLabel: string; fields: string[] }[] {
  const STEP_LABELS: Record<number, Record<Lang, string>> = {
    0: { en: 'Product Framing', zh: '产品定义' },
    1: { en: 'AI Workflow Design', zh: 'AI 工作流设计' },
    2: { en: 'Evaluation & Risk', zh: '评估与风险' },
  };
  const result: { step: 0 | 1 | 2; stepLabel: string; fields: string[] }[] = [];
  for (const step of [0, 1, 2] as const) {
    const missing = REQUIRED_FIELD_DEFINITIONS
      .filter(f => f.step === step && getFieldValue(project, f.path).trim() === '')
      .map(f => f.label[lang]);
    if (missing.length > 0) {
      result.push({ step, stepLabel: STEP_LABELS[step][lang], fields: missing });
    }
  }
  return result;
}

export function getTotalCompletion(project: WorkbenchProject): { filled: number; total: number } {
  const fields = WORKBENCH_FIELD_DEFINITIONS;
  const filled = fields.filter(f => getFieldValue(project, f.path).trim() !== '').length;
  return { filled, total: fields.length };
}

export function isProjectBlank(project: WorkbenchProject): boolean {
  return WORKBENCH_FIELD_DEFINITIONS.every(f => getFieldValue(project, f.path).trim() === '');
}
