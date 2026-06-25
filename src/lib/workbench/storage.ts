import type { WorkbenchProject, WorkbenchProjectFile } from './schema';

export const STORAGE_KEY = 'ai-pm-workbench-project-v1';

const CURRENT_SCHEMA_VERSION = 1;

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
    if (obj.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      return { success: false, error: `Unsupported schema version: ${String(obj.schemaVersion)}. Expected version ${CURRENT_SCHEMA_VERSION}.` };
    }
    if (isValidProject(obj.project)) {
      return { success: true, project: obj.project as WorkbenchProject, source: 'current' };
    }
    return { success: false, error: 'Project structure is invalid or missing required sections.' };
  }

  // Try legacy format: raw WorkbenchProject
  if (isValidProject(parsed)) {
    return { success: true, project: parsed as WorkbenchProject, source: 'legacy' };
  }

  return { success: false, error: 'File does not contain a recognized project format.' };
}
