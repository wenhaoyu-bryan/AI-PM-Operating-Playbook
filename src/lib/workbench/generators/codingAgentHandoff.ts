import type { DocumentGenerator, Lang } from '../schema';

const notFilled = (lang: Lang) => (lang === 'zh' ? '_未填写_' : '_Not filled_');

export const generateCodingAgentHandoff: DocumentGenerator = (project, lang) => {
  const { metadata, framing, knowledge, intelligence, delivery } = project;
  const title = lang === 'zh' ? `# 编程代理交付文档` : `# Coding Agent Handoff`;

  const lines: string[] = [title, ''];

  // Project Goal
  const pgTitle = lang === 'zh' ? '项目目标' : 'Project Goal';
  lines.push(`## ${pgTitle}\n\n${metadata.oneLineIdea || notFilled(lang)}\n`);

  // Product Context
  const pcTitle = lang === 'zh' ? '产品上下文' : 'Product Context';
  const pcContent = lang === 'zh'
    ? `**项目名称：** ${metadata.projectName || '未命名'}\n**产品类型：** ${metadata.productType || '未指定'}\n**业务场景：** ${framing.businessScenario || notFilled(lang)}`
    : `**Project Name:** ${metadata.projectName || 'Untitled'}\n**Product Type:** ${metadata.productType || 'Not specified'}\n**Business Scenario:** ${framing.businessScenario || notFilled(lang)}`;
  lines.push(`## ${pcTitle}\n\n${pcContent}\n`);

  // Target User
  const tuTitle = lang === 'zh' ? '目标用户' : 'Target User';
  lines.push(`## ${tuTitle}\n\n${framing.targetUser || notFilled(lang)}\n`);

  // Core User Flow
  const cufTitle = lang === 'zh' ? '核心用户流程' : 'Core User Flow';
  const cufContent = lang === 'zh'
    ? `**现有流程：**\n\n${framing.currentWorkflow || notFilled(lang)}\n\n**预期成果：**\n\n${framing.expectedOutcome || notFilled(lang)}`
    : `**Current Workflow:**\n\n${framing.currentWorkflow || notFilled(lang)}\n\n**Expected Outcome:**\n\n${framing.expectedOutcome || notFilled(lang)}`;
  lines.push(`## ${cufTitle}\n\n${cufContent}\n`);

  // Required AI Capability
  const racTitle = lang === 'zh' ? '所需 AI 能力' : 'Required AI Capability';
  const racContent = lang === 'zh'
    ? `${intelligence.aiCapability || notFilled(lang)}\n\n**是否需要 Agent：** ${intelligence.agentRequired === 'yes' ? '是' : intelligence.agentRequired === 'no' ? '否' : '未确定'}\n\n${intelligence.agentReasoning ? `**选择理由：** ${intelligence.agentReasoning}` : ''}`
    : `${intelligence.aiCapability || notFilled(lang)}\n\n**Agent Required:** ${intelligence.agentRequired === 'yes' ? 'Yes' : intelligence.agentRequired === 'no' ? 'No' : 'TBD'}\n\n${intelligence.agentReasoning ? `**Reasoning:** ${intelligence.agentReasoning}` : ''}`;
  lines.push(`## ${racTitle}\n\n${racContent}\n`);

  // Data and Knowledge Context
  const dkcTitle = lang === 'zh' ? '数据与知识上下文' : 'Data and Knowledge Context';
  const dkcContent = lang === 'zh'
    ? `### 数据来源\n\n${knowledge.dataSources || notFilled(lang)}\n\n### 知识来源\n\n${knowledge.knowledgeSources || notFilled(lang)}\n\n### 核心对象\n\n${knowledge.coreObjects || notFilled(lang)}\n\n### 关键关系\n\n${knowledge.keyRelationships || notFilled(lang)}`
    : `### Data Sources\n\n${knowledge.dataSources || notFilled(lang)}\n\n### Knowledge Sources\n\n${knowledge.knowledgeSources || notFilled(lang)}\n\n### Core Objects\n\n${knowledge.coreObjects || notFilled(lang)}\n\n### Key Relationships\n\n${knowledge.keyRelationships || notFilled(lang)}`;
  lines.push(`## ${dkcTitle}\n\n${dkcContent}\n`);

  // Scope
  const sTitle = lang === 'zh' ? '范围' : 'Scope';
  lines.push(`## ${sTitle}\n\n${delivery.prototypeScope || notFilled(lang)}\n`);

  // Non-goals
  const ngTitle = lang === 'zh' ? '非目标' : 'Non-Goals';
  lines.push(`## ${ngTitle}\n\n${delivery.nonGoals || notFilled(lang)}\n`);

  // Workflow Requirements
  const wrTitle = lang === 'zh' ? '工作流要求' : 'Workflow Requirements';
  const wrContent = lang === 'zh'
    ? `**工作流步骤：**\n\n${intelligence.workflowSteps || notFilled(lang)}\n\n**可用工具：**\n\n${intelligence.tools || notFilled(lang)}`
    : `**Workflow Steps:**\n\n${intelligence.workflowSteps || notFilled(lang)}\n\n**Available Tools:**\n\n${intelligence.tools || notFilled(lang)}`;
  lines.push(`## ${wrTitle}\n\n${wrContent}\n`);

  // Human Review Requirements
  const hrrTitle = lang === 'zh' ? '人工审核要求' : 'Human Review Requirements';
  const hrrContent = lang === 'zh'
    ? `**审核点：**\n\n${intelligence.humanReview || notFilled(lang)}\n\n**自主性边界：**\n\n${intelligence.autonomyBoundary || notFilled(lang)}`
    : `**Review Points:**\n\n${intelligence.humanReview || notFilled(lang)}\n\n**Autonomy Boundary:**\n\n${intelligence.autonomyBoundary || notFilled(lang)}`;
  lines.push(`## ${hrrTitle}\n\n${hrrContent}\n`);

  // Evaluation Requirements
  const erTitle = lang === 'zh' ? '评估要求' : 'Evaluation Requirements';
  lines.push(`## ${erTitle}\n\n${delivery.evaluationMetrics || notFilled(lang)}\n`);

  // Acceptance Criteria
  const acTitle = lang === 'zh' ? '验收标准' : 'Acceptance Criteria';
  lines.push(`## ${acTitle}\n\n${delivery.acceptanceCriteria || notFilled(lang)}\n`);

  // Product Constraints
  const pc2Title = lang === 'zh' ? '产品约束' : 'Product Constraints';
  const pc2Content = lang === 'zh'
    ? `${knowledge.assumptions ? `**假设前提：**\n\n${knowledge.assumptions}` : ''}\n\n${delivery.dependencies ? `**依赖项：**\n\n${delivery.dependencies}` : ''}`
    : `${knowledge.assumptions ? `**Assumptions:**\n\n${knowledge.assumptions}` : ''}\n\n${delivery.dependencies ? `**Dependencies:**\n\n${delivery.dependencies}` : ''}`;
  lines.push(`## ${pc2Title}\n\n${pc2Content}\n`);

  // Known Risks
  const krTitle = lang === 'zh' ? '已知风险' : 'Known Risks';
  lines.push(`## ${krTitle}\n\n${delivery.productionRisks || notFilled(lang)}\n`);

  // Open Questions
  const oqTitle = lang === 'zh' ? '待定问题' : 'Open Questions';
  lines.push(`## ${oqTitle}\n\n${delivery.openQuestions || notFilled(lang)}\n`);

  // Failure Handling
  const fhTitle = lang === 'zh' ? '失败处理' : 'Failure Handling';
  lines.push(`## ${fhTitle}\n\n${intelligence.failureHandling || notFilled(lang)}\n`);

  // Implementation Guidance
  const igTitle = lang === 'zh' ? '实施指南' : 'Implementation Guidance';
  const igContent = lang === 'zh'
    ? '按以下顺序推进实施：\n\n1. **搭建基础框架：** 初始化项目结构、配置 LLM API 客户端、建立数据模型\n2. **实现核心 AI 能力：** 编写 prompt 模板、实现主工作流逻辑、接入所需工具\n3. **构建用户界面：** 实现核心交互流程、表单输入、结果展示\n4. **添加审核机制：** 实现人工审核点、反馈收集、错误处理流程\n5. **集成评估框架：** 实现评估指标计算、测试数据集加载、自动化测试\n6. **打磨与交付：** 处理边界情况、优化性能、编写文档、部署到预览环境'
    : 'Implement in the following order:\n\n1. **Set up foundation:** Initialize project structure, configure LLM API client, establish data models\n2. **Implement core AI capability:** Write prompt templates, implement main workflow logic, integrate required tools\n3. **Build user interface:** Implement core interaction flows, form inputs, result display\n4. **Add review mechanisms:** Implement human review points, feedback collection, error handling flows\n5. **Integrate evaluation framework:** Implement metric calculations, test dataset loading, automated tests\n6. **Polish and deliver:** Handle edge cases, optimize performance, write documentation, deploy to preview environment';
  lines.push(`## ${igTitle}\n\n${igContent}\n`);

  return lines.join('\n');
};
