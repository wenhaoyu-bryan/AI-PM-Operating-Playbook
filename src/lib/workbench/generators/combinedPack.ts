import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate } from '../schema';
import { generateProductBrief } from './productBrief';
import { generateWorkflowSpec } from './workflowSpec';
import { generateEvaluationPlan } from './evaluationPlan';
import { generateAcceptanceCriteria } from './acceptanceCriteria';
import { generateCodingAgentHandoff } from './codingAgentHandoff';
import { generateClaudeStarter } from './claudeStarter';

interface SectionEntry {
  title: Record<Lang, string>;
  generator: DocumentGenerator;
}

const SECTIONS: SectionEntry[] = [
  { title: { en: 'AI Product Brief', zh: 'AI 产品简报' }, generator: generateProductBrief },
  { title: { en: 'AI/Agent Workflow Specification', zh: 'AI / 智能体工作流规范' }, generator: generateWorkflowSpec },
  { title: { en: 'AI Evaluation Plan', zh: 'AI 评估计划' }, generator: generateEvaluationPlan },
  { title: { en: 'Acceptance Criteria', zh: '验收标准' }, generator: generateAcceptanceCriteria },
  { title: { en: 'Coding Agent Handoff', zh: '编码智能体交付材料' }, generator: generateCodingAgentHandoff },
  { title: { en: 'CLAUDE.md Starter', zh: 'CLAUDE.md 起始文件' }, generator: generateClaudeStarter },
];

function hasAllRequiredFields(project: WorkbenchProject): boolean {
  const checks = [
    project.metadata.projectName.trim(),
    project.metadata.oneLineIdea.trim(),
    project.metadata.productType,
    project.framing.businessScenario.trim(),
    project.framing.targetUser.trim(),
    project.framing.currentWorkflow.trim(),
    project.framing.decisionToSupport.trim(),
    project.framing.expectedOutcome.trim(),
    project.knowledge.dataSources.trim(),
    project.knowledge.knowledgeSources.trim(),
    project.knowledge.coreObjects.trim(),
    project.knowledge.keyRelationships.trim(),
    project.intelligence.aiCapability.trim(),
    project.intelligence.workflowSteps.trim(),
    project.intelligence.humanReview.trim(),
    project.delivery.prototypeScope.trim(),
    project.delivery.evaluationMetrics.trim(),
    project.delivery.acceptanceCriteria.trim(),
  ];
  return checks.every(Boolean);
}

function buildDraftWarning(project: WorkbenchProject, lang: Lang): string {
  const fields: { check: () => boolean; label: string; labelZh: string }[] = [
    { check: () => !!project.metadata.projectName.trim(), label: 'Project Name', labelZh: '项目名称' },
    { check: () => !!project.metadata.oneLineIdea.trim(), label: 'One-Line Idea', labelZh: '一句话描述' },
    { check: () => !!project.metadata.productType, label: 'Product Type', labelZh: '产品类型' },
    { check: () => !!project.framing.businessScenario.trim(), label: 'Business Scenario', labelZh: '业务场景' },
    { check: () => !!project.framing.targetUser.trim(), label: 'Target User', labelZh: '目标用户' },
    { check: () => !!project.framing.currentWorkflow.trim(), label: 'Current Workflow', labelZh: '现有流程' },
    { check: () => !!project.framing.decisionToSupport.trim(), label: 'Decision to Support', labelZh: '需要支持的决策' },
    { check: () => !!project.framing.expectedOutcome.trim(), label: 'Expected Outcome', labelZh: '预期成果' },
    { check: () => !!project.knowledge.dataSources.trim(), label: 'Data Sources', labelZh: '数据来源' },
    { check: () => !!project.knowledge.knowledgeSources.trim(), label: 'Knowledge Sources', labelZh: '知识来源' },
    { check: () => !!project.knowledge.coreObjects.trim(), label: 'Core Objects', labelZh: '核心对象' },
    { check: () => !!project.knowledge.keyRelationships.trim(), label: 'Key Relationships', labelZh: '关键关系' },
    { check: () => !!project.intelligence.aiCapability.trim(), label: 'AI Capability', labelZh: 'AI 能力' },
    { check: () => !!project.intelligence.workflowSteps.trim(), label: 'Workflow Steps', labelZh: '工作流步骤' },
    { check: () => !!project.intelligence.humanReview.trim(), label: 'Human Review', labelZh: '人工审核' },
    { check: () => !!project.delivery.prototypeScope.trim(), label: 'Prototype Scope', labelZh: '原型范围' },
    { check: () => !!project.delivery.evaluationMetrics.trim(), label: 'Evaluation Metrics', labelZh: '评估指标' },
    { check: () => !!project.delivery.acceptanceCriteria.trim(), label: 'Acceptance Criteria', labelZh: '验收标准' },
  ];
  const missing = fields.filter(f => !f.check()).map(f => lang === 'zh' ? f.labelZh : f.label);
  if (missing.length === 0) return '';
  const prefix = lang === 'zh'
    ? '> 草稿状态：尚未完成。以下必填内容尚未定义：'
    : '> Draft status: incomplete. The following required areas have not been defined:';
  return `${prefix} ${missing.join(', ')}`;
}

export const generateCombinedPack: DocumentGenerator = (project, lang) => {
  const { metadata } = project;
  const localizedType = getLocalizedProductType(metadata.productType, lang);
  const formattedDate = formatProjectDate(metadata.updatedAt || metadata.createdAt, lang);
  const isComplete = hasAllRequiredFields(project);

  const lines: string[] = [];

  // Header block
  const headerTitle = lang === 'zh' ? `# AI PM 工作文档包` : `# AI PM Workbench Document Pack`;
  lines.push(headerTitle, '');

  if (lang === 'zh') {
    lines.push(
      `**项目：** ${metadata.projectName || '未命名项目'}`,
      `**产品类型：** ${localizedType}`,
      `**生成日期：** ${formattedDate || '未知'}`,
      `**工作台版本：** 1.0`,
      `**状态：** ${isComplete ? '就绪' : '草稿'}`,
      `**生成工具：** AI PM Workbench`,
      '',
    );
  } else {
    lines.push(
      `**Project:** ${metadata.projectName || 'Untitled Project'}`,
      `**Product Type:** ${localizedType}`,
      `**Generated:** ${formattedDate || 'Unknown'}`,
      `**Workbench Version:** 1.0`,
      `**Status:** ${isComplete ? 'Ready' : 'Draft'}`,
      `**Generated with:** AI PM Workbench`,
      '',
    );
  }

  // Completion warning
  const warning = buildDraftWarning(project, lang);
  if (warning) {
    lines.push(warning, '');
  }

  // Table of Contents
  const tocTitle = lang === 'zh' ? '## 目录' : '## Table of Contents';
  lines.push(tocTitle, '');

  SECTIONS.forEach((section, i) => {
    const anchor = section.title[lang]
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, '-')
      .replace(/^-|-$/g, '');
    lines.push(`${i + 1}. [${section.title[lang]}](#${anchor})`);
  });

  lines.push('', '---', '');

  // Generate each section
  SECTIONS.forEach((section) => {
    const content = section.generator(project, lang);
    lines.push(content, '', '---', '');
  });

  return lines.join('\n');
};
