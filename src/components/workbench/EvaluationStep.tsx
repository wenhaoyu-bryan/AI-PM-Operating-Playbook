import { useCallback, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { t } from '@/data/translations';
import { EVALUATION_GUIDANCE } from '@/data/evaluationGuidance';
import type { WorkbenchProject, DeliveryFields, Lang, ProductType } from '@/lib/workbench/schema';

interface EvaluationStepProps {
  project: WorkbenchProject;
  updateSection: (section: string, fields: Record<string, string>) => void;
  lang: Lang;
}

/* ------------------------------------------------------------------ */
/*  Field descriptors                                                  */
/* ------------------------------------------------------------------ */
interface FieldDef {
  key: keyof DeliveryFields;
  labelKey: string;
  hintKey: string;
  rows: number;
}

const DELIVERY_FIELDS: FieldDef[] = [
  { key: 'prototypeScope', labelKey: 'workbench.delivery.fields.prototypeScope.label', hintKey: 'workbench.delivery.fields.prototypeScope.hint', rows: 3 },
  { key: 'nonGoals', labelKey: 'workbench.delivery.fields.nonGoals.label', hintKey: 'workbench.delivery.fields.nonGoals.hint', rows: 3 },
  { key: 'evaluationMetrics', labelKey: 'workbench.delivery.fields.evaluationMetrics.label', hintKey: 'workbench.delivery.fields.evaluationMetrics.hint', rows: 4 },
  { key: 'acceptanceCriteria', labelKey: 'workbench.delivery.fields.acceptanceCriteria.label', hintKey: 'workbench.delivery.fields.acceptanceCriteria.hint', rows: 4 },
  { key: 'productionRisks', labelKey: 'workbench.delivery.fields.productionRisks.label', hintKey: 'workbench.delivery.fields.productionRisks.hint', rows: 3 },
  { key: 'dependencies', labelKey: 'workbench.delivery.fields.dependencies.label', hintKey: 'workbench.delivery.fields.dependencies.hint', rows: 3 },
  { key: 'openQuestions', labelKey: 'workbench.delivery.fields.openQuestions.label', hintKey: 'workbench.delivery.fields.openQuestions.hint', rows: 3 },
];

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
/*  Suggestion chip row                                                */
/* ------------------------------------------------------------------ */
function SuggestionChips({
  items,
  currentValue,
  onAppend,
}: {
  items: string[];
  currentValue: string;
  onAppend: (text: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onAppend(item)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs text-muted-foreground hover:bg-secondary/80 hover:text-foreground cursor-pointer transition-colors"
        >
          {item}
        </button>
      ))}
    </div>
  );
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
      const next = current ? `${current}\n${text}` : text;
      updateSection('delivery', { [key]: next } as Record<string, string>);
    },
    [delivery, updateSection],
  );

  const { filled, total } = useMemo(() => countCompleted(project), [project]);
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

  const metricChips =
    productType && productType !== '' && EVALUATION_GUIDANCE[productType]
      ? EVALUATION_GUIDANCE[productType].suggestedMetrics[lang]
      : null;

  const riskChips =
    productType && productType !== '' && EVALUATION_GUIDANCE[productType]
      ? EVALUATION_GUIDANCE[productType].commonRisks[lang]
      : null;

  return (
    <div className="space-y-6">
      {/* ── Evaluation & Risk ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: 'var(--group-delivery)' }}
            />
            <CardTitle className="text-base">
              {t('workbench.stepTitles.evaluate', lang) || (lang === 'zh' ? '评估与风险' : 'Evaluation & Risk')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {DELIVERY_FIELDS.map((field) => {
              const label = t(field.labelKey, lang) || FIELD_LABELS[field.key]?.[lang] || field.key;
              const hint = t(field.hintKey, lang) || FIELD_HINTS[field.key]?.[lang] || '';
              const value = delivery[field.key];

              return (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{label}</label>
                  <p className="text-xs text-muted-foreground m-0">{hint}</p>
                  <Textarea
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={hint}
                    rows={field.rows}
                    className="resize-y"
                  />
                  {/* Suggestion chips */}
                  {field.key === 'evaluationMetrics' && metricChips && (
                    <SuggestionChips items={metricChips} currentValue={value} onAppend={(text) => handleAppend('evaluationMetrics', text)} />
                  )}
                  {field.key === 'productionRisks' && riskChips && (
                    <SuggestionChips items={riskChips} currentValue={value} onAppend={(text) => handleAppend('productionRisks', text)} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Completion Summary ── */}
      <div className="bg-card rounded-xl ring-1 ring-foreground/10 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {lang === 'zh'
              ? `${total} 个核心字段中已完成 ${filled} 个`
              : `${filled} of ${total} core areas completed`}
          </span>
          <span className="text-sm font-medium text-emerald-400">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
