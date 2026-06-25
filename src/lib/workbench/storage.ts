import type { WorkbenchProject } from './schema';

export const STORAGE_KEY = 'ai-pm-workbench-project-v1';

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

export function saveProject(project: WorkbenchProject): void {
  try {
    const toSave: WorkbenchProject = {
      ...project,
      metadata: {
        ...project.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage may be unavailable; silently fail
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
