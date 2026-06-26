import type { DocumentGenerator, Lang, WorkbenchProject } from '../schema';
import { getLocalizedProductType, formatProjectDate } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '尚未定义' : 'Not defined');
const notFilledItalic = (lang: Lang) => (lang === 'zh' ? '_尚未定义_' : '_Not defined_');

function buildDraftWarning(project: WorkbenchProject, lang: Lang): string {
  const fields: { check: () => boolean; label: string; labelZh: string }[] = [
    { check: () => !!project.metadata.oneLineIdea.trim(), label: 'One-Line Idea', labelZh: '一句话描述' },
    { check: () => !!project.framing.businessScenario.trim(), label: 'Business Scenario', labelZh: '业务场景' },
    { check: () => !!project.framing.targetUser.trim(), label: 'Target User', labelZh: '目标用户' },
    { check: () => !!project.intelligence.aiCapability.trim(), label: 'AI Capability', labelZh: 'AI 能力' },
    { check: () => !!project.delivery.prototypeScope.trim(), label: 'Prototype Scope', labelZh: '原型范围' },
    { check: () => !!project.delivery.acceptanceCriteria.trim(), label: 'Acceptance Criteria', labelZh: '验收标准' },
  ];
  const missing = fields.filter(f => !f.check()).map(f => lang === 'zh' ? f.labelZh : f.label);
  if (missing.length === 0) return '';
  const prefix = lang === 'zh'
    ? '> 草稿状态：尚未完成。以下必填内容尚未定义：'
    : '> Draft status: incomplete. The following required areas have not been defined:';
  return `${prefix} ${missing.join(', ')}`;
}

export const generateCodingAgentHandoff: DocumentGenerator = (project, lang) => {
  const { metadata, framing, knowledge, intelligence, delivery } = project;
  const localizedType = getLocalizedProductType(metadata.productType, lang);
  const formattedDate = formatProjectDate(metadata.updatedAt || metadata.createdAt, lang);
  const title = lang === 'zh' ? `# 编码智能体交付材料` : `# Coding Agent Handoff`;

  const lines: string[] = [title, ''];

  // Draft warning
  const warning = buildDraftWarning(project, lang);
  if (warning) lines.push(warning, '');

  // Project Goal
  const pgTitle = lang === 'zh' ? '项目目标' : 'Project Goal';
  lines.push(`## ${pgTitle}\n\n${metadata.oneLineIdea || notFilledItalic(lang)}\n`);

  // Product Context
  const pcTitle = lang === 'zh' ? '产品上下文' : 'Product Context';
  const pcContent = lang === 'zh'
    ? `**项目名称：** ${metadata.projectName || '未命名'}\n**产品类型：** ${localizedType}\n**业务场景：** ${framing.businessScenario || notFilledItalic(lang)}\n**更新日期：** ${formattedDate || notFilled(lang)}`
    : `**Project Name:** ${metadata.projectName || 'Untitled'}\n**Product Type:** ${localizedType}\n**Business Scenario:** ${framing.businessScenario || notFilledItalic(lang)}\n**Updated:** ${formattedDate || notFilled(lang)}`;
  lines.push(`## ${pcTitle}\n\n${pcContent}\n`);

  // Target User
  const tuTitle = lang === 'zh' ? '目标用户' : 'Target User';
  lines.push(`## ${tuTitle}\n\n${framing.targetUser || notFilledItalic(lang)}\n`);

  // Core User Flow
  const cufTitle = lang === 'zh' ? '核心用户流程' : 'Core User Flow';
  const cufContent = lang === 'zh'
    ? `**现有流程：**\n\n${framing.currentWorkflow || notFilledItalic(lang)}\n\n**预期成果：**\n\n${framing.expectedOutcome || notFilledItalic(lang)}`
    : `**Current Workflow:**\n\n${framing.currentWorkflow || notFilledItalic(lang)}\n\n**Expected Outcome:**\n\n${framing.expectedOutcome || notFilledItalic(lang)}`;
  lines.push(`## ${cufTitle}\n\n${cufContent}\n`);

  // Decision to Support (optional)
  if (framing.decisionToSupport.trim()) {
    const dtTitle = lang === 'zh' ? '需要支持的决策' : 'Decision to Support';
    lines.push(`## ${dtTitle}\n\n${framing.decisionToSupport.trim()}\n`);
  }

  // Required AI Capability
  const racTitle = lang === 'zh' ? '所需 AI 能力' : 'Required AI Capability';
  const agentLabel = intelligence.agentRequired === 'yes'
    ? (lang === 'zh' ? '是' : 'Yes')
    : intelligence.agentRequired === 'no'
      ? (lang === 'zh' ? '否' : 'No')
      : (lang === 'zh' ? '未确定' : 'TBD');
  let racContent = `${intelligence.aiCapability || notFilledItalic(lang)}\n\n${lang === 'zh' ? '**是否需要 Agent：**' : '**Agent Required:**'} ${agentLabel}`;
  if (intelligence.agentReasoning.trim()) {
    racContent += `\n\n${lang === 'zh' ? '**选择理由：**' : '**Reasoning:**'} ${intelligence.agentReasoning.trim()}`;
  }
  lines.push(`## ${racTitle}\n\n${racContent}\n`);

  // Data and Knowledge Context
  const dkcTitle = lang === 'zh' ? '数据与知识上下文' : 'Data and Knowledge Context';
  const dkcContent = lang === 'zh'
    ? `### 数据来源\n\n${knowledge.dataSources || notFilledItalic(lang)}\n\n### 知识来源\n\n${knowledge.knowledgeSources || notFilledItalic(lang)}\n\n### 核心对象\n\n${knowledge.coreObjects || notFilledItalic(lang)}\n\n### 关键关系\n\n${knowledge.keyRelationships || notFilledItalic(lang)}`
    : `### Data Sources\n\n${knowledge.dataSources || notFilledItalic(lang)}\n\n### Knowledge Sources\n\n${knowledge.knowledgeSources || notFilledItalic(lang)}\n\n### Core Objects\n\n${knowledge.coreObjects || notFilledItalic(lang)}\n\n### Key Relationships\n\n${knowledge.keyRelationships || notFilledItalic(lang)}`;
  lines.push(`## ${dkcTitle}\n\n${dkcContent}\n`);

  // Scope
  const sTitle = lang === 'zh' ? '范围' : 'Scope';
  lines.push(`## ${sTitle}\n\n${delivery.prototypeScope || notFilledItalic(lang)}\n`);

  // Non-goals (optional)
  if (delivery.nonGoals.trim()) {
    const ngTitle = lang === 'zh' ? '非目标' : 'Non-Goals';
    lines.push(`## ${ngTitle}\n\n${delivery.nonGoals.trim()}\n`);
  }

  // Workflow Requirements
  const wrTitle = lang === 'zh' ? '工作流要求' : 'Workflow Requirements';
  const wrContent = lang === 'zh'
    ? `**工作流步骤：**\n\n${intelligence.workflowSteps || notFilledItalic(lang)}\n\n**可用工具：**\n\n${intelligence.tools || notFilledItalic(lang)}`
    : `**Workflow Steps:**\n\n${intelligence.workflowSteps || notFilledItalic(lang)}\n\n**Available Tools:**\n\n${intelligence.tools || notFilledItalic(lang)}`;
  lines.push(`## ${wrTitle}\n\n${wrContent}\n`);

  // Human Review Requirements
  const hrrTitle = lang === 'zh' ? '人工审核要求' : 'Human Review Requirements';
  const hrrContent = lang === 'zh'
    ? `**审核点：**\n\n${intelligence.humanReview || notFilledItalic(lang)}\n\n**自主性边界：**\n\n${intelligence.autonomyBoundary || notFilledItalic(lang)}`
    : `**Review Points:**\n\n${intelligence.humanReview || notFilledItalic(lang)}\n\n**Autonomy Boundary:**\n\n${intelligence.autonomyBoundary || notFilledItalic(lang)}`;
  lines.push(`## ${hrrTitle}\n\n${hrrContent}\n`);

  // Evaluation Requirements
  const erTitle = lang === 'zh' ? '评估要求' : 'Evaluation Requirements';
  lines.push(`## ${erTitle}\n\n${delivery.evaluationMetrics || notFilledItalic(lang)}\n`);

  // Evaluation and Test Scenarios
  if (delivery.evaluationScenarios?.trim()) {
    const etsTitle = lang === 'zh' ? '评估与测试场景' : 'Evaluation and Test Scenarios';
    lines.push(`## ${etsTitle}\n\n${delivery.evaluationScenarios.trim()}\n`);
  }

  // Acceptance Criteria
  const acTitle = lang === 'zh' ? '验收标准' : 'Acceptance Criteria';
  lines.push(`## ${acTitle}\n\n${delivery.acceptanceCriteria || notFilledItalic(lang)}\n`);

  // Product Constraints
  const pc2Title = lang === 'zh' ? '产品约束' : 'Product Constraints';
  const constraintsParts: string[] = [];
  if (knowledge.assumptions.trim()) {
    constraintsParts.push(lang === 'zh' ? `**假设前提：**\n\n${knowledge.assumptions.trim()}` : `**Assumptions:**\n\n${knowledge.assumptions.trim()}`);
  }
  if (delivery.dependencies.trim()) {
    constraintsParts.push(lang === 'zh' ? `**依赖项：**\n\n${delivery.dependencies.trim()}` : `**Dependencies:**\n\n${delivery.dependencies.trim()}`);
  }
  if (constraintsParts.length > 0) {
    lines.push(`## ${pc2Title}\n\n${constraintsParts.join('\n\n')}\n`);
  }

  // Known Risks (optional)
  if (delivery.productionRisks.trim()) {
    const krTitle = lang === 'zh' ? '已知风险' : 'Known Risks';
    lines.push(`## ${krTitle}\n\n${delivery.productionRisks.trim()}\n`);
  }

  // Open Questions (optional)
  if (delivery.openQuestions.trim()) {
    const oqTitle = lang === 'zh' ? '待定问题' : 'Open Questions';
    lines.push(`## ${oqTitle}\n\n${delivery.openQuestions.trim()}\n`);
  }

  // Failure Handling (optional)
  if (intelligence.failureHandling.trim()) {
    const fhTitle = lang === 'zh' ? '失败处理' : 'Failure Handling';
    lines.push(`## ${fhTitle}\n\n${intelligence.failureHandling.trim()}\n`);
  }

  // Implementation Guidance
  const igTitle = lang === 'zh' ? '实施指南' : 'Implementation Guidance';
  const igContent = lang === 'zh'
    ? '按以下顺序推进实施：\n\n1. **搭建基础框架：** 初始化项目结构、配置 LLM API 客户端、建立数据模型\n2. **实现核心 AI 能力：** 编写 prompt 模板、实现主工作流逻辑、接入所需工具\n3. **构建用户界面：** 实现核心交互流程、表单输入、结果展示\n4. **添加审核机制：** 实现人工审核点、反馈收集、错误处理流程\n5. **集成评估框架：** 实现评估指标计算、测试数据集加载、自动化测试\n6. **打磨与交付：** 处理边界情况、优化性能、编写文档、部署到预览环境'
    : 'Implement in the following order:\n\n1. **Set up foundation:** Initialize project structure, configure LLM API client, establish data models\n2. **Implement core AI capability:** Write prompt templates, implement main workflow logic, integrate required tools\n3. **Build user interface:** Implement core interaction flows, form inputs, result display\n4. **Add review mechanisms:** Implement human review points, feedback collection, error handling flows\n5. **Integrate evaluation framework:** Implement metric calculations, test dataset loading, automated tests\n6. **Polish and deliver:** Handle edge cases, optimize performance, write documentation, deploy to preview environment';
  lines.push(`## ${igTitle}\n\n${igContent}\n`);

  // "Continue with AI" section
  const contTitle = lang === 'zh' ? '继续使用 AI' : 'Continue with AI';
  const contContent = lang === 'zh'
    ? '你可以将此文档作为上下文传递给编码智能体，使用以下提示词进行下一步：\n\n- **评审提示词：** 使用 `generateReviewPrompt()` 生成评审提示词\n- **实施提示词：** 使用 `generateImplementationPrompt()` 生成实施提示词'
    : 'You can pass this document as context to a coding agent using the following prompts:\n\n- **Review Prompt:** Use `generateReviewPrompt()` to generate a review prompt\n- **Implementation Prompt:** Use `generateImplementationPrompt()` to generate an implementation prompt';
  lines.push(`## ${contTitle}\n\n${contContent}\n`);

  return lines.join('\n');
};

export function generateReviewPrompt(project: WorkbenchProject, lang: Lang): string {
  const handoff = generateCodingAgentHandoff(project, lang);

  const intro = lang === 'zh'
    ? '请评审此 AI 产品概念，识别以下问题：\n\n1. 需要验证的不明确假设\n2. 缺失的业务和用户上下文\n3. 各部分之间的矛盾\n4. 该工作流是否真的需要 Agent\n5. 薄弱的工作流边界\n6. 缺失的人工审核节点\n7. 无效或虚荣指标（不衡量真实价值的指标）\n8. 原型范围风险\n9. 尚未考虑的生产风险\n10. 实施前需要解决的五个最重要问题\n\n在解释差距之前，不要重新设计整个产品。\n请明确区分事实、假设、推测和建议。'
    : 'Review this AI product concept and identify:\n\n1. Unclear assumptions that need validation\n2. Missing business and user context\n3. Contradictions between sections\n4. Whether an agent is actually necessary for this workflow\n5. Weak workflow boundaries\n6. Missing human review points\n7. Weak or vanity metrics that don\'t measure real value\n8. Prototype scope risks\n9. Production risks not yet addressed\n10. The five most important questions to resolve before implementation\n\nDo not redesign the entire product before explaining the gaps.\nClearly distinguish facts, assumptions, hypotheses, and recommendations.';

  return `${intro}\n\n---\n\n${handoff}`;
}

export function generateImplementationPrompt(project: WorkbenchProject, lang: Lang): string {
  const handoff = generateCodingAgentHandoff(project, lang);

  const intro = lang === 'zh'
    ? '基于此 AI 产品概念，规划实施方案：\n\n1. 提出 2-3 个可行的实施方案及其权衡，再推荐其中一个\n2. 不要假设产品上下文未支持的基础设施、框架或模型选择\n3. 识别应阻止实施的未解决产品问题\n4. 定义架构选项\n5. 映射数据和知识流\n6. 指定 AI 能力实现细节\n7. 列出所需的集成\n8. 概述前端工作流\n9. 设计评估策略\n10. 提出测试策略\n11. 建议分阶段实施计划\n12. 识别风险\n13. 为每个阶段定义验收标准\n14. 列出需要解决的未知事项\n\n使用相对工作量估计（如"小"、"中"、"大"、"取决于 X"），除非有足够的上下文来给出具体估计。'
    : 'Based on this AI product concept, plan the implementation:\n\n1. Propose 2–3 viable implementation approaches with trade-offs before recommending one\n2. Do not assume infrastructure, framework, or model choices not supported by the product context\n3. Identify unresolved product questions that should block implementation\n4. Define architecture options\n5. Map data and knowledge flows\n6. Specify AI capability implementation details\n7. List required integrations\n8. Outline frontend workflow\n9. Design evaluation strategy\n10. Propose test strategy\n11. Suggest phased implementation plan\n12. Identify risks\n13. Define acceptance criteria for each phase\n14. List unknowns that need resolution\n\nUse relative effort estimates (e.g., "small", "medium", "large", "depends on X") unless enough context exists for specific estimates.';

  return `${intro}\n\n---\n\n${handoff}`;
}
