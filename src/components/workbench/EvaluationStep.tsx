import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { t } from '@/data/translations';
import { EVALUATION_GUIDANCE } from '@/data/evaluationGuidance';
import type { WorkbenchProject, DeliveryFields, Lang, ProductType } from '@/lib/workbench/schema';

interface EvaluationStepProps {
  project: WorkbenchProject;
  updateSection: (section: string, fields: Record<string, string>) => void;
  lang: Lang;
}

/* ------------------------------------------------------------------ */
/*  Suggestion chip row                                                */
/* ------------------------------------------------------------------ */
function SuggestionChips({
  items,
  currentValue,
  onAppend,
  lang,
  showAll: controlledShowAll,
}: {
  items: string[];
  currentValue: string;
  onAppend: (text: string) => void;
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
          const isSelected = currentValue.includes(item);
          return (
            <button
              key={item}
              type="button"
              disabled={isSelected}
              onClick={() => onAppend(item)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground cursor-pointer'
              }`}
            >
              {isSelected && '✓ '}{item}
            </button>
          );
        })}
      </div>
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1.5 text-xs text-emerald-400 hover:underline"
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
  acceptanceCriteria: { en: 'Acceptance criteria', zh: '验收标准' },
  productionRisks: { en: 'Production risks', zh: '生产风险' },
  dependencies: { en: 'Dependencies', zh: '依赖项' },
  openQuestions: { en: 'Open questions', zh: '待解决问题' },
};

const FIELD_HINTS: Record<string, Record<Lang, string>> = {
  prototypeScope: { en: 'What is the MVP? What is the first version?', zh: 'MVP 是什么？第一个版本包含什么？' },
  nonGoals: { en: 'What is explicitly out of scope?', zh: '哪些明确不在范围内？' },
  evaluationMetrics: { en: 'How do you measure success?', zh: '如何衡量成功？' },
  acceptanceCriteria: { en: 'What must be true for this to be accepted?', zh: '满足什么条件才能被接受？' },
  productionRisks: { en: 'What could go wrong in production?', zh: '生产环境中可能出什么问题？' },
  dependencies: { en: 'What external dependencies exist?', zh: '存在哪些外部依赖？' },
  openQuestions: { en: 'What questions remain unanswered?', zh: '还有哪些未解决的问题？' },
};

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
}: EvaluationStepProps) {
  const delivery = project.delivery;
  const productType = project.metadata.productType as ProductType | '';

  const handleChange = useCallback(
    (key: keyof DeliveryFields, value: string) => {
      updateSection('delivery', { [key]: value } as Record<string, string>);
    },
    [updateSection],
  );

  const handleAppend = useCallback(
    (key: keyof DeliveryFields, text: string) => {
      const current = delivery[key];
      // Prevent duplicate
      if (current.includes(text)) return;
      const next = current ? `${current}\n${text}` : text;
      updateSection('delivery', { [key]: next } as Record<string, string>);
    },
    [delivery, updateSection],
  );

  const handleInsertExamples = useCallback(() => {
    const examples = ACCEPTANCE_EXAMPLES[lang];
    const text = examples.map(e => `- ${e}`).join('\n');
    const current = delivery.acceptanceCriteria;
    const next = current ? `${current}\n${text}` : text;
    updateSection('delivery', { acceptanceCriteria: next });
  }, [delivery.acceptanceCriteria, lang, updateSection]);

  const { filled, total } = useMemo(() => countCompleted(project), [project]);

  const metricChips =
    productType && productType !== '' && EVALUATION_GUIDANCE[productType]
      ? EVALUATION_GUIDANCE[productType].suggestedMetrics[lang]
      : null;

  const riskChips =
    productType && productType !== '' && EVALUATION_GUIDANCE[productType]
      ? EVALUATION_GUIDANCE[productType].commonRisks[lang]
      : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-0">
          {/* ── Group 1: Prototype Boundary ── */}
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

          {/* Dependencies — full width */}
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

          {/* ── Group 2: Evaluation ── */}
          <SectionLabel>{lang === 'zh' ? '评估' : 'Evaluation'}</SectionLabel>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Evaluation Metrics */}
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
                  onAppend={(text) => handleAppend('evaluationMetrics', text)}
                  lang={lang}
                />
              )}
            </div>

            {/* Acceptance Criteria */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FieldLabel
                  label={t('workbench.stepTitles.evaluate.acceptanceCriteria', lang) || FIELD_LABELS.acceptanceCriteria[lang]}
                  hint={FIELD_HINTS.acceptanceCriteria[lang]}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInsertExamples}
                  className="text-xs h-7 shrink-0"
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
          </div>

          <SectionDivider />

          {/* ── Group 3: Risk and Readiness ── */}
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
                  onAppend={(text) => handleAppend('productionRisks', text)}
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

      {/* ── Completion Summary (field count, not percentage) ── */}
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
