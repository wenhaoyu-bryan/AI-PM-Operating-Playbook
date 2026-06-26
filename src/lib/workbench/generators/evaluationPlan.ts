import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '尚未定义' : 'Not defined');
const notFilledItalic = (lang: Lang) => (lang === 'zh' ? '_尚未定义_' : '_Not defined_');

function buildDraftWarning(project: WorkbenchProject, lang: Lang): string {
  const fields: { check: () => boolean; label: string; labelZh: string }[] = [
    { check: () => !!project.metadata.projectName.trim(), label: 'Project Name', labelZh: '项目名称' },
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

export const generateEvaluationPlan: DocumentGenerator = (project, lang) => {
  const { metadata, framing, delivery } = project;
  const localizedType = getLocalizedProductType(metadata.productType, lang);
  const formattedDate = formatProjectDate(metadata.updatedAt || metadata.createdAt, lang);
  const title = lang === 'zh' ? `# AI 评估计划` : `# AI Evaluation Plan`;

  const lines: string[] = [title, ''];

  // Draft warning
  const warning = buildDraftWarning(project, lang);
  if (warning) lines.push(warning, '');

  // Metadata
  const metaBlock = lang === 'zh'
    ? `**项目名称：** ${metadata.projectName || '未命名项目'}\n**产品类型：** ${localizedType}\n**更新日期：** ${formattedDate || notFilled(lang)}`
    : `**Project Name:** ${metadata.projectName || 'Untitled Project'}\n**Product Type:** ${localizedType}\n**Updated:** ${formattedDate || notFilled(lang)}`;
  lines.push(metaBlock, '');

  // Evaluation Objective
  const eoTitle = lang === 'zh' ? '评估目标' : 'Evaluation Objective';
  const eoContent = lang === 'zh'
    ? `验证 **${metadata.projectName || '未命名项目'}** 在真实业务场景下的有效性、可靠性和用户满意度。确认产品满足验收标准后方可进入下一阶段。`
    : `Validate the effectiveness, reliability, and user satisfaction of **${metadata.projectName || 'Untitled Project'}** in real-world business scenarios. Confirm the product meets acceptance criteria before advancing to the next phase.`;
  lines.push(`## ${eoTitle}\n\n${eoContent}\n`);

  // Task Success Metrics
  const tsmTitle = lang === 'zh' ? '任务成功指标' : 'Task Success Metrics';
  const tsmContent = lang === 'zh'
    ? `| 指标 | 目标值 | 测量方法 |\n|------|--------|----------|\n| 核心任务完成率 | _待定_ | 端到端测试 |\n| 首次成功率 | _待定_ | 用户测试 |\n| 平均完成时间 | _待定_ | 自动化计时 |`
    : `| Metric | Target | Measurement Method |\n|--------|--------|--------------------|\n| Core task completion rate | _TBD_ | End-to-end testing |\n| First-attempt success rate | _TBD_ | User testing |\n| Average completion time | _TBD_ | Automated timing |`;
  lines.push(`## ${tsmTitle}\n\n${tsmContent}\n`);

  // Custom Metrics
  if (delivery.evaluationMetrics.trim()) {
    const cmTitle = lang === 'zh' ? '自定义指标' : 'Custom Metrics';
    lines.push(`### ${cmTitle}\n\n${delivery.evaluationMetrics.trim()}\n`);
  }

  // Evaluation Scenarios
  if (delivery.evaluationScenarios?.trim()) {
    const esTitle = lang === 'zh' ? '评估场景' : 'Evaluation Scenarios';
    lines.push(`## ${esTitle}\n\n${delivery.evaluationScenarios.trim()}\n`);
  }

  // Quality Metrics
  const qmTitle = lang === 'zh' ? '质量指标' : 'Quality Metrics';
  const qmContent = lang === 'zh'
    ? `| 指标 | 目标值 | 测量方法 |\n|------|--------|----------|\n| 输出准确率 | _待定_ | 专家评审 |\n| 输出一致性 | _待定_ | 重复测试 |\n| 误报/幻觉率 | _待定_ | 随机抽检 |`
    : `| Metric | Target | Measurement Method |\n|--------|--------|--------------------|\n| Output accuracy | _TBD_ | Expert review |\n| Output consistency | _TBD_ | Repeated testing |\n| False positive / hallucination rate | _TBD_ | Random sampling |`;
  lines.push(`## ${qmTitle}\n\n${qmContent}\n`);

  // Human Review Metrics
  const hrmTitle = lang === 'zh' ? '人工审核指标' : 'Human Review Metrics';
  const hrmContent = lang === 'zh'
    ? `| 指标 | 目标值 | 测量方法 |\n|------|--------|----------|\n| 人工修改率 | _待定_ | 编辑追踪 |\n| 审核通过率 | _待定_ | 审核日志 |\n| 用户满意度 (CSAT) | ≥ 4/5 | 问卷调查 |`
    : `| Metric | Target | Measurement Method |\n|--------|--------|--------------------|\n| Human edit rate | _TBD_ | Edit tracking |\n| Review approval rate | _TBD_ | Review logs |\n| User satisfaction (CSAT) | ≥ 4/5 | Survey |`;
  lines.push(`## ${hrmTitle}\n\n${hrmContent}\n`);

  // Failure Metrics
  const fmTitle = lang === 'zh' ? '失败指标' : 'Failure Metrics';
  const fmContent = lang === 'zh'
    ? `| 指标 | 目标值 | 测量方法 |\n|------|--------|----------|\n| 系统错误率 | < 1% | 错误日志 |\n| 优雅降级率 | 100% | 故障注入测试 |\n| 平均恢复时间 (MTTR) | _待定_ | 事件追踪 |`
    : `| Metric | Target | Measurement Method |\n|--------|--------|--------------------|\n| System error rate | < 1% | Error logs |\n| Graceful degradation rate | 100% | Fault injection testing |\n| Mean time to recovery (MTTR) | _TBD_ | Incident tracking |`;
  lines.push(`## ${fmTitle}\n\n${fmContent}\n`);

  // Operational Metrics
  const omTitle = lang === 'zh' ? '运维指标' : 'Operational Metrics';
  const omContent = lang === 'zh'
    ? `| 指标 | 目标值 | 测量方法 |\n|------|--------|----------|\n| P95 延迟 | _待定_ | APM 监控 |\n| 单次请求成本 | _待定_ | 成本追踪 |\n| 可用性 (SLA) | ≥ 99.5% | 健康检查 |`
    : `| Metric | Target | Measurement Method |\n|--------|--------|--------------------|\n| P95 latency | _TBD_ | APM monitoring |\n| Cost per request | _TBD_ | Cost tracking |\n| Availability (SLA) | ≥ 99.5% | Health checks |`;
  lines.push(`## ${omTitle}\n\n${omContent}\n`);

  // Acceptance Criteria
  const acTitle = lang === 'zh' ? '验收标准' : 'Acceptance Criteria';
  lines.push(`## ${acTitle}\n\n${delivery.acceptanceCriteria || notFilledItalic(lang)}\n`);

  // Evaluation Dataset
  const edTitle = lang === 'zh' ? '评估数据集' : 'Evaluation Dataset';
  const edContent = lang === 'zh'
    ? '> **待构建：** 需要收集或构建评估数据集，覆盖以下场景：\n>\n> - 正常输入（基准测试）\n> - 边界情况（压力测试）\n> - 异常输入（鲁棒性测试）\n> - 真实用户样本（代表性测试）\n>\n> **数据集规模建议：** 原型阶段 50-100 条，发布前 200+ 条。'
    : '> **To be built:** An evaluation dataset must be collected or constructed, covering:\n>\n> - Normal inputs (baseline testing)\n> - Edge cases (stress testing)\n> - Adversarial inputs (robustness testing)\n> - Real user samples (representativeness testing)\n>\n> **Suggested dataset size:** 50-100 items for prototype, 200+ for pre-launch.';
  lines.push(`## ${edTitle}\n\n${edContent}\n`);

  // Review Process
  const rpTitle = lang === 'zh' ? '评审流程' : 'Review Process';
  const rpContent = lang === 'zh'
    ? '1. **自评阶段：** 开发团队运行自动化测试套件，确认所有指标达标\n2. **专家评审：** 领域专家对 20 个随机样本进行质量评分\n3. **用户测试：** 5-10 名目标用户完成核心场景，填写满意度问卷\n4. **评审会议：** 汇总结果，决定是否通过验收\n5. **问题跟踪：** 未通过项进入下一迭代的修复清单'
    : '1. **Self-assessment:** Dev team runs automated test suite, confirms all metrics pass\n2. **Expert review:** Domain experts score 20 random samples for quality\n3. **User testing:** 5-10 target users complete core scenarios and fill satisfaction survey\n4. **Review meeting:** Consolidate results, make pass/fail decision\n5. **Issue tracking:** Failed items go into the next iteration backlog';
  lines.push(`## ${rpTitle}\n\n${rpContent}\n`);

  // Known Limitations
  const klTitle = lang === 'zh' ? '已知局限' : 'Known Limitations';
  const klContent = lang === 'zh'
    ? '以下已知局限需要在评估过程中特别关注：\n\n- 原型环境与生产环境可能存在差异\n- 评估数据集可能无法覆盖所有真实场景\n- 人工评分存在主观性偏差\n- 指标目标值需根据实际测试结果迭代调整'
    : 'The following known limitations require special attention during evaluation:\n\n- Prototype environment may differ from production\n- Evaluation dataset may not cover all real-world scenarios\n- Human scoring has subjective bias\n- Metric targets may need adjustment based on actual test results';
  lines.push(`## ${klTitle}\n\n${klContent}\n`);

  return lines.join('\n');
};
