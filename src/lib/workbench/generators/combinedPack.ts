import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate } from '../schema';
import { getExportReady, getMissingRequiredFields } from '../fields';
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

function buildDraftWarning(project: WorkbenchProject, lang: Lang): string {
  const missingGroups = getMissingRequiredFields(project, lang);
  const allMissing = missingGroups.flatMap(g => g.fields);
  if (allMissing.length === 0) return '';
  const prefix = lang === 'zh'
    ? '> 草稿状态：尚未完成。以下必填内容尚未定义：'
    : '> Draft status: incomplete. The following required areas have not been defined:';
  return `${prefix} ${allMissing.join(', ')}`;
}

export const generateCombinedPack: DocumentGenerator = (project, lang) => {
  const { metadata } = project;
  const localizedType = getLocalizedProductType(metadata.productType, lang);
  const formattedDate = formatProjectDate(metadata.updatedAt || metadata.createdAt, lang);
  const isComplete = getExportReady(project);

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
