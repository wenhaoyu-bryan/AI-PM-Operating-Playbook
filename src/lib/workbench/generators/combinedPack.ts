import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate } from '../schema';
import { getExportReady, getMissingRequiredFields } from '../fields';
import { generateProductBrief } from './productBrief';
import { generateWorkflowSpec } from './workflowSpec';
import { generateEvaluationPlan } from './evaluationPlan';
import { generateAcceptanceCriteria } from './acceptanceCriteria';
import { generateCodingAgentHandoff } from './codingAgentHandoff';
import { generateClaudeStarter } from './claudeStarter';
import { runDesignReview, getReviewSummary } from '../designReview';

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
  const headerTitle = lang === 'zh' ? `# AI PM 工作文档包` : `# AI PM Operating Playbook Document Pack`;
  lines.push(headerTitle, '');

  if (lang === 'zh') {
    lines.push(
      `**项目：** ${metadata.projectName || '未命名项目'}`,
      `**产品类型：** ${localizedType}`,
      `**生成日期：** ${formattedDate || '未知'}`,
      `**操作手册版本：** 1.0`,
      `**状态：** ${isComplete ? '就绪' : '草稿'}`,
      `**生成工具：** AI PM Operating Playbook`,
      '',
    );
  } else {
    lines.push(
      `**Project:** ${metadata.projectName || 'Untitled Project'}`,
      `**Product Type:** ${localizedType}`,
      `**Generated:** ${formattedDate || 'Unknown'}`,
      `**Operating Playbook Version:** 1.0`,
      `**Status:** ${isComplete ? 'Ready' : 'Draft'}`,
      `**Generated with:** AI PM Operating Playbook`,
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

  // Design Review section
  const reviewFindings = runDesignReview(project);
  if (reviewFindings.length > 0) {
    const drTitle = lang === 'zh' ? '## 规则型设计检查' : '## Rule-Based Design Review';
    lines.push(drTitle, '');

    const summary = getReviewSummary(reviewFindings);
    const summaryLine = lang === 'zh'
      ? `${summary.missing} 项缺失 · ${summary.warning} 项警告 · ${summary.suggestion} 项建议`
      : `${summary.missing} missing · ${summary.warning} warning · ${summary.suggestion} suggestion`;
    lines.push(summaryLine, '');

    const grouped: Record<string, typeof reviewFindings> = {};
    for (const finding of reviewFindings) {
      const key = finding.severity;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(finding);
    }

    const severityLabels: Record<string, Record<Lang, string>> = {
      missing: { en: 'Missing', zh: '缺失' },
      warning: { en: 'Warnings', zh: '警告' },
      suggestion: { en: 'Suggestions', zh: '建议' },
    };

    for (const severity of ['missing', 'warning', 'suggestion'] as const) {
      const items = grouped[severity];
      if (items?.length) {
        lines.push(`### ${severityLabels[severity][lang]}`, '');
        for (const item of items) {
          lines.push(`- ${item.title[lang]}`);
        }
        lines.push('');
      }
    }

    const disclaimer = lang === 'zh'
      ? '> 这些结果由确定性规则生成，不能替代产品、工程、安全、法务或领域专家评审。'
      : '> These findings are generated from deterministic rules and do not replace product, engineering, security, legal, or domain review.';
    lines.push(disclaimer, '');
    lines.push('---', '');
  }

  return lines.join('\n');
};
