import type { DocumentGenerator, Lang } from '../schema';
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
  { title: { en: 'AI/Agent Workflow Specification', zh: 'AI/Agent 工作流规范' }, generator: generateWorkflowSpec },
  { title: { en: 'AI Evaluation Plan', zh: 'AI 评估计划' }, generator: generateEvaluationPlan },
  { title: { en: 'Acceptance Criteria', zh: '验收标准' }, generator: generateAcceptanceCriteria },
  { title: { en: 'Coding Agent Handoff', zh: '编程代理交付文档' }, generator: generateCodingAgentHandoff },
  { title: { en: 'CLAUDE.md Starter', zh: 'CLAUDE.md 起始文件' }, generator: generateClaudeStarter },
];

export const generateCombinedPack: DocumentGenerator = (project, lang) => {
  const lines: string[] = [];

  // Header
  const headerTitle = lang === 'zh' ? `# AI PM 工作文档包` : `# AI PM Workbench Document Pack`;
  lines.push(headerTitle, '');

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
