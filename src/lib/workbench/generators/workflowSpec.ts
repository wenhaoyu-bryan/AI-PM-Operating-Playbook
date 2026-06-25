import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '尚未定义' : 'Not defined');
const notFilledItalic = (lang: Lang) => (lang === 'zh' ? '_尚未定义_' : '_Not defined_');

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

function buildDraftWarning(project: WorkbenchProject, lang: Lang): string {
  const fields: { check: () => boolean; label: string; labelZh: string }[] = [
    { check: () => !!project.metadata.oneLineIdea.trim(), label: 'One-Line Idea', labelZh: '一句话描述' },
    { check: () => !!project.framing.businessScenario.trim(), label: 'Business Scenario', labelZh: '业务场景' },
    { check: () => !!project.framing.targetUser.trim(), label: 'Target User', labelZh: '目标用户' },
    { check: () => !!project.intelligence.workflowSteps.trim(), label: 'Workflow Steps', labelZh: '工作流步骤' },
    { check: () => !!project.intelligence.aiCapability.trim(), label: 'AI Capability', labelZh: 'AI 能力' },
  ];
  const missing = fields.filter(f => !f.check()).map(f => lang === 'zh' ? f.labelZh : f.label);
  if (missing.length === 0) return '';
  const prefix = lang === 'zh'
    ? '> 草稿状态：尚未完成。以下必填内容尚未定义：'
    : '> Draft status: incomplete. The following required areas have not been defined:';
  return `${prefix} ${missing.join(', ')}`;
}

export const generateWorkflowSpec: DocumentGenerator = (project, lang) => {
  const { metadata, framing, knowledge, intelligence, delivery } = project;
  const isAgent = intelligence.agentRequired === 'yes';
  const localizedType = getLocalizedProductType(metadata.productType, lang);
  const formattedDate = formatProjectDate(metadata.updatedAt || metadata.createdAt, lang);

  const title = lang === 'zh'
    ? `# AI / 智能体工作流规范`
    : `# AI${isAgent ? '/Agent' : ''} Workflow Specification`;

  const lines: string[] = [title, ''];

  // Draft warning
  const warning = buildDraftWarning(project, lang);
  if (warning) lines.push(warning, '');

  // Metadata block
  const metaBlock = lang === 'zh'
    ? `**项目名称：** ${metadata.projectName || notFilled(lang)}\n**产品类型：** ${localizedType}\n**更新日期：** ${formattedDate || notFilled(lang)}`
    : `**Project Name:** ${metadata.projectName || notFilled(lang)}\n**Product Type:** ${localizedType}\n**Updated:** ${formattedDate || notFilled(lang)}`;
  lines.push(metaBlock, '');

  // Goal
  const goalTitle = lang === 'zh' ? '目标' : 'Goal';
  lines.push(`## ${goalTitle}\n\n${metadata.oneLineIdea || notFilledItalic(lang)}\n`);

  // Trigger
  const trigTitle = lang === 'zh' ? '触发条件' : 'Trigger';
  const trigDesc = lang === 'zh'
    ? `当用户或系统触发以下场景时启动工作流：\n\n${framing.businessScenario || notFilledItalic(lang)}`
    : `The workflow is triggered when the following scenario occurs:\n\n${framing.businessScenario || notFilledItalic(lang)}`;
  lines.push(`## ${trigTitle}\n\n${trigDesc}\n`);

  // User / Operator
  const uoTitle = lang === 'zh' ? '用户/操作者' : 'User / Operator';
  lines.push(`## ${uoTitle}\n\n${framing.targetUser || notFilledItalic(lang)}\n`);

  // Decision to Support (optional — show if filled)
  if (framing.decisionToSupport.trim()) {
    const dtTitle = lang === 'zh' ? '需要支持的决策' : 'Decision to Support';
    lines.push(`## ${dtTitle}\n\n${framing.decisionToSupport.trim()}\n`);
  }

  // Context and Knowledge
  const ckTitle = lang === 'zh' ? '上下文与知识' : 'Context and Knowledge';
  lines.push(`## ${ckTitle}\n`);

  const dsLabel = lang === 'zh' ? '数据来源' : 'Data Sources';
  lines.push(`### ${dsLabel}\n\n${knowledge.dataSources || notFilledItalic(lang)}\n`);

  const ksLabel = lang === 'zh' ? '知识来源' : 'Knowledge Sources';
  lines.push(`### ${ksLabel}\n\n${knowledge.knowledgeSources || notFilledItalic(lang)}\n`);

  const coLabel = lang === 'zh' ? '核心对象' : 'Core Objects';
  lines.push(`### ${coLabel}\n\n${knowledge.coreObjects || notFilledItalic(lang)}\n`);

  const krLabel = lang === 'zh' ? '关键关系' : 'Key Relationships';
  lines.push(`### ${krLabel}\n\n${knowledge.keyRelationships || notFilledItalic(lang)}\n`);

  // Available Tools
  const atTitle = lang === 'zh' ? '可用工具' : 'Available Tools';
  lines.push(`## ${atTitle}\n\n${intelligence.tools || notFilledItalic(lang)}\n`);

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
    lines.push(notFilledItalic(lang) + '\n');
  }

  // State
  const stateTitle = lang === 'zh' ? '状态' : 'State';
  const stateDesc = lang === 'zh'
    ? '_在原型阶段为无状态。生产版本需定义状态管理策略。_'
    : '_Stateless in prototype phase. Define state management strategy for production._';
  lines.push(`## ${stateTitle}\n\n${stateDesc}\n`);

  // Autonomy Boundary
  const abTitle = lang === 'zh' ? '自主性边界' : 'Autonomy Boundary';
  lines.push(`## ${abTitle}\n\n${intelligence.autonomyBoundary || notFilledItalic(lang)}\n`);

  // Human Review
  const hrTitle = lang === 'zh' ? '人工审核' : 'Human Review';
  lines.push(`## ${hrTitle}\n\n${intelligence.humanReview || notFilledItalic(lang)}\n`);

  // Failure Handling
  const fhTitle = lang === 'zh' ? '失败处理' : 'Failure Handling';
  lines.push(`## ${fhTitle}\n\n${intelligence.failureHandling || notFilledItalic(lang)}\n`);

  // Audit Requirements
  const auditTitle = lang === 'zh' ? '审计要求' : 'Audit Requirements';
  const auditDesc = lang === 'zh'
    ? '- 所有工作流执行需记录日志\n- 每次 LLM 调用的输入和输出需可追溯\n- 人工审核决策需有时间戳和操作人记录\n- 错误事件需触发告警并记录完整上下文'
    : '- All workflow executions must be logged\n- Input and output of every LLM call must be traceable\n- Human review decisions must include timestamp and operator ID\n- Error events must trigger alerts with full context';
  lines.push(`## ${auditTitle}\n\n${auditDesc}\n`);

  // Evaluation
  const evalTitle = lang === 'zh' ? '评估' : 'Evaluation';
  lines.push(`## ${evalTitle}\n\n${delivery.evaluationMetrics || notFilledItalic(lang)}\n`);

  return lines.join('\n');
};
