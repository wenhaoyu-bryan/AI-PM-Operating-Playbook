import type { DocumentGenerator, Lang } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '_未填写_' : '_Not filled_');

function parseSteps(raw: string): string[] {
  return raw
    .split('\n')
    .map((s) => s.replace(/^\d+[.)]\s*/, '').trim())
    .filter((s) => s.length > 0);
}

function buildMermaid(steps: string[]): string {
  const lines = ['```mermaid', 'flowchart TD'];
  steps.forEach((step, i) => {
    const id = `S${i}`;
    const label = step.replace(/"/g, "'").slice(0, 60);
    if (i === 0) {
      lines.push(`    ${id}[${label}]`);
    } else {
      lines.push(`    S${i - 1} --> ${id}[${label}]`);
    }
  });
  if (steps.length > 0) {
    const lastId = `S${steps.length - 1}`;
    lines.push(`    ${lastId} --> END((Done))`);
  }
  lines.push('```');
  return lines.join('\n');
}

export const generateWorkflowSpec: DocumentGenerator = (project, lang) => {
  const { metadata, framing, knowledge, intelligence, delivery } = project;
  const isAgent = intelligence.agentRequired === 'yes';
  const title = lang === 'zh'
    ? `# AI${isAgent ? '/Agent' : ''} 工作流规范`
    : `# AI${isAgent ? '/Agent' : ''} Workflow Specification`;

  const lines: string[] = [title, ''];

  // Goal
  const goalTitle = lang === 'zh' ? '目标' : 'Goal';
  const goal = metadata.oneLineIdea || notFilled(lang);
  lines.push(`## ${goalTitle}\n\n${goal}\n`);

  // Trigger
  const trigTitle = lang === 'zh' ? '触发条件' : 'Trigger';
  const trigDesc = lang === 'zh'
    ? `当用户或系统触发以下场景时启动工作流：\n\n${framing.businessScenario || notFilled(lang)}`
    : `The workflow is triggered when the following scenario occurs:\n\n${framing.businessScenario || notFilled(lang)}`;
  lines.push(`## ${trigTitle}\n\n${trigDesc}\n`);

  // User / Operator
  const uoTitle = lang === 'zh' ? '用户/操作者' : 'User / Operator';
  lines.push(`## ${uoTitle}\n\n${framing.targetUser || notFilled(lang)}\n`);

  // Context and Knowledge
  const ckTitle = lang === 'zh' ? '上下文与知识' : 'Context and Knowledge';
  lines.push(`## ${ckTitle}\n`);

  const dsLabel = lang === 'zh' ? '数据来源' : 'Data Sources';
  lines.push(`### ${dsLabel}\n\n${knowledge.dataSources || notFilled(lang)}\n`);

  const ksLabel = lang === 'zh' ? '知识来源' : 'Knowledge Sources';
  lines.push(`### ${ksLabel}\n\n${knowledge.knowledgeSources || notFilled(lang)}\n`);

  const coLabel = lang === 'zh' ? '核心对象' : 'Core Objects';
  lines.push(`### ${coLabel}\n\n${knowledge.coreObjects || notFilled(lang)}\n`);

  const krLabel = lang === 'zh' ? '关键关系' : 'Key Relationships';
  lines.push(`### ${krLabel}\n\n${knowledge.keyRelationships || notFilled(lang)}\n`);

  // Available Tools
  const atTitle = lang === 'zh' ? '可用工具' : 'Available Tools';
  lines.push(`## ${atTitle}\n\n${intelligence.tools || notFilled(lang)}\n`);

  // Workflow Steps
  const wsTitle = lang === 'zh' ? '工作流步骤' : 'Workflow Steps';
  lines.push(`## ${wsTitle}\n`);

  if (intelligence.workflowSteps && intelligence.workflowSteps.trim()) {
    const steps = parseSteps(intelligence.workflowSteps);
    steps.forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
    });
    lines.push('');

    // Mermaid diagram
    const mermaidTitle = lang === 'zh' ? '流程图' : 'Flow Diagram';
    lines.push(`### ${mermaidTitle}\n`);
    lines.push(buildMermaid(steps));
    lines.push('');
  } else {
    lines.push(notFilled(lang) + '\n');
  }

  // State
  const stateTitle = lang === 'zh' ? '状态' : 'State';
  const stateDesc = lang === 'zh'
    ? '_在原型阶段为无状态。生产版本需定义状态管理策略。_'
    : '_Stateless in prototype phase. Define state management strategy for production._';
  lines.push(`## ${stateTitle}\n\n${stateDesc}\n`);

  // Autonomy Boundary
  const abTitle = lang === 'zh' ? '自主性边界' : 'Autonomy Boundary';
  lines.push(`## ${abTitle}\n\n${intelligence.autonomyBoundary || notFilled(lang)}\n`);

  // Human Review
  const hrTitle = lang === 'zh' ? '人工审核' : 'Human Review';
  lines.push(`## ${hrTitle}\n\n${intelligence.humanReview || notFilled(lang)}\n`);

  // Failure Handling
  const fhTitle = lang === 'zh' ? '失败处理' : 'Failure Handling';
  lines.push(`## ${fhTitle}\n\n${intelligence.failureHandling || notFilled(lang)}\n`);

  // Audit Requirements
  const auditTitle = lang === 'zh' ? '审计要求' : 'Audit Requirements';
  const auditDesc = lang === 'zh'
    ? '- 所有工作流执行需记录日志\n- 每次 LLM 调用的输入和输出需可追溯\n- 人工审核决策需有时间戳和操作人记录\n- 错误事件需触发告警并记录完整上下文'
    : '- All workflow executions must be logged\n- Input and output of every LLM call must be traceable\n- Human review decisions must include timestamp and operator ID\n- Error events must trigger alerts with full context';
  lines.push(`## ${auditTitle}\n\n${auditDesc}\n`);

  // Evaluation
  const evalTitle = lang === 'zh' ? '评估' : 'Evaluation';
  lines.push(`## ${evalTitle}\n\n${delivery.evaluationMetrics || notFilled(lang)}\n`);

  return lines.join('\n');
};
