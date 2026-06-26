import type { WorkbenchProject, WorkbenchProjectFile, ProductType, AgentDecision } from './schema';

export const STORAGE_KEY = 'ai-pm-operating-playbook-project-v1';

const CURRENT_SCHEMA_VERSION = 2;

const VALID_PRODUCT_TYPES: ReadonlySet<string> = new Set<ProductType>([
  'agent', 'rag', 'content-generation', 'classification', 'ontology-knowledge', 'workflow-automation', 'other',
]);

const VALID_AGENT_DECISIONS: ReadonlySet<string> = new Set<AgentDecision>(['yes', 'no', 'unsure', '']);

function isValidProjectShape(data: unknown): data is WorkbenchProject {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.metadata === 'object' &&
    typeof obj.framing === 'object' &&
    typeof obj.knowledge === 'object' &&
    typeof obj.intelligence === 'object' &&
    typeof obj.delivery === 'object'
  );
}

export function loadProject(): WorkbenchProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidProjectShape(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProject(project: WorkbenchProject): boolean {
  try {
    const toSave: WorkbenchProject = {
      ...project,
      metadata: {
        ...project.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch {
    return false;
  }
}

export function clearProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}

export function createEmptyProject(): WorkbenchProject {
  const now = new Date().toISOString();
  return {
    metadata: {
      projectName: '',
      oneLineIdea: '',
      productType: '',
      createdAt: now,
      updatedAt: now,
    },
    framing: {
      businessScenario: '',
      targetUser: '',
      currentWorkflow: '',
      decisionToSupport: '',
      problemEvidence: '',
      expectedOutcome: '',
    },
    knowledge: {
      dataSources: '',
      knowledgeSources: '',
      coreObjects: '',
      keyRelationships: '',
      assumptions: '',
    },
    intelligence: {
      aiCapability: '',
      agentRequired: '',
      agentReasoning: '',
      tools: '',
      workflowSteps: '',
      autonomyBoundary: '',
      humanReview: '',
      failureHandling: '',
    },
    delivery: {
      prototypeScope: '',
      nonGoals: '',
      evaluationMetrics: '',
      evaluationScenarios: '',
      acceptanceCriteria: '',
      productionRisks: '',
      dependencies: '',
      openQuestions: '',
    },
  };
}

export function exportProjectFile(project: WorkbenchProject): WorkbenchProjectFile {
  return { schemaVersion: CURRENT_SCHEMA_VERSION, project };
}

function isValidProject(data: unknown): data is WorkbenchProject {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.metadata === 'object' &&
    typeof obj.framing === 'object' &&
    typeof obj.knowledge === 'object' &&
    typeof obj.intelligence === 'object' &&
    typeof obj.delivery === 'object'
  );
}

function sanitizeStringFields(section: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(section)) {
    result[key] = typeof val === 'string' ? val : '';
  }
  return result;
}

function sanitizeProject(data: WorkbenchProject): WorkbenchProject {
  const metadata = sanitizeStringFields(data.metadata as unknown as Record<string, unknown>) as unknown as WorkbenchProject['metadata'];
  const framing = sanitizeStringFields(data.framing as unknown as Record<string, unknown>) as unknown as WorkbenchProject['framing'];
  const knowledge = sanitizeStringFields(data.knowledge as unknown as Record<string, unknown>) as unknown as WorkbenchProject['knowledge'];
  const intelligence = sanitizeStringFields(data.intelligence as unknown as Record<string, unknown>) as unknown as WorkbenchProject['intelligence'];
  const delivery = sanitizeStringFields(data.delivery as unknown as Record<string, unknown>) as unknown as WorkbenchProject['delivery'];

  // Validate productType
  if (!VALID_PRODUCT_TYPES.has(metadata.productType)) {
    metadata.productType = '';
  }

  // Validate agentRequired
  if (!VALID_AGENT_DECISIONS.has(intelligence.agentRequired)) {
    intelligence.agentRequired = '';
  }

  // Backward compat: v1 JSON without evaluationScenarios gets the field added
  if (!('evaluationScenarios' in delivery)) {
    (delivery as Record<string, unknown>).evaluationScenarios = '';
  }

  return { metadata, framing, knowledge, intelligence, delivery };
}

export type ImportResult =
  | { success: true; project: WorkbenchProject; source: 'current' | 'legacy' }
  | { success: false; error: string };

export function parseImportedJSON(jsonString: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { success: false, error: 'Invalid JSON format.' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { success: false, error: 'File does not contain a valid project.' };
  }

  // Try current format: { schemaVersion, project }
  const obj = parsed as Record<string, unknown>;
  if ('schemaVersion' in obj && 'project' in obj) {
    if (obj.schemaVersion !== 1 && obj.schemaVersion !== 2) {
      return { success: false, error: `Unsupported schema version: ${String(obj.schemaVersion)}. Expected version 1 or 2.` };
    }
    if (isValidProject(obj.project)) {
      return { success: true, project: sanitizeProject(obj.project), source: 'current' };
    }
    return { success: false, error: 'Project structure is invalid or missing required sections.' };
  }

  // Try legacy format: raw WorkbenchProject
  if (isValidProject(parsed)) {
    return { success: true, project: sanitizeProject(parsed), source: 'legacy' };
  }

  return { success: false, error: 'File does not contain a recognized project format.' };
}
