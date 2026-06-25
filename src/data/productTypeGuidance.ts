import type { ProductType, Lang } from '../lib/workbench/schema';

export const PRODUCT_TYPE_GUIDANCE: Record<ProductType, Record<Lang, string>> = {
  agent: {
    en: 'Agents require multi-step reasoning, tool orchestration, and clear autonomy boundaries. Define the decision loop, tool permissions, and human escalation triggers before prototyping.',
    zh: '智能体需要多步推理、工具编排和明确的自主性边界。在原型开发前，需定义决策循环、工具权限和人工介入触发条件。',
  },
  rag: {
    en: 'RAG products ground AI output in trusted knowledge sources. Focus on retrieval quality, chunk strategy, citation accuracy, and graceful handling when no relevant documents exist.',
    zh: 'RAG 产品将 AI 输出锚定在可信知识源上。需重点关注检索质量、分块策略、引用准确性，以及无法找到相关文档时的优雅降级。',
  },
  'content-generation': {
    en: 'Content generation systems create or adapt text, visuals, or structured output. Prioritize factuality checks, tone control, brand consistency, and human review workflows for high-stakes content.',
    zh: '内容生成系统创建或改编文本、视觉或结构化输出。需优先考虑事实核查、语气控制、品牌一致性，以及高风险内容的人工审核流程。',
  },
  classification: {
    en: 'Classification models assign deterministic labels. Calibration, confidence thresholds, and clear handling of edge cases are essential. Define label taxonomy before collecting training data.',
    zh: '分类模型分配确定性标签。校准、置信度阈值和边界情况的清晰处理至关重要。在收集训练数据前需先定义标签体系。',
  },
  'ontology-knowledge': {
    en: 'Ontology products structure entities, relationships, and schemas from domain knowledge. The schema design drives everything — get domain expert validation early and iterate on the relationship model.',
    zh: '本体产品从领域知识中提取实体、关系和模式。模式设计决定一切——尽早获取领域专家验证，并迭代关系模型。',
  },
  'workflow-automation': {
    en: 'Workflow automation is mostly deterministic with targeted AI augmentation. Map the business rules, integration points, and exception handling before adding AI components.',
    zh: '工作流自动化以确定性规则为主，辅以定向 AI 增强。在添加 AI 组件前，先梳理业务规则、集成点和异常处理。',
  },
  other: {
    en: 'Define the core problem clearly, identify what intelligence is needed, and prototype the riskiest assumption first. Keep the scope small and iterate based on real user feedback.',
    zh: '清晰定义核心问题，识别所需智能能力，优先原型验证风险最大的假设。保持小范围迭代，基于真实用户反馈持续改进。',
  },
};
