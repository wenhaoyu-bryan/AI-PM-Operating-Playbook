import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { t } from '@/data/translations';
import { PRODUCT_PATTERNS } from '@/data/productPatterns';
import { EVALUATION_GUIDANCE } from '@/data/evaluationGuidance';
import { runDesignReview, getReviewSummary } from '@/lib/workbench/designReview';
import type { DesignReviewFinding } from '@/lib/workbench/designReview';
import type { WorkbenchProject, DeliveryFields, Lang, ProductType } from '@/lib/workbench/schema';

interface EvaluationStepProps {
  project: WorkbenchProject;
  updateSection: (section: string, fields: Record<string, string>) => void;
  lang: Lang;
  goToStep?: (step: number) => void;
}

/* ------------------------------------------------------------------ */
/*  Chip toggle helpers (line-based matching)                          */
/* ------------------------------------------------------------------ */
function isChipSelected(textareaValue: string, chipText: string): boolean {
  const lines = textareaValue.split('\n').map((l) => l.trim());
  const normalizedChip = chipText.trim();
  return lines.some((line) => line === normalizedChip);
}

function toggleChip(currentValue: string, chipText: string): string {
  const lines = currentValue.split('\n');
  const normalizedChip = chipText.trim();
  const existingIndex = lines.findIndex((line) => line.trim() === normalizedChip);

  if (existingIndex >= 0) {
    // Remove the line
    lines.splice(existingIndex, 1);
    return lines.join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
  } else {
    // Append
    const trimmed = currentValue.trimEnd();
    return trimmed ? `${trimmed}\n${normalizedChip}` : normalizedChip;
  }
}

/* ------------------------------------------------------------------ */
/*  Acceptance criteria insert helper                                  */
/* ------------------------------------------------------------------ */
function insertMissingCriteria(current: string, examples: string[]): string {
  const existingLines = current.split('\n').map((l) => l.trim());
  const missing = examples.filter((ex) => !existingLines.includes(ex.trim()));
  if (missing.length === 0) return current;
  const trimmed = current.trimEnd();
  return trimmed ? `${trimmed}\n${missing.join('\n')}` : missing.join('\n');
}

/* ------------------------------------------------------------------ */
/*  Scenario template helpers                                          */
/* ------------------------------------------------------------------ */
const SCENARIO_TEMPLATE: Record<Lang, string> = {
  en: 'Happy path:\nEdge case:\nFailure case:\nHuman review case:\nMisuse / boundary case:',
  zh: '正常流程场景：\n边界场景：\n失败场景：\n人工审核场景：\n误用或越界场景：',
};

const SCENARIO_CATEGORIES: Record<Lang, string[]> = {
  en: ['Happy path:', 'Edge case:', 'Failure case:', 'Human review case:', 'Misuse / boundary case:'],
  zh: ['正常流程场景：', '边界场景：', '失败场景：', '人工审核场景：', '误用或越界场景：'],
};

function insertScenarioTemplate(current: string, lang: Lang): string {
  if (!current.trim()) return SCENARIO_TEMPLATE[lang];
  // Insert only missing categories
  const categories = SCENARIO_CATEGORIES[lang];
  const missing = categories.filter((cat) => !current.includes(cat));
  if (missing.length === 0) return current;
  const trimmed = current.trimEnd();
  return `${trimmed}\n${missing.join('\n')}`;
}

/* ------------------------------------------------------------------ */
/*  Suggestion chip row                                                */
/* ------------------------------------------------------------------ */
function SuggestionChips({
  items,
  currentValue,
  onToggle,
  lang,
  showAll: controlledShowAll,
}: {
  items: string[];
  currentValue: string;
  onToggle: (text: string) => void;
  lang: Lang;
  showAll?: boolean;
}) {
  const [expanded, setExpanded] = useState(controlledShowAll ?? false);
  const visibleItems = expanded ? items : items.slice(0, 7);
  const hasMore = items.length > 7;

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-1.5">
        {visibleItems.map((item) => {
          const selected = isChipSelected(currentValue, item);
          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(item)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 ${
                selected
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              }`}
            >
              {selected && '✓ '}{item}
            </button>
          );
        })}
      </div>
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1.5 text-xs text-emerald-400 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {lang === 'zh' ? '显示更多' : 'Show more'}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Acceptance criteria examples                                       */
/* ------------------------------------------------------------------ */
const ACCEPTANCE_EXAMPLES: Record<Lang, string[]> = {
  en: [
    'The prototype supports the defined happy path.',
    'Recommendations include supporting evidence.',
    'High-impact actions require explicit human approval.',
    'Failed tool calls are visible and recoverable.',
    'The system does not act outside the defined workflow boundary.',
  ],
  zh: [
    '原型支持已定义的 happy path。',
    '建议包含支撑证据。',
    '高影响操作需要明确的人工批准。',
    '失败的工具调用可见且可恢复。',
    '系统不会在定义的工作流边界之外操作。',
  ],
};

/* ------------------------------------------------------------------ */
/*  Section divider                                                    */
/* ------------------------------------------------------------------ */
function SectionDivider() {
  return <div className="border-t border-border my-4" />;
}

/* ------------------------------------------------------------------ */
/*  Section label                                                      */
/* ------------------------------------------------------------------ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Field label helper                                                 */
/* ------------------------------------------------------------------ */
function FieldLabel({ label, hint }: { label: string; hint: string }) {
  return (
    <>
      <label className="text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground m-0 mt-0.5">{hint}</p>}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Fallback labels                                                    */
/* ------------------------------------------------------------------ */
const FIELD_LABELS: Record<string, Record<Lang, string>> = {
  prototypeScope: { en: 'Prototype scope', zh: '原型范围' },
  nonGoals: { en: 'Non-goals', zh: '非目标' },
  evaluationMetrics: { en: 'Evaluation metrics', zh: '评估指标' },
  evaluationScenarios: { en: 'Evaluation scenarios', zh: '评估场景' },
  acceptanceCriteria: { en: 'Acceptance criteria', zh: '验收标准' },
  productionRisks: { en: 'Production risks', zh: '生产风险' },
  dependencies: { en: 'Dependencies', zh: '依赖项' },
  openQuestions: { en: 'Open questions', zh: '待解决问题' },
};

const FIELD_HINTS: Record<string, Record<Lang, string>> = {
  prototypeScope: { en: 'What is the MVP? What is the first version?', zh: 'MVP 是什么？第一个版本包含什么？' },
  nonGoals: { en: 'What is explicitly out of scope?', zh: '哪些明确不在范围内？' },
  evaluationMetrics: { en: 'How do you measure success?', zh: '如何衡量成功？' },
  evaluationScenarios: { en: 'What concrete scenarios will test the product?', zh: '哪些具体场景将测试产品？' },
  acceptanceCriteria: { en: 'What must be true for this to be accepted?', zh: '满足什么条件才能被接受？' },
  productionRisks: { en: 'What could go wrong in production?', zh: '生产环境中可能出什么问题？' },
  dependencies: { en: 'What external dependencies exist?', zh: '存在哪些外部依赖？' },
  openQuestions: { en: 'What questions remain unanswered?', zh: '还有哪些未解决的问题？' },
};

/* ------------------------------------------------------------------ */
/*  Severity badge                                                     */
/* ------------------------------------------------------------------ */
const SEVERITY_STYLES: Record<string, { bg: string; text: string }> = {
  missing: { bg: 'bg-red-500/20', text: 'text-red-400' },
  warning: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  suggestion: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
};

function SeverityBadge({ severity, lang }: { severity: 'missing' | 'warning' | 'suggestion'; lang: Lang }) {
  const style = SEVERITY_STYLES[severity];
  const labelMap: Record<string, Record<Lang, string>> = {
    missing: { en: 'Missing', zh: '缺失' },
    warning: { en: 'Warning', zh: '警告' },
    suggestion: { en: 'Suggestion', zh: '建议' },
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}
    >
      {labelMap[severity][lang]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Product Pattern Guide Card                                         */
/* ------------------------------------------------------------------ */
function PatternGuideCard({
  productType,
  lang,
}: {
  productType: ProductType | '';
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);

  if (!productType || !(productType in PRODUCT_PATTERNS)) return null;
  const pattern = PRODUCT_PATTERNS[productType as ProductType];

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
            {t('workbench.patterns.title', lang)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
            className="text-xs"
          >
            {open
              ? t('workbench.patterns.hideGuide', lang)
              : t('workbench.patterns.viewGuide', lang)}
          </Button>
        </div>
        {open && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Suitable for */}
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {t('workbench.patterns.suitableFor', lang)}
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {pattern.suitableFor[lang].map((item) => (
                  <li key={item} className="text-xs text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
            {/* Avoid when */}
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {t('workbench.patterns.avoidWhen', lang)}
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {pattern.avoidWhen[lang].map((item) => (
                  <li key={item} className="text-xs text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
            {/* Core inputs */}
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {t('workbench.patterns.coreInputs', lang)}
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {pattern.coreInputs[lang].map((item) => (
                  <li key={item} className="text-xs text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
            {/* Key evaluations */}
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {t('workbench.patterns.keyEvaluations', lang)}
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {pattern.keyEvaluations[lang].map((item) => (
                  <li key={item} className="text-xs text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Design Review Card                                                 */
/* ------------------------------------------------------------------ */
function DesignReviewCard({
  project,
  lang,
  goToStep,
}: {
  project: WorkbenchProject;
  lang: Lang;
  goToStep?: (step: number) => void;
}) {
  const findings = useMemo(() => runDesignReview(project), [project]);
  const summary = useMemo(() => getReviewSummary(findings), [findings]);
  const totalFindings = findings.length;

  const stepLabels: Record<Lang, string[]> = {
    en: ['Product Framing', 'AI Workflow Design', 'Evaluation & Risk'],
    zh: ['产品定义', 'AI 工作流设计', '评估与风险'],
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t('workbench.designReview.title', lang)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('workbench.designReview.subtitle', lang)}
          </p>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {totalFindings === 0 ? (
            <span>{t('workbench.designReview.noFindings', lang)}</span>
          ) : (
            <>
              {summary.missing > 0 && (
                <span className="text-red-400 font-medium">
                  {summary.missing} {t('workbench.designReview.missingCount', lang)}
                </span>
              )}
              {summary.warning > 0 && (
                <span className="text-amber-400 font-medium">
                  {summary.warning} {t('workbench.designReview.warningCount', lang)}
                </span>
              )}
              {summary.suggestion > 0 && (
                <span className="text-blue-400 font-medium">
                  {summary.suggestion} {t('workbench.designReview.suggestionCount', lang)}
                </span>
              )}
              <span>{t('workbench.designReview.itemsToReview', lang)}</span>
            </>
          )}
        </div>

        {/* Findings list */}
        {findings.length > 0 && (
          <div className="space-y-2">
            {findings.map((finding: DesignReviewFinding) => (
              <div
                key={finding.id}
                className="rounded-lg border border-border p-3 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={finding.severity} lang={lang} />
                  <span className="text-sm font-medium text-foreground">
                    {finding.title[lang]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {finding.description[lang]}
                </p>
                {goToStep && (
                  <button
                    type="button"
                    onClick={() => goToStep(finding.step)}
                    className="text-xs text-emerald-400 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    {t('workbench.designReview.goToStep', lang)}: {stepLabels[lang][finding.step]}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No-findings note */}
        {totalFindings === 0 && (
          <p className="text-xs text-muted-foreground">
            {t('workbench.designReview.noFindingsNote', lang)}
          </p>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] text-muted-foreground/70">
          {t('workbench.designReview.disclaimer', lang)}
        </p>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Count non-empty fields across all sections                         */
/* ------------------------------------------------------------------ */
function countCompleted(project: WorkbenchProject): { filled: number; total: number } {
  const sections = [
    Object.values(project.framing),
    Object.values(project.knowledge),
    Object.values(project.intelligence),
    Object.values(project.delivery),
  ];
  const all = sections.flat();
  return {
    filled: all.filter((v) => typeof v === 'string' && v.trim().length > 0).length,
    total: all.length,
  };
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function EvaluationStep({
  project,
  updateSection,
  lang,
  goToStep,
}: EvaluationStepProps) {
  const delivery = project.delivery;
  const productType = project.metadata.productType;

  const handleChange = useCallback(
    (key: keyof DeliveryFields, value: string) => {
      updateSection('delivery', { [key]: value } as Record<string, string>);
    },
    [updateSection],
  );

  const handleToggle = useCallback(
    (key: keyof DeliveryFields, text: string) => {
      const current = delivery[key];
      const next = toggleChip(current, text);
      updateSection('delivery', { [key]: next } as Record<string, string>);
    },
    [delivery, updateSection],
  );

  const handleInsertExamples = useCallback(() => {
    const examples = ACCEPTANCE_EXAMPLES[lang];
    const current = delivery.acceptanceCriteria;
    const next = insertMissingCriteria(current, examples);
    updateSection('delivery', { acceptanceCriteria: next });
  }, [delivery.acceptanceCriteria, lang, updateSection]);

  const handleInsertScenarioTemplate = useCallback(() => {
    const current = delivery.evaluationScenarios ?? '';
    const next = insertScenarioTemplate(current, lang);
    updateSection('delivery', { evaluationScenarios: next });
  }, [delivery.evaluationScenarios, lang, updateSection]);

  const { filled, total } = useMemo(() => countCompleted(project), [project]);

  const metricChips =
    productType && productType in EVALUATION_GUIDANCE
      ? EVALUATION_GUIDANCE[productType as keyof typeof EVALUATION_GUIDANCE].suggestedMetrics[lang]
      : null;

  const riskChips =
    productType && productType in EVALUATION_GUIDANCE
      ? EVALUATION_GUIDANCE[productType as keyof typeof EVALUATION_GUIDANCE].commonRisks[lang]
      : null;

  const scenarioChips =
    productType && productType in EVALUATION_GUIDANCE
      ? EVALUATION_GUIDANCE[productType as keyof typeof EVALUATION_GUIDANCE].suggestedMetrics[lang]
      : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-0">
          {/* -- Group 1: Prototype Boundary -- */}
          <SectionLabel>{lang === 'zh' ? '原型边界' : 'Prototype Boundary'}</SectionLabel>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Prototype Scope */}
            <div className="space-y-1.5">
              <FieldLabel
                label={t('workbench.stepTitles.evaluate.prototypeScope', lang) || FIELD_LABELS.prototypeScope[lang]}
                hint={FIELD_HINTS.prototypeScope[lang]}
              />
              <Textarea
                value={delivery.prototypeScope}
                onChange={(e) => handleChange('prototypeScope', e.target.value)}
                placeholder={FIELD_HINTS.prototypeScope[lang]}
                rows={3}
                className="resize-y"
              />
            </div>

            {/* Non-goals */}
            <div className="space-y-1.5">
              <FieldLabel
                label={t('workbench.stepTitles.evaluate.nonGoals', lang) || FIELD_LABELS.nonGoals[lang]}
                hint={FIELD_HINTS.nonGoals[lang]}
              />
              <Textarea
                value={delivery.nonGoals}
                onChange={(e) => handleChange('nonGoals', e.target.value)}
                placeholder={FIELD_HINTS.nonGoals[lang]}
                rows={3}
                className="resize-y"
              />
            </div>
          </div>

          {/* Dependencies -- full width */}
          <div className="mt-4 space-y-1.5">
            <FieldLabel
              label={t('workbench.stepTitles.evaluate.dependencies', lang) || FIELD_LABELS.dependencies[lang]}
              hint={FIELD_HINTS.dependencies[lang]}
            />
            <Textarea
              value={delivery.dependencies}
              onChange={(e) => handleChange('dependencies', e.target.value)}
              placeholder={FIELD_HINTS.dependencies[lang]}
              rows={3}
              className="resize-y"
            />
          </div>

          <SectionDivider />

          {/* -- Group 2: Evaluation -- */}
          <SectionLabel>{lang === 'zh' ? '评估' : 'Evaluation'}</SectionLabel>

          {/* Evaluation Metrics - full width with chips */}
          <div className="space-y-1.5">
            <FieldLabel
              label={t('workbench.stepTitles.evaluate.evaluationMetrics', lang) || FIELD_LABELS.evaluationMetrics[lang]}
              hint={FIELD_HINTS.evaluationMetrics[lang]}
            />
            <Textarea
              value={delivery.evaluationMetrics}
              onChange={(e) => handleChange('evaluationMetrics', e.target.value)}
              placeholder={FIELD_HINTS.evaluationMetrics[lang]}
              rows={4}
              className="resize-y"
            />
            {metricChips && (
              <SuggestionChips
                items={metricChips}
                currentValue={delivery.evaluationMetrics}
                onToggle={(text) => handleToggle('evaluationMetrics', text)}
                lang={lang}
              />
            )}
          </div>

          {/* Evaluation Scenarios - full width with insert template button */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <FieldLabel
                label={t('workbench.stepTitles.evaluate.evaluationScenarios', lang) || FIELD_LABELS.evaluationScenarios[lang]}
                hint={FIELD_HINTS.evaluationScenarios[lang]}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInsertScenarioTemplate}
                className="text-xs shrink-0"
              >
                {(delivery.evaluationScenarios ?? '').trim()
                  ? t('workbench.scenarios.insertMissing', lang)
                  : t('workbench.scenarios.insertTemplate', lang)}
              </Button>
            </div>
            <Textarea
              value={delivery.evaluationScenarios}
              onChange={(e) => handleChange('evaluationScenarios', e.target.value)}
              placeholder={FIELD_HINTS.evaluationScenarios[lang]}
              rows={5}
              className="resize-y"
            />
          </div>

          {/* Acceptance Criteria - full width with insert examples button */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <FieldLabel
                label={t('workbench.stepTitles.evaluate.acceptanceCriteria', lang) || FIELD_LABELS.acceptanceCriteria[lang]}
                hint={FIELD_HINTS.acceptanceCriteria[lang]}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInsertExamples}
                className="text-xs shrink-0"
              >
                {lang === 'zh' ? '插入示例' : 'Insert examples'}
              </Button>
            </div>
            <Textarea
              value={delivery.acceptanceCriteria}
              onChange={(e) => handleChange('acceptanceCriteria', e.target.value)}
              placeholder={FIELD_HINTS.acceptanceCriteria[lang]}
              rows={4}
              className="resize-y"
            />
          </div>

          <SectionDivider />

          {/* -- Group 3: Risk and Readiness -- */}
          <SectionLabel>{lang === 'zh' ? '风险与就绪度' : 'Risk and Readiness'}</SectionLabel>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Production Risks */}
            <div className="space-y-1.5">
              <FieldLabel
                label={t('workbench.stepTitles.evaluate.productionRisks', lang) || FIELD_LABELS.productionRisks[lang]}
                hint={FIELD_HINTS.productionRisks[lang]}
              />
              <Textarea
                value={delivery.productionRisks}
                onChange={(e) => handleChange('productionRisks', e.target.value)}
                placeholder={FIELD_HINTS.productionRisks[lang]}
                rows={3}
                className="resize-y"
              />
              {riskChips && (
                <SuggestionChips
                  items={riskChips}
                  currentValue={delivery.productionRisks}
                  onToggle={(text) => handleToggle('productionRisks', text)}
                  lang={lang}
                />
              )}
            </div>

            {/* Open Questions */}
            <div className="space-y-1.5">
              <FieldLabel
                label={t('workbench.stepTitles.evaluate.openQuestions', lang) || FIELD_LABELS.openQuestions[lang]}
                hint={FIELD_HINTS.openQuestions[lang]}
              />
              <Textarea
                value={delivery.openQuestions}
                onChange={(e) => handleChange('openQuestions', e.target.value)}
                placeholder={FIELD_HINTS.openQuestions[lang]}
                rows={3}
                className="resize-y"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* -- Product Pattern Guide (collapsible) -- */}
      <PatternGuideCard productType={productType} lang={lang} />

      {/* -- Design Review -- */}
      <DesignReviewCard project={project} lang={lang} goToStep={goToStep} />

      {/* -- Completion Summary (field count, not percentage) -- */}
      <div className="bg-card rounded-xl ring-1 ring-foreground/10 p-4">
        <span className="text-sm text-muted-foreground">
          {lang === 'zh'
            ? `${total} 个规划字段中已完成 ${filled} 个`
            : `${filled} of ${total} planning fields completed`}
        </span>
        <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? (filled / total) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
