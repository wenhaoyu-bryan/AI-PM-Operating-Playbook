import type { WorkbenchProject, Lang, ProductType } from '@/lib/workbench/schema';
import { getLocalizedProductType } from '@/lib/workbench/schema';
import { getFieldValue } from '@/lib/workbench/fields';
import { t } from '@/data/translations';

interface LivePreviewPanelProps {
  project: WorkbenchProject;
  currentStep: number;
  lang: Lang;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2">
      {children}
    </p>
  );
}

function PreviewText({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="mb-3">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="list-disc pl-4 space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-foreground">{item}</li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ol className="list-decimal pl-4 space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-foreground">{item}</li>
      ))}
    </ol>
  );
}

function parseLines(text: string): string[] {
  return text.split('\n').map(l => l.replace(/^\s*[-*]\s*/, '').replace(/^\s*\d+[.)]\s*/, '').trim()).filter(Boolean);
}

function hasAnyContent(obj: object): boolean {
  return Object.values(obj).some(v => typeof v === 'string' && v.trim().length > 0);
}

const PRODUCT_TYPE_LABELS: Record<ProductType, Record<Lang, string>> = {
  agent: { en: 'Agent', zh: '智能体' },
  rag: { en: 'RAG', zh: 'RAG' },
  'content-generation': { en: 'Content Generation', zh: '内容生成' },
  classification: { en: 'Classification', zh: '分类模型' },
  'ontology-knowledge': { en: 'Ontology / Knowledge', zh: '本体/知识图谱' },
  'workflow-automation': { en: 'Workflow Automation', zh: '工作流自动化' },
  other: { en: 'Other', zh: '其他' },
};

function FramingPreview({ project, lang }: { project: WorkbenchProject; lang: Lang }) {
  const { metadata, framing, knowledge } = project;
  const hasEssential = metadata.projectName.trim() || framing.businessScenario.trim() || framing.targetUser.trim();
  if (!hasEssential) {
    return <EmptyState lang={lang} />;
  }
  return (
    <div className="space-y-4">
      {metadata.projectName.trim() && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-1">{metadata.projectName}</h2>
          {metadata.oneLineIdea.trim() && (
            <p className="text-sm text-muted-foreground italic">{metadata.oneLineIdea}</p>
          )}
          {metadata.productType && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
              {getLocalizedProductType(metadata.productType as ProductType, lang)}
            </span>
          )}
        </div>
      )}

      <PreviewText label={t('workbench.stepTitles.framing.businessScenario', lang)} value={framing.businessScenario} />
      <PreviewText label={t('workbench.stepTitles.framing.targetUser', lang)} value={framing.targetUser} />
      <PreviewText label={t('workbench.stepTitles.framing.decisionToSupport', lang)} value={framing.decisionToSupport} />
      <PreviewText label={t('workbench.stepTitles.framing.expectedOutcome', lang)} value={framing.expectedOutcome} />

      {hasAnyContent({ dataSources: knowledge.dataSources, knowledgeSources: knowledge.knowledgeSources, coreObjects: knowledge.coreObjects, keyRelationships: knowledge.keyRelationships }) && (
        <div>
          <SectionLabel>{lang === 'zh' ? '知识概览' : 'Knowledge Summary'}</SectionLabel>
          <PreviewText label={t('workbench.stepTitles.design.dataSources', lang)} value={knowledge.dataSources} />
          <PreviewText label={t('workbench.stepTitles.design.knowledgeSources', lang)} value={knowledge.knowledgeSources} />
          <PreviewText label={t('workbench.stepTitles.design.coreObjects', lang)} value={knowledge.coreObjects} />
          <PreviewText label={t('workbench.stepTitles.design.keyRelationships', lang)} value={knowledge.keyRelationships} />
        </div>
      )}
    </div>
  );
}

function WorkflowPreview({ project, lang }: { project: WorkbenchProject; lang: Lang }) {
  const { intelligence } = project;
  const hasContent = hasAnyContent(intelligence);
  if (!hasContent) {
    return <EmptyState lang={lang} />;
  }

  const steps = parseLines(intelligence.workflowSteps);

  return (
    <div className="space-y-4">
      <PreviewText label={t('workbench.stepTitles.design.aiCapability', lang)} value={intelligence.aiCapability} />

      {intelligence.agentRequired && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-0.5">{t('workbench.stepTitles.design.agentRequired', lang)}</p>
          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
            {intelligence.agentRequired === 'yes'
              ? t('workbench.stepTitles.design.agentYesLabel', lang)
              : intelligence.agentRequired === 'no'
                ? t('workbench.stepTitles.design.agentNoLabel', lang)
                : lang === 'zh' ? '不确定' : 'Unsure'}
          </span>
        </div>
      )}

      <PreviewText label={t('workbench.stepTitles.design.tools', lang)} value={intelligence.tools} />

      {steps.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">{t('workbench.stepTitles.design.workflowSteps', lang)}</p>
          <NumberedList items={steps} />
        </div>
      )}

      <PreviewText label={t('workbench.stepTitles.design.autonomyBoundary', lang)} value={intelligence.autonomyBoundary} />
      <PreviewText label={t('workbench.stepTitles.design.humanReview', lang)} value={intelligence.humanReview} />
    </div>
  );
}

function EvaluationPreviewPanel({ project, lang }: { project: WorkbenchProject; lang: Lang }) {
  const { delivery } = project;
  const hasContent = hasAnyContent(delivery);
  if (!hasContent) {
    return <EmptyState lang={lang} />;
  }

  const metrics = parseLines(delivery.evaluationMetrics);
  const criteria = parseLines(delivery.acceptanceCriteria);

  return (
    <div className="space-y-4">
      <PreviewText label={t('workbench.stepTitles.evaluate.prototypeScope', lang)} value={delivery.prototypeScope} />
      <PreviewText label={t('workbench.stepTitles.evaluate.nonGoals', lang)} value={delivery.nonGoals} />

      {metrics.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">{t('workbench.stepTitles.evaluate.evaluationMetrics', lang)}</p>
          <BulletList items={metrics} />
        </div>
      )}

      {criteria.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">{t('workbench.stepTitles.evaluate.acceptanceCriteria', lang)}</p>
          <ul className="space-y-1">
            {criteria.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-0.5 text-emerald-400">&#9744;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <PreviewText label={t('workbench.stepTitles.evaluate.productionRisks', lang)} value={delivery.productionRisks} />
    </div>
  );
}

function EmptyState({ lang }: { lang: Lang }) {
  return (
    <p className="text-sm text-muted-foreground italic">
      {t('workbench.preview.emptyState', lang)}
    </p>
  );
}

function ExportEmptyState() {
  return (
    <p className="text-sm text-muted-foreground italic">
      Select a document from the list to preview.
    </p>
  );
}

export function LivePreviewPanel({ project, currentStep, lang }: LivePreviewPanelProps) {
  const titles: Record<number, Record<Lang, string>> = {
    0: { en: 'AI Product Brief Preview', zh: 'AI 产品简报预览' },
    1: { en: 'AI Workflow Specification Preview', zh: 'AI 工作流规范预览' },
    2: { en: 'Evaluation Plan Preview', zh: '评估计划预览' },
  };

  const title = titles[currentStep]?.[lang] || '';

  return (
    <div className="h-full flex flex-col bg-card/50">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">{title || t('workbench.preview.title', lang)}</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentStep === 0 && <FramingPreview project={project} lang={lang} />}
        {currentStep === 1 && <WorkflowPreview project={project} lang={lang} />}
        {currentStep === 2 && <EvaluationPreviewPanel project={project} lang={lang} />}
        {currentStep === 3 && <ExportEmptyState />}
      </div>
    </div>
  );
}
