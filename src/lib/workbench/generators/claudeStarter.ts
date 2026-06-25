import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '尚未定义' : 'Not defined');
const notFilledItalic = (lang: Lang) => (lang === 'zh' ? '_尚未定义_' : '_Not defined_');

function buildDraftWarning(project: WorkbenchProject, lang: Lang): string {
  const fields: { check: () => boolean; label: string; labelZh: string }[] = [
    { check: () => !!project.metadata.oneLineIdea.trim(), label: 'One-Line Idea', labelZh: '一句话描述' },
    { check: () => !!project.framing.businessScenario.trim(), label: 'Business Scenario', labelZh: '业务场景' },
    { check: () => !!project.intelligence.aiCapability.trim(), label: 'AI Capability', labelZh: 'AI 能力' },
    { check: () => !!project.delivery.prototypeScope.trim(), label: 'Prototype Scope', labelZh: '原型范围' },
  ];
  const missing = fields.filter(f => !f.check()).map(f => lang === 'zh' ? f.labelZh : f.label);
  if (missing.length === 0) return '';
  const prefix = lang === 'zh'
    ? '> 草稿状态：尚未完成。以下必填内容尚未定义：'
    : '> Draft status: incomplete. The following required areas have not been defined:';
  return `${prefix} ${missing.join(', ')}`;
}

export const generateClaudeStarter: DocumentGenerator = (project, lang) => {
  const { metadata, framing, knowledge, intelligence, delivery } = project;
  const localizedType = getLocalizedProductType(metadata.productType, lang);

  const lines: string[] = [
    '# CLAUDE.md',
    '',
    lang === 'zh'
      ? '> 起始文件 -- 使用前请检查并自定义。'
      : '> Starting artifact -- review and customize before use.',
    '',
  ];

  // Draft warning
  const warning = buildDraftWarning(project, lang);
  if (warning) lines.push(warning, '');

  // Project Goal
  const pgTitle = lang === 'zh' ? '## 项目目标' : '## Project Goal';
  lines.push(pgTitle, '');
  lines.push(metadata.oneLineIdea || notFilledItalic(lang), '');

  // Product Context
  const pcTitle = lang === 'zh' ? '## 产品上下文' : '## Product Context';
  lines.push(pcTitle, '');
  const pcContent = lang === 'zh'
    ? `- **项目名称：** ${metadata.projectName || '未命名'}\n- **产品类型：** ${localizedType}\n- **业务场景：** ${framing.businessScenario || notFilledItalic(lang)}\n- **目标用户：** ${framing.targetUser || notFilledItalic(lang)}`
    : `- **Project Name:** ${metadata.projectName || 'Untitled'}\n- **Product Type:** ${localizedType}\n- **Business Scenario:** ${framing.businessScenario || notFilledItalic(lang)}\n- **Target User:** ${framing.targetUser || notFilledItalic(lang)}`;
  lines.push(pcContent, '');

  // Scope
  const sTitle = lang === 'zh' ? '## 范围' : '## Scope';
  lines.push(sTitle, '');
  lines.push(delivery.prototypeScope || notFilledItalic(lang), '');

  // Non-goals (optional)
  if (delivery.nonGoals.trim()) {
    const ngTitle = lang === 'zh' ? '## 非目标' : '## Non-Goals';
    lines.push(ngTitle, '');
    lines.push(delivery.nonGoals.trim(), '');
  }

  // Required Workflows
  const rwTitle = lang === 'zh' ? '## 需要实现的工作流' : '## Required Workflows';
  lines.push(rwTitle, '');
  const rwContent = lang === 'zh'
    ? `### AI 能力\n\n${intelligence.aiCapability || notFilledItalic(lang)}\n\n### 工作流步骤\n\n${intelligence.workflowSteps || notFilledItalic(lang)}\n\n### 可用工具\n\n${intelligence.tools || notFilledItalic(lang)}\n\n### 自主性边界\n\n${intelligence.autonomyBoundary || notFilledItalic(lang)}\n\n### 人工审核\n\n${intelligence.humanReview || notFilledItalic(lang)}\n\n### 失败处理\n\n${intelligence.failureHandling || notFilledItalic(lang)}`
    : `### AI Capability\n\n${intelligence.aiCapability || notFilledItalic(lang)}\n\n### Workflow Steps\n\n${intelligence.workflowSteps || notFilledItalic(lang)}\n\n### Tools\n\n${intelligence.tools || notFilledItalic(lang)}\n\n### Autonomy Boundary\n\n${intelligence.autonomyBoundary || notFilledItalic(lang)}\n\n### Human Review\n\n${intelligence.humanReview || notFilledItalic(lang)}\n\n### Failure Handling\n\n${intelligence.failureHandling || notFilledItalic(lang)}`;
  lines.push(rwContent, '');

  // Acceptance Criteria
  const acTitle = lang === 'zh' ? '## 验收标准' : '## Acceptance Criteria';
  lines.push(acTitle, '');
  lines.push(delivery.acceptanceCriteria || notFilledItalic(lang), '');

  // Validation Expectations
  const veTitle = lang === 'zh' ? '## 验证期望' : '## Validation Expectations';
  lines.push(veTitle, '');
  const veContent = lang === 'zh'
    ? `### 评估指标\n\n${delivery.evaluationMetrics || notFilledItalic(lang)}\n\n### 已知风险\n\n${delivery.productionRisks || notFilledItalic(lang)}\n\n### 依赖项\n\n${delivery.dependencies || notFilledItalic(lang)}\n\n### 假设前提\n\n${knowledge.assumptions || notFilledItalic(lang)}\n\n### 待定问题\n\n${delivery.openQuestions || notFilledItalic(lang)}`
    : `### Evaluation Metrics\n\n${delivery.evaluationMetrics || notFilledItalic(lang)}\n\n### Known Risks\n\n${delivery.productionRisks || notFilledItalic(lang)}\n\n### Dependencies\n\n${delivery.dependencies || notFilledItalic(lang)}\n\n### Assumptions\n\n${knowledge.assumptions || notFilledItalic(lang)}\n\n### Open Questions\n\n${delivery.openQuestions || notFilledItalic(lang)}`;
  lines.push(veContent, '');

  // Knowledge context
  const kcTitle = lang === 'zh' ? '## 知识上下文' : '## Knowledge Context';
  lines.push(kcTitle, '');
  const kcContent = lang === 'zh'
    ? `- **数据来源：** ${knowledge.dataSources || notFilledItalic(lang)}\n- **知识来源：** ${knowledge.knowledgeSources || notFilledItalic(lang)}\n- **核心对象：** ${knowledge.coreObjects || notFilledItalic(lang)}\n- **关键关系：** ${knowledge.keyRelationships || notFilledItalic(lang)}`
    : `- **Data Sources:** ${knowledge.dataSources || notFilledItalic(lang)}\n- **Knowledge Sources:** ${knowledge.knowledgeSources || notFilledItalic(lang)}\n- **Core Objects:** ${knowledge.coreObjects || notFilledItalic(lang)}\n- **Key Relationships:** ${knowledge.keyRelationships || notFilledItalic(lang)}`;
  lines.push(kcContent, '');

  return lines.join('\n');
};
