import type { DocumentGenerator, Lang } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '_未填写_' : '_Not filled_');

function section(title: string, content: string, lang: Lang): string {
  const body = content.trim() || notFilled(lang);
  return `## ${title}\n\n${body}\n`;
}

export const generateProductBrief: DocumentGenerator = (project, lang) => {
  const { metadata, framing, knowledge, intelligence, delivery } = project;
  const title = lang === 'zh' ? `# AI 产品简报` : `# AI Product Brief`;

  const lines: string[] = [title, ''];

  // Project summary
  const summaryTitle = lang === 'zh' ? '项目概要' : 'Project Summary';
  const summary = lang === 'zh'
    ? `**项目名称：** ${metadata.projectName || notFilled(lang)}\n**一句话描述：** ${metadata.oneLineIdea || notFilled(lang)}\n**产品类型：** ${metadata.productType || notFilled(lang)}\n**创建日期：** ${metadata.createdAt ? new Date(metadata.createdAt).toLocaleDateString() : notFilled(lang)}`
    : `**Project Name:** ${metadata.projectName || notFilled(lang)}\n**One-Line Idea:** ${metadata.oneLineIdea || notFilled(lang)}\n**Product Type:** ${metadata.productType || notFilled(lang)}\n**Created:** ${metadata.createdAt ? new Date(metadata.createdAt).toLocaleDateString() : notFilled(lang)}`;
  lines.push(`## ${summaryTitle}\n\n${summary}\n`);

  // Framing sections
  const framingTitle = lang === 'zh' ? '问题定义' : 'Problem Framing';
  lines.push(`## ${framingTitle}\n`);

  const bpTitle = lang === 'zh' ? '业务场景' : 'Business Problem';
  lines.push(section(bpTitle, framing.businessScenario, lang));

  const tuTitle = lang === 'zh' ? '目标用户' : 'Target User';
  lines.push(section(tuTitle, framing.targetUser, lang));

  const cwTitle = lang === 'zh' ? '现有流程' : 'Current Workflow';
  lines.push(section(cwTitle, framing.currentWorkflow, lang));

  const dtTitle = lang === 'zh' ? '需要支持的决策' : 'Decision to Support';
  lines.push(section(dtTitle, framing.decisionToSupport, lang));

  const eoTitle = lang === 'zh' ? '预期成果' : 'Expected Outcome';
  lines.push(section(eoTitle, framing.expectedOutcome, lang));

  // Knowledge
  const kTitle = lang === 'zh' ? '数据与知识' : 'Data and Knowledge';
  lines.push(`## ${kTitle}\n`);

  const dsTitle = lang === 'zh' ? '数据来源' : 'Data Sources';
  lines.push(section(dsTitle, knowledge.dataSources, lang));

  const ksTitle = lang === 'zh' ? '知识来源' : 'Knowledge Sources';
  lines.push(section(ksTitle, knowledge.knowledgeSources, lang));

  const coTitle = lang === 'zh' ? '核心对象' : 'Core Objects';
  lines.push(section(coTitle, knowledge.coreObjects, lang));

  const krTitle = lang === 'zh' ? '关键关系' : 'Key Relationships';
  lines.push(section(krTitle, knowledge.keyRelationships, lang));

  // Intelligence
  const iTitle = lang === 'zh' ? 'AI 能力方案' : 'Proposed AI Capability';
  lines.push(`## ${iTitle}\n`);

  const acTitle = lang === 'zh' ? 'AI 能力' : 'AI Capability';
  lines.push(section(acTitle, intelligence.aiCapability, lang));

  const arTitle = lang === 'zh' ? '是否需要 Agent' : 'Agent Required';
  const agentVal = intelligence.agentRequired === 'yes' ? (lang === 'zh' ? '是' : 'Yes') : intelligence.agentRequired === 'no' ? (lang === 'zh' ? '否' : 'No') : notFilled(lang);
  lines.push(`### ${arTitle}\n\n${agentVal}\n`);

  if (intelligence.agentReasoning) {
    const arnTitle = lang === 'zh' ? '选择理由' : 'Reasoning';
    lines.push(section(arnTitle, intelligence.agentReasoning, lang));
  }

  const wsTitle = lang === 'zh' ? '工作流概览' : 'Workflow Overview';
  lines.push(section(wsTitle, intelligence.workflowSteps, lang));

  const hrTitle = lang === 'zh' ? '人工审核' : 'Human Review';
  lines.push(section(hrTitle, intelligence.humanReview, lang));

  // Delivery
  const dTitle = lang === 'zh' ? '交付与评估' : 'Delivery & Evaluation';
  lines.push(`## ${dTitle}\n`);

  const psTitle = lang === 'zh' ? '原型范围' : 'Prototype Scope';
  lines.push(section(psTitle, delivery.prototypeScope, lang));

  const ngTitle = lang === 'zh' ? '非目标' : 'Non-Goals';
  lines.push(section(ngTitle, delivery.nonGoals, lang));

  const emTitle = lang === 'zh' ? '评估指标' : 'Evaluation Metrics';
  lines.push(section(emTitle, delivery.evaluationMetrics, lang));

  const prTitle = lang === 'zh' ? '生产风险' : 'Risks';
  lines.push(section(prTitle, delivery.productionRisks, lang));

  const oqTitle = lang === 'zh' ? '待定问题' : 'Open Questions';
  lines.push(section(oqTitle, delivery.openQuestions, lang));

  return lines.join('\n');
};
