export type ProductType = 'agent' | 'rag' | 'content-generation' | 'classification' | 'ontology-knowledge' | 'workflow-automation' | 'other';

export type Lang = 'en' | 'zh';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export type AgentDecision = 'yes' | 'no' | 'unsure' | '';

export interface WorkbenchProjectFile {
  schemaVersion: 1;
  project: WorkbenchProject;
}

export interface MetadataFields {
  projectName: string;
  oneLineIdea: string;
  productType: ProductType | '';
  createdAt: string;
  updatedAt: string;
}

export interface FramingFields {
  businessScenario: string;
  targetUser: string;
  currentWorkflow: string;
  decisionToSupport: string;
  problemEvidence: string;
  expectedOutcome: string;
}

export interface KnowledgeFields {
  dataSources: string;
  knowledgeSources: string;
  coreObjects: string;
  keyRelationships: string;
  assumptions: string;
}

export interface IntelligenceFields {
  aiCapability: string;
  agentRequired: 'yes' | 'no' | 'unsure' | '';
  agentReasoning: string;
  tools: string;
  workflowSteps: string;
  autonomyBoundary: string;
  humanReview: string;
  failureHandling: string;
}

export interface DeliveryFields {
  prototypeScope: string;
  nonGoals: string;
  evaluationMetrics: string;
  acceptanceCriteria: string;
  productionRisks: string;
  dependencies: string;
  openQuestions: string;
}

export interface WorkbenchProject {
  metadata: MetadataFields;
  framing: FramingFields;
  knowledge: KnowledgeFields;
  intelligence: IntelligenceFields;
  delivery: DeliveryFields;
}

export type DocumentGenerator = (project: WorkbenchProject, lang: Lang) => string;

export interface FieldDescriptor {
  key: string;
  section: 'framing' | 'knowledge' | 'intelligence' | 'delivery' | 'metadata';
  label: Record<Lang, string>;
  hint: Record<Lang, string>;
  type: 'text' | 'textarea' | 'select';
  rows?: number;
  options?: { value: string; label: Record<Lang, string> }[];
}

const PRODUCT_TYPE_LABELS: Record<ProductType, Record<Lang, string>> = {
  'agent': { en: 'Agent', zh: '智能体' },
  'rag': { en: 'RAG', zh: 'RAG（检索增强生成）' },
  'content-generation': { en: 'Content Generation', zh: '内容生成' },
  'classification': { en: 'Classification', zh: '分类模型' },
  'ontology-knowledge': { en: 'Ontology / Knowledge', zh: '本体/知识图谱' },
  'workflow-automation': { en: 'Workflow Automation', zh: '工作流自动化' },
  'other': { en: 'Other', zh: '其他' },
};

export function getLocalizedProductType(type: ProductType | '', lang: Lang): string {
  if (!type) return lang === 'zh' ? '未选择' : 'Not selected';
  return PRODUCT_TYPE_LABELS[type]?.[lang] ?? type;
}

export function formatProjectDate(isoDate: string, lang: Lang): string {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  if (lang === 'zh') return `${year}年${month}月${day}日`;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getUTCMonth()]} ${day}, ${year}`;
}

export function parseLineItems(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split('\n')
    .map(line => line.replace(/^[\d]+[.)]\s*/, '').replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}
