import type { DocumentGenerator, Lang } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '_未填写_' : '_Not filled_');

export const generateClaudeStarter: DocumentGenerator = (project, lang) => {
  const { metadata, framing, knowledge, intelligence, delivery } = project;

  const lines: string[] = [
    '# CLAUDE.md',
    '',
    '> Starting artifact -- review and customize before use.',
    '',
  ];

  // Project Goal
  const pgTitle = lang === 'zh' ? '## 项目目标' : '## Project Goal';
  lines.push(pgTitle, '');
  lines.push(metadata.oneLineIdea || notFilled(lang), '');

  // Product Context
  const pcTitle = lang === 'zh' ? '## 产品上下文' : '## Product Context';
  lines.push(pcTitle, '');
  const pcContent = lang === 'zh'
    ? `- **项目名称：** ${metadata.projectName || '未命名'}\n- **产品类型：** ${metadata.productType || '未指定'}\n- **业务场景：** ${framing.businessScenario || notFilled(lang)}\n- **目标用户：** ${framing.targetUser || notFilled(lang)}`
    : `- **Project Name:** ${metadata.projectName || 'Untitled'}\n- **Product Type:** ${metadata.productType || 'Not specified'}\n- **Business Scenario:** ${framing.businessScenario || notFilled(lang)}\n- **Target User:** ${framing.targetUser || notFilled(lang)}`;
  lines.push(pcContent, '');

  // Scope
  const sTitle = lang === 'zh' ? '## 范围' : '## Scope';
  lines.push(sTitle, '');
  lines.push(delivery.prototypeScope || notFilled(lang), '');

  // Non-goals
  const ngTitle = lang === 'zh' ? '## 非目标' : '## Non-Goals';
  lines.push(ngTitle, '');
  lines.push(delivery.nonGoals || notFilled(lang), '');

  // Required Workflows
  const rwTitle = lang === 'zh' ? '## 需要实现的工作流' : '## Required Workflows';
  lines.push(rwTitle, '');
  const rwContent = lang === 'zh'
    ? `### AI 能力\n\n${intelligence.aiCapability || notFilled(lang)}\n\n### 工作流步骤\n\n${intelligence.workflowSteps || notFilled(lang)}\n\n### 可用工具\n\n${intelligence.tools || notFilled(lang)}\n\n### 自主性边界\n\n${intelligence.autonomyBoundary || notFilled(lang)}\n\n### 人工审核\n\n${intelligence.humanReview || notFilled(lang)}\n\n### 失败处理\n\n${intelligence.failureHandling || notFilled(lang)}`
    : `### AI Capability\n\n${intelligence.aiCapability || notFilled(lang)}\n\n### Workflow Steps\n\n${intelligence.workflowSteps || notFilled(lang)}\n\n### Tools\n\n${intelligence.tools || notFilled(lang)}\n\n### Autonomy Boundary\n\n${intelligence.autonomyBoundary || notFilled(lang)}\n\n### Human Review\n\n${intelligence.humanReview || notFilled(lang)}\n\n### Failure Handling\n\n${intelligence.failureHandling || notFilled(lang)}`;
  lines.push(rwContent, '');

  // Acceptance Criteria
  const acTitle = lang === 'zh' ? '## 验收标准' : '## Acceptance Criteria';
  lines.push(acTitle, '');
  lines.push(delivery.acceptanceCriteria || notFilled(lang), '');

  // Validation Expectations
  const veTitle = lang === 'zh' ? '## 验证期望' : '## Validation Expectations';
  lines.push(veTitle, '');
  const veContent = lang === 'zh'
    ? `### 评估指标\n\n${delivery.evaluationMetrics || notFilled(lang)}\n\n### 已知风险\n\n${delivery.productionRisks || notFilled(lang)}\n\n### 依赖项\n\n${delivery.dependencies || notFilled(lang)}\n\n### 假设前提\n\n${knowledge.assumptions || notFilled(lang)}\n\n### 待定问题\n\n${delivery.openQuestions || notFilled(lang)}`
    : `### Evaluation Metrics\n\n${delivery.evaluationMetrics || notFilled(lang)}\n\n### Known Risks\n\n${delivery.productionRisks || notFilled(lang)}\n\n### Dependencies\n\n${delivery.dependencies || notFilled(lang)}\n\n### Assumptions\n\n${knowledge.assumptions || notFilled(lang)}\n\n### Open Questions\n\n${delivery.openQuestions || notFilled(lang)}`;
  lines.push(veContent, '');

  // Knowledge context
  const kcTitle = lang === 'zh' ? '## 知识上下文' : '## Knowledge Context';
  lines.push(kcTitle, '');
  const kcContent = lang === 'zh'
    ? `- **数据来源：** ${knowledge.dataSources || notFilled(lang)}\n- **知识来源：** ${knowledge.knowledgeSources || notFilled(lang)}\n- **核心对象：** ${knowledge.coreObjects || notFilled(lang)}\n- **关键关系：** ${knowledge.keyRelationships || notFilled(lang)}`
    : `- **Data Sources:** ${knowledge.dataSources || notFilled(lang)}\n- **Knowledge Sources:** ${knowledge.knowledgeSources || notFilled(lang)}\n- **Core Objects:** ${knowledge.coreObjects || notFilled(lang)}\n- **Key Relationships:** ${knowledge.keyRelationships || notFilled(lang)}`;
  lines.push(kcContent, '');

  return lines.join('\n');
};
