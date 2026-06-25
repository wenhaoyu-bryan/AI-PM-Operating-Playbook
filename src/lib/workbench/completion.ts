import type { WorkbenchProject } from '@/lib/workbench/schema';

export interface StepCompletion {
  status: 'not-started' | 'in-progress' | 'ready';
  filled: number;
  total: number;
}

// Required fields per step for "ready" status
const STEP_REQUIRED: Record<number, string[]> = {
  // Step 0: Product Framing (metadata + framing required fields)
  0: [
    'metadata.projectName',
    'metadata.oneLineIdea',
    'framing.businessScenario',
    'framing.targetUser',
    'framing.decisionToSupport',
    'framing.expectedOutcome',
  ],
  // Step 1: AI Workflow Design
  1: [
    'intelligence.aiCapability',
    'intelligence.agentRequired',
    'intelligence.workflowSteps',
    'intelligence.autonomyBoundary',
  ],
  // Step 2: Evaluation & Risk
  2: [
    'delivery.prototypeScope',
    'delivery.nonGoals',
    'delivery.evaluationMetrics',
    'delivery.acceptanceCriteria',
    'delivery.productionRisks',
  ],
  // Step 3: Export — never auto-complete
  3: [],
};

// All non-metadata fields for counting filled/total
const STEP_FIELDS: Record<number, string[]> = {
  0: [
    'metadata.projectName',
    'metadata.oneLineIdea',
    'metadata.productType',
    'framing.businessScenario',
    'framing.targetUser',
    'framing.currentWorkflow',
    'framing.decisionToSupport',
    'framing.problemEvidence',
    'framing.expectedOutcome',
    'knowledge.dataSources',
    'knowledge.knowledgeSources',
    'knowledge.coreObjects',
    'knowledge.keyRelationships',
    'knowledge.assumptions',
  ],
  1: [
    'intelligence.aiCapability',
    'intelligence.agentRequired',
    'intelligence.agentReasoning',
    'intelligence.tools',
    'intelligence.workflowSteps',
    'intelligence.autonomyBoundary',
    'intelligence.humanReview',
    'intelligence.failureHandling',
  ],
  2: [
    'delivery.prototypeScope',
    'delivery.nonGoals',
    'delivery.evaluationMetrics',
    'delivery.acceptanceCriteria',
    'delivery.productionRisks',
    'delivery.dependencies',
    'delivery.openQuestions',
  ],
  3: [], // Export has no editable fields
};

function getFieldValue(project: WorkbenchProject, path: string): string {
  const parts = path.split('.');
  const section = project[parts[0] as keyof WorkbenchProject] as Record<string, unknown>;
  if (!section || typeof section !== 'object') return '';
  const val = section[parts[1]];
  return typeof val === 'string' ? val : '';
}

export function getStepCompletion(project: WorkbenchProject): StepCompletion[] {
  const results: StepCompletion[] = [];

  for (let step = 0; step < 4; step++) {
    const fields = STEP_FIELDS[step];
    const required = STEP_REQUIRED[step];

    const filled = fields.filter((f) => getFieldValue(project, f).trim() !== '').length;
    const total = fields.length;

    let status: StepCompletion['status'] = 'not-started';
    if (step === 3) {
      // Export step: only "ready" if steps 0-2 are all ready
      const prevSteps = [0, 1, 2];
      const allPrevReady = prevSteps.every((s) => {
        const req = STEP_REQUIRED[s];
        return req.every((f) => getFieldValue(project, f).trim() !== '');
      });
      status = allPrevReady ? 'ready' : 'not-started';
    } else if (filled === 0) {
      status = 'not-started';
    } else {
      const allRequiredFilled = required.every((f) => getFieldValue(project, f).trim() !== '');
      status = allRequiredFilled ? 'ready' : 'in-progress';
    }

    results.push({ status, filled, total });
  }

  return results;
}
