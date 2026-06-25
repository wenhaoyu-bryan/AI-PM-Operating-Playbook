import type {
  WorkbenchProject,
  MetadataFields,
  FramingFields,
  KnowledgeFields,
  Lang,
} from '@/lib/workbench/schema';
import { t } from '@/data/translations';
import { PRODUCT_TYPE_GUIDANCE } from '@/data/productTypeGuidance';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// ── Product type select options ──────────────────────────────────────

const PRODUCT_TYPE_OPTIONS = [
  '',
  'agent',
  'rag',
  'content-generation',
  'classification',
  'ontology-knowledge',
  'workflow-automation',
  'other',
] as const;

// ── Field definitions ────────────────────────────────────────────────

const FRAMING_FIELDS: { key: keyof FramingFields; labelKey: string; hintKey: string }[] = [
  { key: 'businessScenario', labelKey: 'workbench.framing.fields.businessScenario.label', hintKey: 'workbench.framing.fields.businessScenario.hint' },
  { key: 'targetUser', labelKey: 'workbench.framing.fields.targetUser.label', hintKey: 'workbench.framing.fields.targetUser.hint' },
  { key: 'currentWorkflow', labelKey: 'workbench.framing.fields.currentWorkflow.label', hintKey: 'workbench.framing.fields.currentWorkflow.hint' },
  { key: 'decisionToSupport', labelKey: 'workbench.framing.fields.decisionToSupport.label', hintKey: 'workbench.framing.fields.decisionToSupport.hint' },
  { key: 'problemEvidence', labelKey: 'workbench.framing.fields.problemEvidence.label', hintKey: 'workbench.framing.fields.problemEvidence.hint' },
  { key: 'expectedOutcome', labelKey: 'workbench.framing.fields.expectedOutcome.label', hintKey: 'workbench.framing.fields.expectedOutcome.hint' },
];

const KNOWLEDGE_FIELDS: { key: keyof KnowledgeFields; labelKey: string; hintKey: string }[] = [
  { key: 'dataSources', labelKey: 'workbench.framing.fields.dataSources.label', hintKey: 'workbench.framing.fields.dataSources.hint' },
  { key: 'knowledgeSources', labelKey: 'workbench.framing.fields.knowledgeSources.label', hintKey: 'workbench.framing.fields.knowledgeSources.hint' },
  { key: 'coreObjects', labelKey: 'workbench.framing.fields.coreObjects.label', hintKey: 'workbench.framing.fields.coreObjects.hint' },
  { key: 'keyRelationships', labelKey: 'workbench.framing.fields.keyRelationships.label', hintKey: 'workbench.framing.fields.keyRelationships.hint' },
  { key: 'assumptions', labelKey: 'workbench.framing.fields.assumptions.label', hintKey: 'workbench.framing.fields.assumptions.hint' },
];

// ── Section header helper ────────────────────────────────────────────

function SectionHeader({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block size-2.5 rounded-sm"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {label}
      </span>
    </div>
  );
}

// ── Field label + hint helper ────────────────────────────────────────

function FieldLabel({
  label,
  hint,
}: {
  label: string;
  hint: string;
}) {
  return (
    <>
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      <p className="mb-2 text-xs text-muted-foreground">{hint}</p>
    </>
  );
}

// ── Main component ───────────────────────────────────────────────────

interface ProductFramingStepProps {
  project: WorkbenchProject;
  onUpdateMetadata: (fields: Partial<MetadataFields>) => void;
  onUpdateFraming: (fields: Partial<FramingFields>) => void;
  onUpdateKnowledge: (fields: Partial<KnowledgeFields>) => void;
  lang: Lang;
}

export function ProductFramingStep({
  project,
  onUpdateMetadata,
  onUpdateFraming,
  onUpdateKnowledge,
  lang,
}: ProductFramingStepProps) {
  const { metadata, framing, knowledge } = project;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Section 1: Project Metadata ── */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Project Name */}
            <div>
              <FieldLabel
                label={t('workbench.framing.fields.projectName.label', lang) || 'Project Name'}
                hint={t('workbench.framing.fields.projectName.hint', lang) || ''}
              />
              <Input
                value={metadata.projectName}
                onChange={(e) => onUpdateMetadata({ projectName: e.target.value })}
                placeholder={t('workbench.framing.fields.projectName.placeholder', lang) || ''}
              />
            </div>

            {/* One-Line Idea */}
            <div>
              <FieldLabel
                label={t('workbench.framing.fields.oneLineIdea.label', lang) || 'One-Line Idea'}
                hint={t('workbench.framing.fields.oneLineIdea.hint', lang) || ''}
              />
              <Input
                value={metadata.oneLineIdea}
                onChange={(e) => onUpdateMetadata({ oneLineIdea: e.target.value })}
                placeholder={t('workbench.framing.fields.oneLineIdea.placeholder', lang) || ''}
              />
            </div>

            {/* Product Type */}
            <div>
              <FieldLabel
                label={t('workbench.framing.fields.productType.label', lang) || 'Product Type'}
                hint={t('workbench.framing.fields.productType.hint', lang) || ''}
              />
              <select
                value={metadata.productType}
                onChange={(e) =>
                  onUpdateMetadata({
                    productType: e.target.value as MetadataFields['productType'],
                  })
                }
                className="h-8 w-full rounded-md bg-secondary px-2.5 text-sm text-foreground border border-input outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {PRODUCT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {t(
                      `workbench.framing.fields.productType.options.${opt || 'empty'}`,
                      lang,
                    )}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Type Guidance callout */}
          {metadata.productType && metadata.productType !== 'other' && (
            <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
              {PRODUCT_TYPE_GUIDANCE[metadata.productType][lang]}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Section 2: Problem Context ── */}
      <Card>
        <CardContent>
          <SectionHeader
            color="var(--group-context)"
            label={t('workbench.framing.problemContext', lang) || 'Problem Context'}
          />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FRAMING_FIELDS.map(({ key, labelKey, hintKey }) => (
              <div key={key}>
                <FieldLabel
                  label={t(labelKey, lang) || labelKey}
                  hint={t(hintKey, lang) || ''}
                />
                <Textarea
                  rows={3}
                  value={framing[key]}
                  onChange={(e) => onUpdateFraming({ [key]: e.target.value })}
                  className="resize-y"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: Knowledge Context ── */}
      <Card>
        <CardContent>
          <SectionHeader
            color="var(--group-knowledge)"
            label={t('workbench.framing.knowledgeContext', lang) || 'Knowledge Context'}
          />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {KNOWLEDGE_FIELDS.map(({ key, labelKey, hintKey }) => (
              <div key={key}>
                <FieldLabel
                  label={t(labelKey, lang) || labelKey}
                  hint={t(hintKey, lang) || ''}
                />
                <Textarea
                  rows={3}
                  value={knowledge[key]}
                  onChange={(e) => onUpdateKnowledge({ [key]: e.target.value })}
                  className="resize-y"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
