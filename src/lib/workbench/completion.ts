import type { WorkbenchProject } from '@/lib/workbench/schema';
import {
  getStepFieldCount,
  getRequiredStepStatus,
  getExportReady,
} from './fields';

export interface StepCompletion {
  status: 'not-started' | 'in-progress' | 'ready';
  filled: number;
  total: number;
}

export function getStepCompletion(project: WorkbenchProject): StepCompletion[] {
  const results: StepCompletion[] = [];

  for (let step = 0; step < 3; step++) {
    const { filled, total } = getStepFieldCount(project, step as 0 | 1 | 2);
    const status = getRequiredStepStatus(project, step as 0 | 1 | 2);
    results.push({ status, filled, total });
  }

  // Export step
  const exportReady = getExportReady(project);
  results.push({
    status: exportReady ? 'ready' : 'not-started',
    filled: 0,
    total: 0,
  });

  return results;
}
