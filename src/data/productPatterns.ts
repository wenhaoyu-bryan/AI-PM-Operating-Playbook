import type { ProductType, Lang } from '../lib/workbench/schema';

export interface ProductPattern {
  suitableFor: Record<Lang, string[]>;
  avoidWhen: Record<Lang, string[]>;
  coreInputs: Record<Lang, string[]>;
  keyEvaluations: Record<Lang, string[]>;
}

export const PRODUCT_PATTERNS: Record<ProductType, ProductPattern> = {
  agent: {
    suitableFor: {
      en: [
        'Multi-step adaptive workflows',
        'Tool-use scenarios with changing context',
        'Plans that depend on intermediate evidence',
      ],
      zh: [
        '多步骤自适应工作流',
        '上下文变化的工具调用场景',
        '依赖中间结果的计划执行',
      ],
    },
    avoidWhen: {
      en: [
        'Rules are fully deterministic',
        'A single generation or retrieval step is sufficient',
        'Actions cannot be reviewed or reversed',
      ],
      zh: [
        '规则完全确定性',
        '单次生成或检索即可满足需求',
        '操作不可审核或回滚',
      ],
    },
    coreInputs: {
      en: [
        'Goal',
        'Tools',
        'State',
        'Permissions',
        'Boundaries',
        'Human-review rules',
      ],
      zh: [
        '目标',
        '工具',
        '状态',
        '权限',
        '边界',
        '人工审核规则',
      ],
    },
    keyEvaluations: {
      en: [
        'Task completion rate',
        'Tool-call accuracy',
        'Escalation rate',
        'Recovery from failure',
        'Action correctness',
      ],
      zh: [
        '任务完成率',
        '工具调用准确率',
        '升级率',
        '故障恢复能力',
        '操作正确性',
      ],
    },
  },

  rag: {
    suitableFor: {
      en: [
        'Controlled knowledge access',
        'Grounded Q&A over trusted sources',
        'Evidence-backed recommendations',
      ],
      zh: [
        '受控知识访问',
        '基于可信来源的问答',
        '有证据支撑的推荐',
      ],
    },
    avoidWhen: {
      en: [
        'Task mainly requires action execution',
        'Trusted knowledge sources do not exist',
        'Access permissions cannot be enforced',
      ],
      zh: [
        '任务主要需要执行操作',
        '不存在可信知识来源',
        '无法实施访问权限控制',
      ],
    },
    coreInputs: {
      en: [
        'Document sources',
        'Metadata',
        'Freshness',
        'Access permissions',
        'Retrieval strategy',
      ],
      zh: [
        '文档来源',
        '元数据',
        '时效性',
        '访问权限',
        '检索策略',
      ],
    },
    keyEvaluations: {
      en: [
        'Retrieval relevance',
        'Groundedness',
        'Citation accuracy',
        'Unsupported-claim rate',
        'Latency',
      ],
      zh: [
        '检索相关性',
        '可溯源性',
        '引用准确率',
        '无依据声明率',
        '延迟',
      ],
    },
  },

  classification: {
    suitableFor: {
      en: [
        'Defined categories with clear boundaries',
        'Routing, prioritization, moderation, triage',
      ],
      zh: [
        '边界明确的定义类目',
        '路由、优先级排序、内容审核、分流',
      ],
    },
    avoidWhen: {
      en: [
        'Categories are unstable or evolving',
        'Examples overlap heavily across labels',
        'Output requires open-ended generation',
      ],
      zh: [
        '类目不稳定或持续变化',
        '样本在标签间高度重叠',
        '输出需要开放式生成',
      ],
    },
    coreInputs: {
      en: [
        'Label taxonomy',
        'Examples',
        'Annotation guidance',
        'Confidence threshold',
      ],
      zh: [
        '标签分类体系',
        '示例数据',
        '标注指南',
        '置信度阈值',
      ],
    },
    keyEvaluations: {
      en: [
        'Precision',
        'Recall',
        'F1 score',
        'Calibration',
        'Low-confidence coverage',
        'Human override rate',
      ],
      zh: [
        '精确率',
        '召回率',
        'F1 分数',
        '校准度',
        '低置信度覆盖率',
        '人工覆盖率',
      ],
    },
  },

  'content-generation': {
    suitableFor: {
      en: [
        'Drafting, summarization, rewriting',
        'Structured content generation',
      ],
      zh: [
        '草稿撰写、摘要、改写',
        '结构化内容生成',
      ],
    },
    avoidWhen: {
      en: [
        'Exact facts cannot be verified',
        'Outputs create high-impact decisions without review',
      ],
      zh: [
        '无法验证确切事实',
        '输出在未经审核的情况下产生高影响决策',
      ],
    },
    coreInputs: {
      en: [
        'Instructions',
        'Examples',
        'Tone rules',
        'Factual sources',
        'Output schema',
      ],
      zh: [
        '指令',
        '示例',
        '语气规则',
        '事实来源',
        '输出格式',
      ],
    },
    keyEvaluations: {
      en: [
        'Factuality',
        'Instruction adherence',
        'Tone consistency',
        'Human edit rate',
        'Safety',
      ],
      zh: [
        '事实准确性',
        '指令遵循度',
        '语气一致性',
        '人工编辑率',
        '安全性',
      ],
    },
  },

  'ontology-knowledge': {
    suitableFor: {
      en: [
        'Structured business semantics',
        'Reusable object and relationship models',
        'Knowledge graphs and shared enterprise vocabulary',
      ],
      zh: [
        '结构化业务语义',
        '可复用的对象与关系模型',
        '知识图谱与企业共享词汇表',
      ],
    },
    avoidWhen: {
      en: [
        'A simple document index is sufficient',
        'No domain-expert review is available',
      ],
      zh: [
        '简单文档索引即可满足需求',
        '无法获得领域专家审核',
      ],
    },
    coreInputs: {
      en: [
        'Objects',
        'Attributes',
        'Relationships',
        'Constraints',
        'Source terminology',
        'Expert review',
      ],
      zh: [
        '对象',
        '属性',
        '关系',
        '约束',
        '来源术语',
        '专家审核',
      ],
    },
    keyEvaluations: {
      en: [
        'Object coverage',
        'Relationship validity',
        'Consistency',
        'Duplicate rate',
        'Expert acceptance',
      ],
      zh: [
        '对象覆盖率',
        '关系有效性',
        '一致性',
        '重复率',
        '专家认可度',
      ],
    },
  },

  'workflow-automation': {
    suitableFor: {
      en: [
        'Predictable multi-system processes',
        'Rule-based routing and deterministic approvals',
        'Repeatable operations',
      ],
      zh: [
        '可预测的多系统流程',
        '基于规则的路由和确定性审批',
        '可重复的运营操作',
      ],
    },
    avoidWhen: {
      en: [
        'Workflow changes frequently',
        'Required decisions are ambiguous',
        'Exceptions dominate normal cases',
      ],
      zh: [
        '工作流频繁变更',
        '所需决策具有模糊性',
        '异常情况多于正常流程',
      ],
    },
    coreInputs: {
      en: [
        'Rules',
        'Triggers',
        'Integrations',
        'Exceptions',
        'Audit requirements',
        'Rollback logic',
      ],
      zh: [
        '规则',
        '触发条件',
        '集成接口',
        '异常处理',
        '审计要求',
        '回滚逻辑',
      ],
    },
    keyEvaluations: {
      en: [
        'Completion rate',
        'Exception rate',
        'Integration success',
        'Manual intervention rate',
        'Rollback success',
      ],
      zh: [
        '完成率',
        '异常率',
        '集成成功率',
        '人工干预率',
        '回滚成功率',
      ],
    },
  },

  other: {
    suitableFor: {
      en: [
        'Clearly defined user decision',
        'Clear justification for why AI is needed',
      ],
      zh: [
        '明确的用户决策目标',
        '清晰的 AI 必要性论证',
      ],
    },
    avoidWhen: {
      en: [
        'Not clearly scoped',
      ],
      zh: [
        '范围不清晰',
      ],
    },
    coreInputs: {
      en: [
        'User decision',
        'AI justification',
        'Evaluation plan',
        'Non-goals',
        'Failure handling',
      ],
      zh: [
        '用户决策',
        'AI 必要性论证',
        '评估计划',
        '非目标',
        '失败处理',
      ],
    },
    keyEvaluations: {
      en: [
        'Core task success rate',
        'Output quality',
        'User satisfaction',
        'Latency',
        'Cost',
      ],
      zh: [
        '核心任务成功率',
        '输出质量',
        '用户满意度',
        '延迟',
        '成本',
      ],
    },
  },
};
