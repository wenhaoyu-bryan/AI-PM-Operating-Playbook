import type { DocumentGenerator, Lang } from '../schema';

export const generateAcceptanceCriteria: DocumentGenerator = (project, lang) => {
  const { metadata, delivery } = project;
  const title = lang === 'zh' ? `# 验收标准` : `# Acceptance Criteria`;

  const lines: string[] = [title, ''];

  // Project info
  const projInfo = lang === 'zh'
    ? `**项目：** ${metadata.projectName || '未命名项目'}\n**产品类型：** ${metadata.productType || '未指定'}`
    : `**Project:** ${metadata.projectName || 'Untitled Project'}\n**Product Type:** ${metadata.productType || 'Not specified'}`;
  lines.push(projInfo, '');

  // Parse acceptance criteria
  const raw = delivery.acceptanceCriteria.trim();
  const sectionTitle = lang === 'zh' ? '验收清单' : 'Acceptance Checklist';

  lines.push(`## ${sectionTitle}\n`);

  if (raw) {
    const items: string[] = [];
    // Check if already has bullets or numbered items
    const hasBullets = /^[-*]\s|^\d+[.)]\s/m.test(raw);

    if (hasBullets) {
      // Preserve existing list structure, normalize to checkboxes
      const lines_raw = raw.split('\n');
      for (const line of lines_raw) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        // Strip existing list markers
        const content = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+[.)]\s+/, '');
        items.push(content);
      }
    } else {
      // Split by sentences
      const sentences = raw
        .split(/(?<=[.。!！?？])\s*/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (sentences.length > 1) {
        items.push(...sentences);
      } else {
        // Single block — split by semicolons or newlines
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
    // Default criteria
    const defaults = lang === 'zh'
      ? [
          '给定一个符合使用场景的输入，系统在可接受的时间内返回正确的输出',
          '系统能够优雅地处理无效输入，给出清晰的错误提示而非崩溃',
          '所有人工审核点都经过测试，确认人工可以有效地介入和修正',
          '系统在目标并发量下保持稳定，P95 延迟在可接受范围内',
          '输出结果的质量在评估数据集上达到预设的目标指标',
        ]
      : [
          'Given a valid input matching the use case, the system returns correct output within acceptable time',
          'The system gracefully handles invalid inputs with clear error messages instead of crashing',
          'All human review points are tested and confirmed that humans can effectively intervene and correct',
          'The system remains stable under target concurrency with P95 latency within acceptable range',
          'Output quality meets preset target metrics on the evaluation dataset',
        ];

    const note = lang === 'zh'
      ? '> 以下为默认验收标准，请根据项目实际情况修改：'
      : '> The following are default acceptance criteria. Please modify according to your project needs:';

    lines.push(note, '');
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

  // Sign-off
  const signTitle = lang === 'zh' ? '签收' : 'Sign-off';
  const signContent = lang === 'zh'
    ? '| 角色 | 姓名 | 日期 | 签字 |\n|------|------|------|------|\n| 产品经理 | | | |\n| 技术负责人 | | | |\n| 领域专家 | | | |\n| 最终用户代表 | | | |'
    : '| Role | Name | Date | Sign |\n|------|------|------|------|\n| Product Manager | | | |\n| Tech Lead | | | |\n| Domain Expert | | | |\n| End User Representative | | | |';
  lines.push(`## ${signTitle}\n\n${signContent}\n`);

  return lines.join('\n');
};
