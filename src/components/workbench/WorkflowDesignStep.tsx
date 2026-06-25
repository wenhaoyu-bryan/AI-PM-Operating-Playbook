import { useCallback, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { t } from '@/data/translations';
import type { WorkbenchProject, IntelligenceFields, Lang } from '@/lib/workbench/schema';

interface WorkflowDesignStepProps {
  project: WorkbenchProject;
  updateSection: (section: string, fields: Record<string, string>) => void;
  lang: Lang;
}

/* ------------------------------------------------------------------ */
/*  Helper: parse workflow steps text into clean lines                 */
/* ------------------------------------------------------------------ */
function parseWorkflowSteps(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.replace(/^\s*[\d]+[\.\)]\s*/, '').replace(/^\s*[-*]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

/* ------------------------------------------------------------------ */
/*  Agent Suitability callout                                          */
/* ------------------------------------------------------------------ */
function AgentSuitabilityCallout({
  lang,
  onSelect,
}: {
  lang: Lang;
  onSelect: (value: 'yes' | 'no') => void;
}) {
  return (
    <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
      <p className="text-sm font-medium text-foreground m-0">
        {t('workbench.stepTitles.design.agentSuitability', lang) || 'Do you need an agent?'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Agent may be appropriate */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-emerald-400 m-0">
            {t('workbench.stepTitles.design.agentMayBeAppropriate', lang)}
          </p>
          <ul className="space-y-1 list-disc pl-4 text-xs text-muted-foreground m-0">
            <li>{t('workbench.stepTitles.design.agentAppropriate1', lang)}</li>
            <li>{t('workbench.stepTitles.design.agentAppropriate2', lang)}</li>
            <li>{t('workbench.stepTitles.design.agentAppropriate3', lang)}</li>
            <li>{t('workbench.stepTitles.design.agentAppropriate4', lang)}</li>
          </ul>
        </div>

        {/* Agent may not be needed */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-amber-400 m-0">
            {t('workbench.stepTitles.design.agentMayNotBeNeeded', lang)}
          </p>
          <ul className="space-y-1 list-disc pl-4 text-xs text-muted-foreground m-0">
            <li>{t('workbench.stepTitles.design.agentNotNeeded1', lang)}</li>
            <li>{t('workbench.stepTitles.design.agentNotNeeded2', lang)}</li>
            <li>{t('workbench.stepTitles.design.agentNotNeeded3', lang)}</li>
            <li>{t('workbench.stepTitles.design.agentNotNeeded4', lang)}</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={() => onSelect('yes')}>
          {t('workbench.stepTitles.design.agentYesButton', lang)}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onSelect('no')}>
          {t('workbench.stepTitles.design.agentNoButton', lang)}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Agent choice badge with "Change" link                              */
/* ------------------------------------------------------------------ */
function AgentChoiceBadge({
  value,
  lang,
  onChange,
}: {
  value: 'yes' | 'no';
  lang: Lang;
  onChange: () => void;
}) {
  const label =
    value === 'yes'
      ? t('workbench.stepTitles.design.agentYesLabel', lang)
      : t('workbench.stepTitles.design.agentNoLabel', lang);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="text-xs">
        {label}
      </Badge>
      <button
        type="button"
        onClick={onChange}
        className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
      >
        {t('workbench.stepTitles.design.change', lang)}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Workflow Preview                                                   */
/* ------------------------------------------------------------------ */
function WorkflowPreview({
  steps,
  lang,
}: {
  steps: string[];
  lang: Lang;
}) {
  if (steps.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t('workbench.stepTitles.design.workflowPreview', lang)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-0">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-full max-w-md">
              {/* Step row */}
              <div className="flex items-center gap-3 w-full rounded-lg bg-secondary p-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-foreground">{step}</span>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <ChevronDown className="size-4 text-muted-foreground my-1 mx-auto" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Field descriptor                                                   */
/* ------------------------------------------------------------------ */
interface FieldDef {
  key: keyof IntelligenceFields;
  labelKey: string;
  hintKey: string;
  type: 'textarea' | 'select';
  rows?: number;
}

const AI_FIELDS: FieldDef[] = [
  { key: 'aiCapability', labelKey: 'workbench.stepTitles.design.aiCapability', hintKey: 'workbench.stepTitles.design.aiCapabilityHint', type: 'textarea', rows: 3 },
  { key: 'agentRequired', labelKey: 'workbench.stepTitles.design.agentRequired', hintKey: 'workbench.stepTitles.design.agentRequiredHint', type: 'select' },
  { key: 'agentReasoning', labelKey: 'workbench.stepTitles.design.agentReasoning', hintKey: 'workbench.stepTitles.design.agentReasoningHint', type: 'textarea', rows: 3 },
  { key: 'tools', labelKey: 'workbench.stepTitles.design.tools', hintKey: 'workbench.stepTitles.design.toolsHint', type: 'textarea', rows: 3 },
  { key: 'workflowSteps', labelKey: 'workbench.stepTitles.design.workflowSteps', hintKey: 'workbench.stepTitles.design.workflowStepsHint', type: 'textarea', rows: 8 },
  { key: 'autonomyBoundary', labelKey: 'workbench.stepTitles.design.autonomyBoundary', hintKey: 'workbench.stepTitles.design.autonomyBoundaryHint', type: 'textarea', rows: 3 },
  { key: 'humanReview', labelKey: 'workbench.stepTitles.design.humanReview', hintKey: 'workbench.stepTitles.design.humanReviewHint', type: 'textarea', rows: 3 },
  { key: 'failureHandling', labelKey: 'workbench.stepTitles.design.failureHandling', hintKey: 'workbench.stepTitles.design.failureHandlingHint', type: 'textarea', rows: 3 },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function WorkflowDesignStep({
  project,
  updateSection,
  lang,
}: WorkflowDesignStepProps) {
  const intelligence = project.intelligence;

  const handleChange = useCallback(
    (key: keyof IntelligenceFields, value: string) => {
      updateSection('intelligence', { [key]: value } as Record<string, string>);
    },
    [updateSection],
  );

  const handleAgentSelect = useCallback(
    (value: 'yes' | 'no') => {
      updateSection('intelligence', { agentRequired: value } as Record<string, string>);
    },
    [updateSection],
  );

  const handleAgentReset = useCallback(() => {
    updateSection('intelligence', { agentRequired: '' } as Record<string, string>);
  }, [updateSection]);

  const workflowSteps = useMemo(
    () => parseWorkflowSteps(intelligence.workflowSteps),
    [intelligence.workflowSteps],
  );

  return (
    <div className="space-y-6">
      {/* ── Section 1: AI / Agent Workflow ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: 'var(--group-ai)' }}
            />
            <CardTitle className="text-base">
              {t('workbench.stepTitles.design.aiWorkflowSection', lang)}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {AI_FIELDS.map((field) => {
              const label = t(field.labelKey, lang);
              const hint = t(field.hintKey, lang);
              const value = intelligence[field.key];

              // agentRequired: special rendering
              if (field.key === 'agentRequired') {
                return (
                  <div key={field.key} className="space-y-1.5 md:col-span-1">
                    <label className="text-sm font-medium text-foreground">
                      {label}
                    </label>
                    <p className="text-xs text-muted-foreground m-0">{hint}</p>
                    {intelligence.agentRequired ? (
                      <AgentChoiceBadge
                        value={intelligence.agentRequired}
                        lang={lang}
                        onChange={handleAgentReset}
                      />
                    ) : (
                      <select
                        value={intelligence.agentRequired}
                        onChange={(e) =>
                          handleChange('agentRequired', e.target.value)
                        }
                        className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                      >
                        <option value="">
                          {t('workbench.stepTitles.design.selectPlaceholder', lang)}
                        </option>
                        <option value="yes">
                          {t('workbench.stepTitles.design.agentYesLabel', lang)}
                        </option>
                        <option value="no">
                          {t('workbench.stepTitles.design.agentNoLabel', lang)}
                        </option>
                      </select>
                    )}
                  </div>
                );
              }

              // Default textarea fields
              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {label}
                  </label>
                  <p className="text-xs text-muted-foreground m-0">{hint}</p>
                  <Textarea
                    value={value as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={hint}
                    rows={field.rows ?? 3}
                    className="resize-y"
                  />
                </div>
              );
            })}
          </div>

          {/* Agent suitability callout — only when agentRequired is empty */}
          {!intelligence.agentRequired && (
            <div className="mt-6">
              <AgentSuitabilityCallout lang={lang} onSelect={handleAgentSelect} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Section 2: Workflow Preview ── */}
      <WorkflowPreview steps={workflowSteps} lang={lang} />
    </div>
  );
}
