import { useState, useCallback, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { t } from '@/data/translations';
import type { WorkbenchProject, IntelligenceFields, Lang, ProductType } from '@/lib/workbench/schema';

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
/*  Sample workflows by product type                                   */
/* ------------------------------------------------------------------ */
const SAMPLE_WORKFLOWS: Record<ProductType, Record<Lang, string>> = {
  agent: {
    en: 'Receive user request\nClassify intent and priority\nRetrieve relevant context\nPlan multi-step execution\nExecute tool calls sequentially\nReview results and confidence\nEscalate to human if uncertain\nDeliver structured response',
    zh: '接收用户请求\n分类意图和优先级\n检索相关上下文\n规划多步执行\n顺序执行工具调用\n审核结果和置信度\n不确定时升级给人工\n交付结构化响应',
  },
  rag: {
    en: 'Receive user query\nGenerate search queries\nRetrieve relevant documents\nRerank and filter results\nConstruct grounded prompt\nGenerate answer with citations\nValidate citation accuracy',
    zh: '接收用户查询\n生成检索查询\n检索相关文档\n重排序和过滤结果\n构建有依据的提示词\n生成带引用的答案\n验证引用准确性',
  },
  'content-generation': {
    en: 'Receive content request\nGather source materials\nGenerate draft content\nApply tone and style rules\nRun factuality checks\nHuman review and edit\nPublish final content',
    zh: '接收内容请求\n收集素材\n生成初稿\n应用语气和风格规则\n运行事实核查\n人工审核和编辑\n发布最终内容',
  },
  classification: {
    en: 'Receive input text\nPreprocess and normalize\nRun classification model\nCheck confidence threshold\nAssign label or flag for review\nLog prediction and metadata',
    zh: '接收输入文本\n预处理和规范化\n运行分类模型\n检查置信度阈值\n分配标签或标记待审核\n记录预测和元数据',
  },
  'ontology-knowledge': {
    en: 'Receive domain documents\nExtract entities with NER\nIdentify relationships\nNormalize and deduplicate\nMap to ontology schema\nDomain expert validation\nUpdate knowledge graph',
    zh: '接收领域文档\n使用 NER 提取实体\n识别关系\n规范化和去重\n映射到本体模式\n领域专家验证\n更新知识图谱',
  },
  'workflow-automation': {
    en: 'Receive trigger event\nApply business rules\nRoute to appropriate workflow\nExecute automated steps\nCheck integration points\nHandle exceptions and retries\nLog completion status',
    zh: '接收触发事件\n应用业务规则\n路由到对应工作流\n执行自动化步骤\n检查集成点\n处理异常和重试\n记录完成状态',
  },
  other: {
    en: 'Receive input\nProcess with AI capability\nValidate output quality\nDeliver result to user',
    zh: '接收输入\n使用 AI 能力处理\n验证输出质量\n向用户交付结果',
  },
};

/* ------------------------------------------------------------------ */
/*  Agent Suitability callout                                          */
/* ------------------------------------------------------------------ */
function AgentSuitabilityCallout({
  lang,
  onSelect,
  selectedValue,
}: {
  lang: Lang;
  onSelect: (value: 'yes' | 'no' | 'unsure' | '') => void;
  selectedValue: 'yes' | 'no' | 'unsure' | '';
}) {
  const [showFull, setShowFull] = useState(selectedValue === '');

  if (!showFull && selectedValue) {
    const summary =
      selectedValue === 'yes'
        ? t('workbench.stepTitles.design.agentMayBeAppropriate', lang)
        : selectedValue === 'no'
          ? t('workbench.stepTitles.design.agentMayNotBeNeeded', lang)
          : t('workbench.stepTitles.design.agentDecisionUnsure', lang);

    return (
      <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{summary}</span>
        <button
          type="button"
          onClick={() => setShowFull(true)}
          className="text-xs text-emerald-400 hover:underline"
        >
          {t('workbench.stepTitles.design.change', lang)}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
      <p className="text-sm font-medium text-foreground m-0">
        {t('workbench.stepTitles.design.agentSuitability', lang) || 'Do you need an agent?'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <Button variant="outline" size="sm" onClick={() => { onSelect('yes'); setShowFull(false); }}>
          {t('workbench.stepTitles.design.agentYesButton', lang)}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { onSelect('no'); setShowFull(false); }}>
          {t('workbench.stepTitles.design.agentNoButton', lang)}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { onSelect('unsure'); setShowFull(false); }}>
          {t('workbench.stepTitles.design.agentUnsureButton', lang)}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Workflow Preview (collapsible)                                     */
/* ------------------------------------------------------------------ */
function WorkflowPreview({
  steps,
  lang,
}: {
  steps: string[];
  lang: Lang;
}) {
  const [expanded, setExpanded] = useState(true);

  if (steps.length === 0) return null;

  return (
    <div className="rounded-lg ring-1 ring-foreground/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-secondary/50 hover:bg-secondary/70 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">
          {t('workbench.stepTitles.design.workflowPreview', lang)}
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="p-4">
          <div className="flex flex-col items-center gap-0">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center w-full max-w-md">
                <div className="flex items-center gap-3 w-full rounded-lg ring-1 ring-foreground/10 bg-secondary p-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{step}</span>
                </div>

                {index < steps.length - 1 && (
                  <ChevronDown className="size-4 text-muted-foreground my-1 mx-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export function WorkflowDesignStep({
  project,
  updateSection,
  lang,
}: WorkflowDesignStepProps) {
  const intelligence = project.intelligence;
  const productType = project.metadata.productType;

  const [showPreview, setShowPreview] = useState(true);
  const [insertMode, setInsertMode] = useState<'idle' | 'choose'>('idle');

  const handleChange = useCallback(
    (key: keyof IntelligenceFields, value: string) => {
      updateSection('intelligence', { [key]: value } as Record<string, string>);
    },
    [updateSection],
  );

  const handleAgentSelect = useCallback(
    (value: 'yes' | 'no' | 'unsure' | '') => {
      updateSection('intelligence', { agentRequired: value } as Record<string, string>);
    },
    [updateSection],
  );

  const handleInsertExample = useCallback(() => {
    if (!productType) return;
    const sample = SAMPLE_WORKFLOWS[productType]?.[lang] || SAMPLE_WORKFLOWS.other[lang];
    if (intelligence.workflowSteps.trim()) {
      // Field has content -- show choice
      setInsertMode('choose');
    } else {
      // Field is empty -- insert directly
      handleChange('workflowSteps', sample);
    }
  }, [productType, lang, handleChange, intelligence.workflowSteps]);

  const handleInsertReplace = useCallback(() => {
    if (!productType) return;
    const sample = SAMPLE_WORKFLOWS[productType]?.[lang] || SAMPLE_WORKFLOWS.other[lang];
    handleChange('workflowSteps', sample);
    setInsertMode('idle');
  }, [productType, lang, handleChange]);

  const handleInsertAppend = useCallback(() => {
    if (!productType) return;
    const sample = SAMPLE_WORKFLOWS[productType]?.[lang] || SAMPLE_WORKFLOWS.other[lang];
    const current = intelligence.workflowSteps.trimEnd();
    handleChange('workflowSteps', current ? `${current}\n${sample}` : sample);
    setInsertMode('idle');
  }, [productType, lang, handleChange, intelligence.workflowSteps]);

  const handleClearWorkflow = useCallback(() => {
    handleChange('workflowSteps', '');
  }, [handleChange]);

  const workflowSteps = useMemo(
    () => parseWorkflowSteps(intelligence.workflowSteps),
    [intelligence.workflowSteps],
  );

  const stepCount = workflowSteps.length;

  // Determine which fields to show based on agentRequired
  const isAgent = intelligence.agentRequired === 'yes';
  const isNoAgent = intelligence.agentRequired === 'no';
  const isUnsure = intelligence.agentRequired === 'unsure';

  // Boundary label based on agent decision
  const boundaryLabel = isAgent
    ? t('workbench.stepTitles.design.autonomyBoundary', lang)
    : isNoAgent
      ? t('workbench.stepTitles.design.executionBoundary', lang)
      : t('workbench.stepTitles.design.workflowBoundary', lang);

  const boundaryHint = isAgent
    ? t('workbench.stepTitles.design.autonomyBoundaryHint', lang)
    : isNoAgent
      ? t('workbench.stepTitles.design.executionBoundaryHint', lang)
      : t('workbench.stepTitles.design.workflowBoundaryHint', lang);

  // Human review hint based on agent decision
  const humanReviewHint = isAgent
    ? t('workbench.stepTitles.design.humanReviewHintAgent', lang)
    : isNoAgent
      ? t('workbench.stepTitles.design.humanReviewHintDeterministic', lang)
      : t('workbench.stepTitles.design.humanReviewHintUnsure', lang);

  // Agent reasoning label -- "Approach Rationale" for deterministic, "Agent Reasoning" for agent
  const agentReasoningLabel = isNoAgent
    ? t('workbench.stepTitles.design.approachRationale', lang)
    : t('workbench.stepTitles.design.agentReasoning', lang);

  const agentReasoningHint = isNoAgent
    ? t('workbench.stepTitles.design.approachRationaleHint', lang)
    : t('workbench.stepTitles.design.agentReasoningHint', lang);

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* -- AI Capability -- */}
        <div className="space-y-1.5">
          <FieldLabel
            label={t('workbench.stepTitles.design.aiCapability', lang)}
            hint={t('workbench.stepTitles.design.aiCapabilityHint', lang)}
          />
          <Textarea
            value={intelligence.aiCapability}
            onChange={(e) => handleChange('aiCapability', e.target.value)}
            placeholder={t('workbench.stepTitles.design.aiCapabilityHint', lang)}
            rows={3}
            className="resize-y"
          />
        </div>

        {/* -- Agent Required -- */}
        <div className="space-y-2">
          <FieldLabel
            label={t('workbench.stepTitles.design.agentRequired', lang)}
            hint={t('workbench.stepTitles.design.agentRequiredHint', lang)}
          />
          <div className="flex gap-2">
            <Button
              variant={intelligence.agentRequired === 'yes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAgentSelect(intelligence.agentRequired === 'yes' ? '' : 'yes')}
            >
              {lang === 'zh' ? '是，多步自适应工作流' : 'Yes, adaptive multi-step workflow'}
            </Button>
            <Button
              variant={intelligence.agentRequired === 'no' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAgentSelect(intelligence.agentRequired === 'no' ? '' : 'no')}
            >
              {lang === 'zh' ? '否，确定性工作流' : 'No, deterministic workflow'}
            </Button>
            <Button
              variant={intelligence.agentRequired === 'unsure' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAgentSelect(intelligence.agentRequired === 'unsure' ? '' : 'unsure')}
            >
              {lang === 'zh' ? '暂不确定' : 'Not sure'}
            </Button>
          </div>
        </div>

        {/* Agent suitability callout -- only when agentRequired is empty */}
        {intelligence.agentRequired === '' && (
          <AgentSuitabilityCallout
            lang={lang}
            onSelect={handleAgentSelect}
            selectedValue=""
          />
        )}

        {/* Agent choice with collapsed summary */}
        {intelligence.agentRequired !== '' && (
          <AgentSuitabilityCallout
            lang={lang}
            onSelect={handleAgentSelect}
            selectedValue={intelligence.agentRequired}
          />
        )}

        {/* -- Conditional fields -- */}
        {/* Agent reasoning / Approach Rationale -- show for yes, unsure, and empty; renamed for no */}
        {(isAgent || isNoAgent || isUnsure || intelligence.agentRequired === '') && (
          <div className="space-y-1.5">
            <FieldLabel
              label={agentReasoningLabel}
              hint={agentReasoningHint}
            />
            <Textarea
              value={intelligence.agentReasoning}
              onChange={(e) => handleChange('agentReasoning', e.target.value)}
              placeholder={agentReasoningHint}
              rows={3}
              className="resize-y"
            />
          </div>
        )}

        {/* Tools -- always show (deterministic workflows may still call APIs) */}
        <div className="space-y-1.5">
          <FieldLabel
            label={t('workbench.stepTitles.design.tools', lang)}
            hint={t('workbench.stepTitles.design.toolsHint', lang)}
          />
          <Textarea
            value={intelligence.tools}
            onChange={(e) => handleChange('tools', e.target.value)}
            placeholder={t('workbench.stepTitles.design.toolsHint', lang)}
            rows={3}
            className="resize-y"
          />
        </div>

        {/* -- Workflow Steps -- */}
        <div className="space-y-1.5">
          <FieldLabel
            label={t('workbench.stepTitles.design.workflowSteps', lang)}
            hint={t('workbench.stepTitles.design.workflowStepsHint', lang)}
          />
          <Textarea
            value={intelligence.workflowSteps}
            onChange={(e) => handleChange('workflowSteps', e.target.value)}
            placeholder={t('workbench.stepTitles.design.workflowStepsHint', lang)}
            rows={8}
            className="resize-y"
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              {stepCount > 0
                ? (lang === 'zh' ? `${stepCount} 个步骤` : `${stepCount} step${stepCount !== 1 ? 's' : ''}`)
                : (lang === 'zh' ? '每行一个步骤' : 'One step per line')}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInsertExample}
                disabled={!productType}
                className="text-xs h-7"
              >
                {lang === 'zh' ? '插入示例' : 'Insert Example'}
              </Button>
              {intelligence.workflowSteps.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearWorkflow}
                  className="text-xs h-7 text-muted-foreground hover:text-destructive"
                >
                  {lang === 'zh' ? '清空' : 'Clear'}
                </Button>
              )}
            </div>
          </div>
          {/* Insert mode choice when field has content */}
          {insertMode === 'choose' && (
            <div className="flex items-center gap-2 p-2 bg-secondary rounded-md text-xs">
              <span className="text-muted-foreground">
                {lang === 'zh' ? '字段已有内容：' : 'Field has content:'}
              </span>
              <Button size="sm" variant="outline" onClick={handleInsertReplace}>
                {lang === 'zh' ? '替换' : 'Replace'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleInsertAppend}>
                {lang === 'zh' ? '追加' : 'Append'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setInsertMode('idle')}>
                {lang === 'zh' ? '取消' : 'Cancel'}
              </Button>
            </div>
          )}
        </div>

        {/* -- Boundary -- */}
        <div className="space-y-1.5">
          <FieldLabel
            label={boundaryLabel}
            hint={boundaryHint}
          />
          <Textarea
            value={intelligence.autonomyBoundary}
            onChange={(e) => handleChange('autonomyBoundary', e.target.value)}
            placeholder={boundaryHint}
            rows={3}
            className="resize-y"
          />
        </div>

        {/* -- Human Review -- always show with conditional hint */}
        <div className="space-y-1.5">
          <FieldLabel
            label={t('workbench.stepTitles.design.humanReview', lang)}
            hint={humanReviewHint}
          />
          <Textarea
            value={intelligence.humanReview}
            onChange={(e) => handleChange('humanReview', e.target.value)}
            placeholder={humanReviewHint}
            rows={3}
            className="resize-y"
          />
        </div>

        {/* -- Failure Handling -- */}
        <div className="space-y-1.5">
          <FieldLabel
            label={t('workbench.stepTitles.design.failureHandling', lang)}
            hint={t('workbench.stepTitles.design.failureHandlingHint', lang)}
          />
          <Textarea
            value={intelligence.failureHandling}
            onChange={(e) => handleChange('failureHandling', e.target.value)}
            placeholder={t('workbench.stepTitles.design.failureHandlingHint', lang)}
            rows={3}
            className="resize-y"
          />
        </div>

        {/* -- Workflow Preview -- */}
        {showPreview && <WorkflowPreview steps={workflowSteps} lang={lang} />}
      </CardContent>
    </Card>
  );
}
