import { useState, useCallback, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { t } from '@/data/translations';
import { PRODUCT_TYPE_GUIDANCE } from '@/data/productTypeGuidance';
import type { WorkbenchProject, MetadataFields, FramingFields, KnowledgeFields, Lang, ProductType } from '@/lib/workbench/schema';

// ── Product type select options ──────────────────────────────────────

const PRODUCT_TYPE_OPTIONS: (ProductType | '')[] = [
  '',
  'agent',
  'rag',
  'content-generation',
  'classification',
  'ontology-knowledge',
  'workflow-automation',
  'other',
];

// ── Field helpers ───────────────────────────────────────────────────

interface FieldConfig {
  key: string;
  labelKey: string;
  hintKey: string;
  required?: boolean;
  section: 'framing' | 'knowledge';
}

const FRAMING_FIELDS: FieldConfig[] = [
  { key: 'businessScenario', labelKey: 'workbench.framing.fields.businessScenario.label', hintKey: 'workbench.framing.fields.businessScenario.hint', required: true, section: 'framing' },
  { key: 'targetUser', labelKey: 'workbench.framing.fields.targetUser.label', hintKey: 'workbench.framing.fields.targetUser.hint', required: true, section: 'framing' },
  { key: 'decisionToSupport', labelKey: 'workbench.framing.fields.decisionToSupport.label', hintKey: 'workbench.framing.fields.decisionToSupport.hint', required: true, section: 'framing' },
  { key: 'expectedOutcome', labelKey: 'workbench.framing.fields.expectedOutcome.label', hintKey: 'workbench.framing.fields.expectedOutcome.hint', required: true, section: 'framing' },
];

const PROCESS_FIELDS: FieldConfig[] = [
  { key: 'currentWorkflow', labelKey: 'workbench.framing.fields.currentWorkflow.label', hintKey: 'workbench.framing.fields.currentWorkflow.hint', section: 'framing' },
  { key: 'problemEvidence', labelKey: 'workbench.framing.fields.problemEvidence.label', hintKey: 'workbench.framing.fields.problemEvidence.hint', section: 'framing' },
  { key: 'assumptions', labelKey: 'workbench.framing.fields.assumptions.label', hintKey: 'workbench.framing.fields.assumptions.hint', section: 'knowledge' },
];

const KNOWLEDGE_FIELDS: FieldConfig[] = [
  { key: 'dataSources', labelKey: 'workbench.framing.fields.dataSources.label', hintKey: 'workbench.framing.fields.dataSources.hint', section: 'knowledge' },
  { key: 'knowledgeSources', labelKey: 'workbench.framing.fields.knowledgeSources.label', hintKey: 'workbench.framing.fields.knowledgeSources.hint', section: 'knowledge' },
  { key: 'coreObjects', labelKey: 'workbench.framing.fields.coreObjects.label', hintKey: 'workbench.framing.fields.coreObjects.hint', section: 'knowledge' },
  { key: 'keyRelationships', labelKey: 'workbench.framing.fields.keyRelationships.label', hintKey: 'workbench.framing.fields.keyRelationships.hint', section: 'knowledge' },
];

// ── Get value from project ──────────────────────────────────────────

function getFieldValue(project: WorkbenchProject, field: FieldConfig): string {
  if (field.section === 'framing') return project.framing[field.key as keyof FramingFields] ?? '';
  return project.knowledge[field.key as keyof KnowledgeFields] ?? '';
}

// ── Completion count ────────────────────────────────────────────────

function countFilled(project: WorkbenchProject, fields: FieldConfig[]): { filled: number; total: number } {
  const filled = fields.filter(f => getFieldValue(project, f).trim().length > 0).length;
  return { filled, total: fields.length };
}

// ── Collapsible section header ──────────────────────────────────────

function SectionHeader({
  title,
  expanded,
  onToggle,
  filled,
  total,
  color,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  filled: number;
  total: number;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between w-full py-3 text-left hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block size-2.5 rounded-sm"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
          {filled}/{total}
        </span>
      </div>
      <ChevronDown
        className={`size-4 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
      />
    </button>
  );
}

// ── Field input component ──────────────────────────────────────────

function FieldInput({
  field,
  value,
  onChange,
  lang,
}: {
  field: FieldConfig;
  value: string;
  onChange: (val: string) => void;
  lang: Lang;
}) {
  const label = t(field.labelKey, lang) || field.key;
  const hint = t(field.hintKey, lang) || '';

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
        {field.required && (
          <span className="ml-1 text-muted-foreground text-xs">*</span>
        )}
      </label>
      {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
      <Textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y"
      />
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────

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

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    essential: true,
    process: false,
    knowledge: false,
  });

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleFieldChange = useCallback((field: FieldConfig, value: string) => {
    if (field.section === 'framing') {
      onUpdateFraming({ [field.key]: value } as Partial<FramingFields>);
    } else {
      onUpdateKnowledge({ [field.key]: value } as Partial<KnowledgeFields>);
    }
  }, [onUpdateFraming, onUpdateKnowledge]);

  const essentialCount = useMemo(
    () => ({
      filled: [
        metadata.projectName,
        metadata.oneLineIdea,
        framing.businessScenario,
        framing.targetUser,
        framing.decisionToSupport,
        framing.expectedOutcome,
      ].filter(v => v.trim().length > 0).length,
      total: 6,
    }),
    [metadata.projectName, metadata.oneLineIdea, framing.businessScenario, framing.targetUser, framing.decisionToSupport, framing.expectedOutcome],
  );

  const processCount = useMemo(() => countFilled(project, PROCESS_FIELDS), [project]);
  const knowledgeCount = useMemo(() => countFilled(project, KNOWLEDGE_FIELDS), [project]);

  return (
    <Card>
      <CardContent className="space-y-0">
        {/* ── Section 1: Essential ── */}
        <SectionHeader
          title={lang === 'zh' ? '基本信息' : 'Essential'}
          expanded={expandedSections.essential}
          onToggle={() => toggleSection('essential')}
          filled={essentialCount.filled}
          total={essentialCount.total}
          color="var(--group-context)"
        />

        {expandedSections.essential && (
          <div className="pb-5 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t('workbench.framing.fields.projectName.label', lang) || 'Project Name'}
                  <span className="ml-1 text-muted-foreground text-xs">*</span>
                </label>
                <Input
                  value={metadata.projectName}
                  onChange={(e) => onUpdateMetadata({ projectName: e.target.value })}
                  placeholder={t('workbench.framing.fields.projectName.placeholder', lang) || ''}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t('workbench.framing.fields.oneLineIdea.label', lang) || 'One-Line Idea'}
                  <span className="ml-1 text-muted-foreground text-xs">*</span>
                </label>
                <Input
                  value={metadata.oneLineIdea}
                  onChange={(e) => onUpdateMetadata({ oneLineIdea: e.target.value })}
                  placeholder={t('workbench.framing.fields.oneLineIdea.placeholder', lang) || ''}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t('workbench.framing.fields.productType.label', lang) || 'Product Type'}
                </label>
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

            {/* Product type guidance callout */}
            {metadata.productType && metadata.productType !== 'other' && (
              <div className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
                {PRODUCT_TYPE_GUIDANCE[metadata.productType as ProductType]?.[lang]}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FRAMING_FIELDS.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={getFieldValue(project, field)}
                  onChange={(val) => handleFieldChange(field, val)}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Section divider ── */}
        <div className="border-t border-border" />

        {/* ── Section 2: Current Process & Evidence ── */}
        <SectionHeader
          title={lang === 'zh' ? '现有流程与依据' : 'Current Process & Evidence'}
          expanded={expandedSections.process}
          onToggle={() => toggleSection('process')}
          filled={processCount.filled}
          total={processCount.total}
          color="var(--group-knowledge)"
        />

        {expandedSections.process && (
          <div className="pb-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PROCESS_FIELDS.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={getFieldValue(project, field)}
                  onChange={(val) => handleFieldChange(field, val)}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Section divider ── */}
        <div className="border-t border-border" />

        {/* ── Section 3: Data & Knowledge ── */}
        <SectionHeader
          title={lang === 'zh' ? '数据与知识' : 'Data & Knowledge'}
          expanded={expandedSections.knowledge}
          onToggle={() => toggleSection('knowledge')}
          filled={knowledgeCount.filled}
          total={knowledgeCount.total}
          color="var(--group-ai)"
        />

        {expandedSections.knowledge && (
          <div className="pb-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {KNOWLEDGE_FIELDS.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={getFieldValue(project, field)}
                  onChange={(val) => handleFieldChange(field, val)}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
