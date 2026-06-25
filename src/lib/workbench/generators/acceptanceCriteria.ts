import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '尚未定义' : 'Not defined');
const notFilledItalic = (lang: Lang) => (lang === 'zh' ? '_尚未定义_' : '_Not defined_');

function buildDraftWarning(project: WorkbenchProject, lang: Lang): string {
  const fields: { check: () => boolean; label: string; labelZh: string }[] = [
    { check: () => !!project.metadata.projectName.trim(), label: 'Project Name', labelZh: '项目名称' },
    { check: () => !!project.delivery.acceptanceCriteria.trim(), label: 'Acceptance Criteria', labelZh: '验收标准' },
  ];
  const missing = fields.filter(f => !f.check()).map(f => lang === 'zh' ? f.labelZh : f.label);
  if (missing.length === 0) return '';
  const prefix = lang === 'zh'
    ? '> 草稿状态：尚未完成。以下必填内容尚未定义：'
    : '> Draft status: incomplete. The following required areas have not been defined:';
  return `${prefix} ${missing.join(', ')}`;
}

export const generateAcceptanceCriteria: DocumentGenerator = (project, lang) => {
  const { metadata, delivery } = project;
  const localizedType = getLocalizedProductType(metadata.productType, lang);
  const formattedDate = formatProjectDate(metadata.updatedAt || metadata.createdAt, lang);
  const title = lang === 'zh' ? `# 验收标准` : `# Acceptance Criteria`;

  const lines: string[] = [title, ''];

  // Draft warning
  const warning = buildDraftWarning(project, lang);
  if (warning) lines.push(warning, '');

  // Project info
  const projInfo = lang === 'zh'
    ? `**项目：** ${metadata.projectName || '未命名项目'}\n**产品类型：** ${localizedType}\n**更新日期：** ${formattedDate || notFilled(lang)}`
    : `**Project:** ${metadata.projectName || 'Untitled Project'}\n**Product Type:** ${localizedType}\n**Updated:** ${formattedDate || notFilled(lang)}`;
  lines.push(projInfo, '');

  // Parse acceptance criteria
  const raw = delivery.acceptanceCriteria.trim();
  const sectionTitle = lang === 'zh' ? '验收清单' : 'Acceptance Checklist';

  lines.push(`## ${sectionTitle}\n`);

  if (raw) {
    const items: string[] = [];
    const hasBullets = /^[-*]\s|^\d+[.)]\s/m.test(raw);

    if (hasBullets) {
      const lines_raw = raw.split('\n');
      for (const line of lines_raw) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const content = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+[.)]\s+/, '');
        items.push(content);
      }
    } else {
      const sentences = raw
        .split(/(?<=[.。!！?？])\s*/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (sentences.length > 1) {
        items.push(...sentences);
      } else {
        const parts = raw
          .split(/[;；\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        items.push(...parts);
      }
    }

    items.forEach((item) => {
      lines.push(`- [ ] ${item}`);
    });
    lines.push('');
  } else {
    const defaults = lang === 'zh'
      ? [
          '原型支持已定义的 happy path。',
          '建议包含支撑证据。',
          '高影响操作需要明确的人工批准。',
          '失败的工具调用可见且可恢复。',
          '系统不会在定义的工作流边界之外操作。',
        ]
      : [
          'The prototype supports the defined happy path.',
          'Recommendations include supporting evidence.',
          'High-impact actions require explicit human approval.',
          'Failed tool calls are visible and recoverable.',
          'The system does not act outside the defined workflow boundary.',
        ];
    defaults.forEach((item) => {
      lines.push(`- [ ] ${item}`);
    });
    lines.push('');
  }

  // Additional criteria section
  const addTitle = lang === 'zh' ? '补充标准' : 'Additional Criteria';
  const addContent = lang === 'zh'
    ? '- [ ] 评估数据集已构建并通过质量审查\n- [ ] 文档（产品简报、工作流规范）已生成并经过评审\n- [ ] 所有待定问题已记录并有明确的负责人'
    : '- [ ] Evaluation dataset has been built and passed quality review\n- [ ] Documentation (product brief, workflow spec) has been generated and reviewed\n- [ ] All open questions have been recorded with assigned owners';
  lines.push(`## ${addTitle}\n\n${addContent}\n`);

  // Evaluation Metrics (optional)
  if (delivery.evaluationMetrics.trim()) {
    const emTitle = lang === 'zh' ? '评估指标' : 'Evaluation Metrics';
    lines.push(`## ${emTitle}\n\n${delivery.evaluationMetrics.trim()}\n`);
  }

  // Failure Handling (optional)
  if (project.intelligence.failureHandling.trim()) {
    const fhTitle = lang === 'zh' ? '失败处理' : 'Failure Handling';
    lines.push(`## ${fhTitle}\n\n${project.intelligence.failureHandling.trim()}\n`);
  }

  // Sign-off
  const signTitle = lang === 'zh' ? '签收' : 'Sign-off';
  const signContent = lang === 'zh'
    ? '| 角色 | 姓名 | 日期 | 签字 |\n|------|------|------|------|\n| 产品经理 | | | |\n| 技术负责人 | | | |\n| 领域专家 | | | |\n| 最终用户代表 | | | |'
    : '| Role | Name | Date | Sign |\n|------|------|------|------|\n| Product Manager | | | |\n| Tech Lead | | | |\n| Domain Expert | | | |\n| End User Representative | | | |';
  lines.push(`## ${signTitle}\n\n${signContent}\n`);

  return lines.join('\n');
};
