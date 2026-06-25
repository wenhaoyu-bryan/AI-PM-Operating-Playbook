import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate, parseLineItems } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '尚未定义' : 'Not defined');
const notFilledItalic = (lang: Lang) => (lang === 'zh' ? '_尚未定义_' : '_Not defined_');

/** Required fields per section for the Product Brief */
function getRequiredFields(): { section: string; sectionZh: string; fields: { path: string; label: string; labelZh: string; get: (p: WorkbenchProject) => string }[] }[] {
  return [
    {
      section: 'Project Summary', sectionZh: '项目概要',
      fields: [
        { path: 'metadata.projectName', label: 'Project Name', labelZh: '项目名称', get: p => p.metadata.projectName },
        { path: 'metadata.oneLineIdea', label: 'One-Line Idea', labelZh: '一句话描述', get: p => p.metadata.oneLineIdea },
        { path: 'metadata.productType', label: 'Product Type', labelZh: '产品类型', get: p => p.metadata.productType },
      ],
    },
    {
      section: 'Problem Framing', sectionZh: '问题定义',
      fields: [
        { path: 'framing.businessScenario', label: 'Business Problem', labelZh: '业务场景', get: p => p.framing.businessScenario },
        { path: 'framing.targetUser', label: 'Target User', labelZh: '目标用户', get: p => p.framing.targetUser },
        { path: 'framing.currentWorkflow', label: 'Current Workflow', labelZh: '现有流程', get: p => p.framing.currentWorkflow },
        { path: 'framing.decisionToSupport', label: 'Decision to Support', labelZh: '需要支持的决策', get: p => p.framing.decisionToSupport },
        { path: 'framing.expectedOutcome', label: 'Expected Outcome', labelZh: '预期成果', get: p => p.framing.expectedOutcome },
      ],
    },
    {
      section: 'Data and Knowledge', sectionZh: '数据与知识',
      fields: [
        { path: 'knowledge.dataSources', label: 'Data Sources', labelZh: '数据来源', get: p => p.knowledge.dataSources },
        { path: 'knowledge.knowledgeSources', label: 'Knowledge Sources', labelZh: '知识来源', get: p => p.knowledge.knowledgeSources },
        { path: 'knowledge.coreObjects', label: 'Core Objects', labelZh: '核心对象', get: p => p.knowledge.coreObjects },
        { path: 'knowledge.keyRelationships', label: 'Key Relationships', labelZh: '关键关系', get: p => p.knowledge.keyRelationships },
      ],
    },
    {
      section: 'Proposed AI Capability', sectionZh: 'AI 能力方案',
      fields: [
        { path: 'intelligence.aiCapability', label: 'AI Capability', labelZh: 'AI 能力', get: p => p.intelligence.aiCapability },
        { path: 'intelligence.workflowSteps', label: 'Workflow Overview', labelZh: '工作流概览', get: p => p.intelligence.workflowSteps },
        { path: 'intelligence.humanReview', label: 'Human Review', labelZh: '人工审核', get: p => p.intelligence.humanReview },
      ],
    },
    {
      section: 'Delivery & Evaluation', sectionZh: '交付与评估',
      fields: [
        { path: 'delivery.prototypeScope', label: 'Prototype Scope', labelZh: '原型范围', get: p => p.delivery.prototypeScope },
        { path: 'delivery.evaluationMetrics', label: 'Evaluation Metrics', labelZh: '评估指标', get: p => p.delivery.evaluationMetrics },
      ],
    },
  ];
}

function buildDraftWarning(project: WorkbenchProject, lang: Lang): string {
  const missing: string[] = [];
  for (const sec of getRequiredFields()) {
    for (const f of sec.fields) {
      if (!f.get(project).trim()) {
        missing.push(lang === 'zh' ? f.labelZh : f.label);
      }
    }
  }
  if (missing.length === 0) return '';
  const prefix = lang === 'zh'
    ? '> 草稿状态：尚未完成。以下必填内容尚未定义：'
    : '> Draft status: incomplete. The following required areas have not been defined:';
  return `${prefix} ${missing.join(', ')}`;
}

function optSection(title: string, content: string, lang: Lang): string {
  if (!content.trim()) return '';
  return `## ${title}\n\n${content.trim()}\n`;
}

export const generateProductBrief: DocumentGenerator = (project, lang) => {
  const { metadata, framing, knowledge, intelligence, delivery } = project;
  const title = lang === 'zh' ? `# AI 产品简报` : `# AI Product Brief`;

  const lines: string[] = [title, ''];

  // Draft warning
  const warning = buildDraftWarning(project, lang);
  if (warning) {
    lines.push(warning, '');
  }

  // Project summary
  const summaryTitle = lang === 'zh' ? '项目概要' : 'Project Summary';
  const localizedType = getLocalizedProductType(metadata.productType, lang);
  const formattedDate = formatProjectDate(metadata.updatedAt || metadata.createdAt, lang);
  const summary = lang === 'zh'
    ? `**项目名称：** ${metadata.projectName || notFilled(lang)}\n**一句话描述：** ${metadata.oneLineIdea || notFilled(lang)}\n**产品类型：** ${localizedType}\n**更新日期：** ${formattedDate || notFilled(lang)}`
    : `**Project Name:** ${metadata.projectName || notFilled(lang)}\n**One-Line Idea:** ${metadata.oneLineIdea || notFilled(lang)}\n**Product Type:** ${localizedType}\n**Updated:** ${formattedDate || notFilled(lang)}`;
  lines.push(`## ${summaryTitle}\n\n${summary}\n`);

  // Framing sections
  const framingTitle = lang === 'zh' ? '问题定义' : 'Problem Framing';
  lines.push(`## ${framingTitle}\n`);

  const bpTitle = lang === 'zh' ? '业务场景' : 'Business Problem';
  lines.push(`### ${bpTitle}\n\n${framing.businessScenario || notFilledItalic(lang)}\n`);

  const tuTitle = lang === 'zh' ? '目标用户' : 'Target User';
  lines.push(`### ${tuTitle}\n\n${framing.targetUser || notFilledItalic(lang)}\n`);

  const cwTitle = lang === 'zh' ? '现有流程' : 'Current Workflow';
  lines.push(`### ${cwTitle}\n\n${framing.currentWorkflow || notFilledItalic(lang)}\n`);

  const dtTitle = lang === 'zh' ? '需要支持的决策' : 'Decision to Support';
  lines.push(`### ${dtTitle}\n\n${framing.decisionToSupport || notFilledItalic(lang)}\n`);

  // Problem Evidence (optional)
  if (framing.problemEvidence.trim()) {
    const peTitle = lang === 'zh' ? '问题证据' : 'Problem Evidence';
    lines.push(`### ${peTitle}\n\n${framing.problemEvidence.trim()}\n`);
  }

  const eoTitle = lang === 'zh' ? '预期成果' : 'Expected Outcome';
  lines.push(`### ${eoTitle}\n\n${framing.expectedOutcome || notFilledItalic(lang)}\n`);

  // Knowledge
  const kTitle = lang === 'zh' ? '数据与知识' : 'Data and Knowledge';
  lines.push(`## ${kTitle}\n`);

  const dsTitle = lang === 'zh' ? '数据来源' : 'Data Sources';
  lines.push(`### ${dsTitle}\n\n${knowledge.dataSources || notFilledItalic(lang)}\n`);

  const ksTitle = lang === 'zh' ? '知识来源' : 'Knowledge Sources';
  lines.push(`### ${ksTitle}\n\n${knowledge.knowledgeSources || notFilledItalic(lang)}\n`);

  const coTitle = lang === 'zh' ? '核心对象' : 'Core Objects';
  lines.push(`### ${coTitle}\n\n${knowledge.coreObjects || notFilledItalic(lang)}\n`);

  const krTitle = lang === 'zh' ? '关键关系' : 'Key Relationships';
  lines.push(`### ${krTitle}\n\n${knowledge.keyRelationships || notFilledItalic(lang)}\n`);

  // Assumptions (optional)
  const assumptionsContent = optSection(
    lang === 'zh' ? '假设前提' : 'Assumptions',
    knowledge.assumptions,
    lang,
  );
  if (assumptionsContent) lines.push(`### ${lang === 'zh' ? '假设前提' : 'Assumptions'}\n\n${knowledge.assumptions.trim()}\n`);

  // Intelligence
  const iTitle = lang === 'zh' ? 'AI 能力方案' : 'Proposed AI Capability';
  lines.push(`## ${iTitle}\n`);

  const acTitle = lang === 'zh' ? 'AI 能力' : 'AI Capability';
  lines.push(`### ${acTitle}\n\n${intelligence.aiCapability || notFilledItalic(lang)}\n`);

  const arTitle = lang === 'zh' ? '是否需要 Agent' : 'Agent Required';
  const agentVal = intelligence.agentRequired === 'yes' ? (lang === 'zh' ? '是' : 'Yes') : intelligence.agentRequired === 'no' ? (lang === 'zh' ? '否' : 'No') : (lang === 'zh' ? '未确定' : 'TBD');
  lines.push(`### ${arTitle}\n\n${agentVal}\n`);

  if (intelligence.agentReasoning.trim()) {
    const arnTitle = lang === 'zh' ? '选择理由' : 'Reasoning';
    lines.push(`### ${arnTitle}\n\n${intelligence.agentReasoning.trim()}\n`);
  }

  const wsTitle = lang === 'zh' ? '工作流概览' : 'Workflow Overview';
  lines.push(`### ${wsTitle}\n\n${intelligence.workflowSteps || notFilledItalic(lang)}\n`);

  // Tools (optional)
  if (intelligence.tools.trim()) {
    const tlTitle = lang === 'zh' ? '可用工具' : 'Tools';
    lines.push(`### ${tlTitle}\n\n${intelligence.tools.trim()}\n`);
  }

  const hrTitle = lang === 'zh' ? '人工审核' : 'Human Review';
  lines.push(`### ${hrTitle}\n\n${intelligence.humanReview || notFilledItalic(lang)}\n`);

  // Delivery
  const dTitle = lang === 'zh' ? '交付与评估' : 'Delivery & Evaluation';
  lines.push(`## ${dTitle}\n`);

  const psTitle = lang === 'zh' ? '原型范围' : 'Prototype Scope';
  lines.push(`### ${psTitle}\n\n${delivery.prototypeScope || notFilledItalic(lang)}\n`);

  // Non-Goals (optional)
  if (delivery.nonGoals.trim()) {
    const ngTitle = lang === 'zh' ? '非目标' : 'Non-Goals';
    lines.push(`### ${ngTitle}\n\n${delivery.nonGoals.trim()}\n`);
  }

  const emTitle = lang === 'zh' ? '评估指标' : 'Evaluation Metrics';
  lines.push(`### ${emTitle}\n\n${delivery.evaluationMetrics || notFilledItalic(lang)}\n`);

  // Production Risks (optional)
  if (delivery.productionRisks.trim()) {
    const prTitle = lang === 'zh' ? '生产风险' : 'Risks';
    lines.push(`### ${prTitle}\n\n${delivery.productionRisks.trim()}\n`);
  }

  // Open Questions (optional)
  if (delivery.openQuestions.trim()) {
    const oqTitle = lang === 'zh' ? '待定问题' : 'Open Questions';
    lines.push(`### ${oqTitle}\n\n${delivery.openQuestions.trim()}\n`);
  }

  return lines.join('\n');
};
