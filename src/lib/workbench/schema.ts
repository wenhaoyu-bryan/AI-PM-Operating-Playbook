export type ProductType = 'agent' | 'rag' | 'content-generation' | 'classification' | 'ontology-knowledge' | 'workflow-automation' | 'other';

export type Lang = 'en' | 'zh';

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
  agentRequired: 'yes' | 'no' | '';
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
