import { useState, useMemo, useCallback } from 'react';
import { Download, FileJson, AlertTriangle, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  generateProductBrief,
  generateWorkflowSpec,
  generateEvaluationPlan,
  generateAcceptanceCriteria,
  generateCodingAgentHandoff,
  generateClaudeStarter,
  generateCombinedPack,
} from '@/lib/workbench/generators';
import { sanitizeFilename } from '@/lib/workbench/filename';
import type { WorkbenchProject, Lang } from '@/lib/workbench/schema';
import { DocumentPreview } from './DocumentPreview';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface OutputStepProps {
  project: WorkbenchProject;
  lang: Lang;
  exportLang: Lang;
  onExportLangChange?: (lang: Lang) => void;
  onNavigateToStep?: (step: number) => void;
}

/* ------------------------------------------------------------------ */
/*  Required fields for validation                                     */
/* ------------------------------------------------------------------ */

const REQUIRED_FIELDS: {
  section: keyof WorkbenchProject;
  key: string;
  labelEn: string;
  labelZh: string;
  step: number;
  stepEn: string;
  stepZh: string;
}[] = [
  { section: 'metadata', key: 'projectName', labelEn: 'Project Name', labelZh: '项目名称', step: 0, stepEn: 'Product Framing', stepZh: '产品定义' },
  { section: 'metadata', key: 'oneLineIdea', labelEn: 'One-Line Idea', labelZh: '一句话想法', step: 0, stepEn: 'Product Framing', stepZh: '产品定义' },
  { section: 'framing', key: 'businessScenario', labelEn: 'Business Scenario', labelZh: '业务场景', step: 0, stepEn: 'Product Framing', stepZh: '产品定义' },
  { section: 'framing', key: 'targetUser', labelEn: 'Target User', labelZh: '目标用户', step: 0, stepEn: 'Product Framing', stepZh: '产品定义' },
  { section: 'framing', key: 'decisionToSupport', labelEn: 'Decision to Support', labelZh: '支持的决策', step: 0, stepEn: 'Product Framing', stepZh: '产品定义' },
  { section: 'intelligence', key: 'aiCapability', labelEn: 'AI Capability', labelZh: 'AI 能力', step: 1, stepEn: 'Workflow Design', stepZh: '工作流设计' },
  { section: 'delivery', key: 'prototypeScope', labelEn: 'Prototype Scope', labelZh: '原型范围', step: 2, stepEn: 'Evaluation', stepZh: '评估方案' },
];

/* ------------------------------------------------------------------ */
/*  Structured project data for AI prompts                             */
/* ------------------------------------------------------------------ */

function buildProjectContext(project: WorkbenchProject, lang: Lang): string {
  const label = (en: string, zh: string) => (lang === 'zh' ? zh : en);

  const sections: string[] = [];

  sections.push(`## ${label('Project Metadata', '项目元数据')}`);
  sections.push(`- **${label('Project Name', '项目名称')}**: ${project.metadata.projectName || '(empty)'}`);
  sections.push(`- **${label('One-Line Idea', '一句话想法')}**: ${project.metadata.oneLineIdea || '(empty)'}`);
  sections.push(`- **${label('Product Type', '产品类型')}**: ${project.metadata.productType || '(empty)'}`);
  sections.push('');

  sections.push(`## ${label('Product Framing', '产品定义')}`);
  const framingMap: [string, keyof WorkbenchProject['framing']][] = [
    [label('Business Scenario', '业务场景'), 'businessScenario'],
    [label('Target User', '目标用户'), 'targetUser'],
    [label('Current Workflow', '当前工作流'), 'currentWorkflow'],
    [label('Decision to Support', '支持的决策'), 'decisionToSupport'],
    [label('Problem Evidence', '问题证据'), 'problemEvidence'],
    [label('Expected Outcome', '预期结果'), 'expectedOutcome'],
  ];
  for (const [lbl, key] of framingMap) {
    sections.push(`- **${lbl}**: ${project.framing[key] || '(empty)'}`);
  }
  sections.push('');

  sections.push(`## ${label('Knowledge', '知识')}`);
  const knowledgeMap: [string, keyof WorkbenchProject['knowledge']][] = [
    [label('Data Sources', '数据来源'), 'dataSources'],
    [label('Knowledge Sources', '知识来源'), 'knowledgeSources'],
    [label('Core Objects', '核心对象'), 'coreObjects'],
    [label('Key Relationships', '关键关系'), 'keyRelationships'],
    [label('Assumptions', '假设'), 'assumptions'],
  ];
  for (const [lbl, key] of knowledgeMap) {
    sections.push(`- **${lbl}**: ${project.knowledge[key] || '(empty)'}`);
  }
  sections.push('');

  sections.push(`## ${label('AI / Agent Layer', 'AI / 智能体层')}`);
  sections.push(`- **${label('AI Capability', 'AI 能力')}**: ${project.intelligence.aiCapability || '(empty)'}`);
  sections.push(`- **${label('Agent Required', '是否需要智能体')}**: ${project.intelligence.agentRequired || '(empty)'}`);
  sections.push(`- **${label('Agent Reasoning', '智能体推理')}**: ${project.intelligence.agentReasoning || '(empty)'}`);
  sections.push(`- **${label('Tools', '工具')}**: ${project.intelligence.tools || '(empty)'}`);
  sections.push(`- **${label('Workflow Steps', '工作流步骤')}**: ${project.intelligence.workflowSteps || '(empty)'}`);
  sections.push(`- **${label('Autonomy Boundary', '自主边界')}**: ${project.intelligence.autonomyBoundary || '(empty)'}`);
  sections.push(`- **${label('Human Review', '人工审核')}**: ${project.intelligence.humanReview || '(empty)'}`);
  sections.push(`- **${label('Failure Handling', '失败处理')}**: ${project.intelligence.failureHandling || '(empty)'}`);
  sections.push('');

  sections.push(`## ${label('Delivery', '交付')}`);
  const deliveryMap: [string, keyof WorkbenchProject['delivery']][] = [
    [label('Prototype Scope', '原型范围'), 'prototypeScope'],
    [label('Non-Goals', '非目标'), 'nonGoals'],
    [label('Evaluation Metrics', '评估指标'), 'evaluationMetrics'],
    [label('Acceptance Criteria', '验收标准'), 'acceptanceCriteria'],
    [label('Production Risks', '生产风险'), 'productionRisks'],
    [label('Dependencies', '依赖'), 'dependencies'],
    [label('Open Questions', '开放问题'), 'openQuestions'],
  ];
  for (const [lbl, key] of deliveryMap) {
    sections.push(`- **${lbl}**: ${project.delivery[key] || '(empty)'}`);
  }

  return sections.join('\n');
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function OutputStep({ project, lang, exportLang, onExportLangChange, onNavigateToStep }: OutputStepProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [reviewCopied, setReviewCopied] = useState(false);
  const [implCopied, setImplCopied] = useState(false);

  /* ---- Generate documents ---- */
  const documents = useMemo(
    () => [
      {
        key: 'brief',
        title: lang === 'zh' ? '产品简报' : 'AI Product Brief',
        content: generateProductBrief(project, exportLang),
      },
      {
        key: 'workflow',
        title:
          lang === 'zh'
            ? '工作流方案'
            : project.intelligence.agentRequired === 'yes'
              ? 'Agent Workflow Specification'
              : 'AI Workflow Specification',
        content: generateWorkflowSpec(project, exportLang),
      },
      {
        key: 'eval',
        title: lang === 'zh' ? '评估计划' : 'Evaluation Plan',
        content: generateEvaluationPlan(project, exportLang),
      },
      {
        key: 'acceptance',
        title: lang === 'zh' ? '验收标准' : 'Acceptance Criteria',
        content: generateAcceptanceCriteria(project, exportLang),
      },
      {
        key: 'handoff',
        title: lang === 'zh' ? '编码智能体交付' : 'Coding Agent Handoff',
        content: generateCodingAgentHandoff(project, exportLang),
      },
      {
        key: 'claude',
        title: 'CLAUDE.md Starter',
        content: generateClaudeStarter(project, exportLang),
      },
    ],
    [project, exportLang, lang],
  );

  /* ---- Missing field validation ---- */
  const missingFields = useMemo(() => {
    return REQUIRED_FIELDS.filter(({ section, key }) => {
      const sectionData = project[section] as Record<string, string>;
      return !sectionData[key]?.trim();
    });
  }, [project]);

  /* ---- Copy handler ---- */
  const handleCopy = useCallback(
    (index: number) => {
      const content = documents[index]?.content ?? '';
      navigator.clipboard.writeText(content).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      });
    },
    [documents],
  );

  /* ---- Download single document ---- */
  const handleDownload = useCallback(
    (index: number) => {
      const doc = documents[index];
      if (!doc) return;
      const blob = new Blob([doc.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = sanitizeFilename(project.metadata.projectName, `-${doc.key}.md`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [documents, project.metadata.projectName],
  );

  /* ---- Download all ---- */
  const handleDownloadAll = useCallback(() => {
    const content = generateCombinedPack(project, exportLang);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sanitizeFilename(project.metadata.projectName, '-ai-pm-pack.md');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [project, exportLang]);

  /* ---- Download JSON ---- */
  const handleDownloadJson = useCallback(() => {
    const content = JSON.stringify(project, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sanitizeFilename(project.metadata.projectName, '-project.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [project]);

  /* ---- AI prompts ---- */
  const reviewPrompt = useMemo(() => {
    const context = buildProjectContext(project, exportLang);
    return `Review the following AI product concept as a senior AI Product Manager.

Identify:
1. unclear assumptions
2. missing user or business context
3. weak workflow boundaries
4. unnecessary use of an agent
5. missing human review points
6. incomplete evaluation metrics
7. prototype scope risks
8. production risks
9. contradictions between sections
10. the five most important questions to resolve next

${context}`;
  }, [project, exportLang]);

  const implementationPrompt = useMemo(() => {
    const context = buildProjectContext(project, exportLang);
    return `Based on the following AI product concept, create a technical implementation plan.

Include:
1. recommended tech stack and architecture
2. data pipeline design
3. AI model selection and integration approach
4. API design outline
5. frontend workflow and UI components
6. testing strategy (unit, integration, end-to-end, AI evaluation)
7. deployment and infrastructure plan
8. phased rollout with milestones
9. risk mitigation for each identified production risk
10. estimated effort and team composition

${context}`;
  }, [project, exportLang]);

  const handleCopyReviewPrompt = useCallback(() => {
    navigator.clipboard.writeText(reviewPrompt).then(() => {
      setReviewCopied(true);
      setTimeout(() => setReviewCopied(false), 2000);
    });
  }, [reviewPrompt]);

  const handleCopyImplementationPrompt = useCallback(() => {
    navigator.clipboard.writeText(implementationPrompt).then(() => {
      setImplCopied(true);
      setTimeout(() => setImplCopied(false), 2000);
    });
  }, [implementationPrompt]);

  return (
    <div className="space-y-6">
      {/* ---- Validation warning ---- */}
      {missingFields.length > 0 && (
        <div className="bg-amber-500/10 ring-1 ring-amber-500/20 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300 m-0">
                {lang === 'zh'
                  ? `${missingFields.length} 个必填区域尚未完成`
                  : `${missingFields.length} required areas are incomplete`}
              </p>
              <ul className="mt-2 space-y-1">
                {missingFields.map((f) => (
                  <li key={`${f.section}.${f.key}`} className="text-xs text-amber-400/80 flex items-center gap-2">
                    <span>{lang === 'zh' ? f.labelZh : f.labelEn}</span>
                    {onNavigateToStep && (
                      <button
                        onClick={() => onNavigateToStep(f.step)}
                        className="text-emerald-400 hover:text-emerald-300 underline text-xs cursor-pointer bg-transparent border-0 p-0"
                      >
                        {lang === 'zh' ? '前往' : 'Go to'} {lang === 'zh' ? f.stepZh : f.stepEn}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---- Document selector + preview ---- */}
      <div className="flex flex-col lg:flex-row gap-0 ring-1 ring-foreground/10 rounded-xl overflow-hidden bg-card">
        {/* Sidebar / Mobile header */}
        <div className="lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-r border-border">
          {/* Mobile: select dropdown */}
          <div className="lg:hidden p-3">
            <select
              className="w-full h-8 rounded-lg bg-input/30 border border-input px-2 text-sm"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
            >
              {documents.map((doc, i) => (
                <option key={doc.key} value={i}>
                  {doc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop: document list */}
          <div className="hidden lg:block p-3 space-y-1">
            {documents.map((doc, i) => (
              <button
                key={doc.key}
                onClick={() => setSelectedIndex(i)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer border-0 ${
                  selectedIndex === i
                    ? 'bg-secondary text-foreground font-medium'
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {doc.title}
              </button>
            ))}
          </div>

          {/* Export controls */}
          <div className="p-3 border-t border-border space-y-3">
            {/* Export language */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {lang === 'zh' ? '导出语言' : 'Export language'}
              </span>
              <Button
                variant={exportLang === 'en' ? 'secondary' : 'ghost'}
                size="xs"
                onClick={() => onExportLangChange?.('en')}
              >
                EN
              </Button>
              <Button
                variant={exportLang === 'zh' ? 'secondary' : 'ghost'}
                size="xs"
                onClick={() => onExportLangChange?.('zh')}
              >
                中
              </Button>
            </div>

            {/* Downloads */}
            <div className="space-y-1.5">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleDownloadAll}>
                <Download className="size-3.5" />
                <span>{lang === 'zh' ? '下载完整包' : 'Download Complete Pack'}</span>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleDownloadJson}>
                <FileJson className="size-3.5" />
                <span>{lang === 'zh' ? '下载 JSON' : 'Download JSON'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 min-w-0">
          {/* Action bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
            <span className="text-sm font-medium text-foreground">
              {documents[selectedIndex]?.title}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <Button variant="ghost" size="xs" onClick={() => handleCopy(selectedIndex)}>
                {copiedIndex === selectedIndex ? (
                  <Check className="size-3" />
                ) : (
                  <Copy className="size-3" />
                )}
                <span>
                  {copiedIndex === selectedIndex
                    ? lang === 'zh' ? '已复制' : 'Copied'
                    : lang === 'zh' ? '复制' : 'Copy'}
                </span>
              </Button>
              <Button variant="ghost" size="xs" onClick={() => handleDownload(selectedIndex)}>
                <Download className="size-3" />
                <span>{lang === 'zh' ? '下载' : 'Download'}</span>
              </Button>
            </div>
          </div>

          {/* Document content */}
          <div className="p-4 lg:p-6 overflow-y-auto max-h-[600px]">
            <DocumentPreview content={documents[selectedIndex]?.content ?? ''} lang={lang} />
          </div>
        </div>
      </div>

      {/* ---- Continue with AI ---- */}
      <div className="ring-1 ring-foreground/10 rounded-xl overflow-hidden bg-card">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Sparkles className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {lang === 'zh' ? '用 AI 继续' : 'Continue with AI'}
          </span>
        </div>
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Button variant="outline" size="sm" className="w-full" onClick={handleCopyReviewPrompt}>
              {reviewCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{lang === 'zh' ? '复制评审 Prompt' : 'Copy Review Prompt'}</span>
            </Button>
            <p className="text-xs text-muted-foreground mt-1.5 m-0">
              {lang === 'zh'
                ? '识别产品缺口、矛盾、缺失边界和评估弱点。'
                : 'Identify product gaps, contradictions, missing boundaries, and evaluation weaknesses.'}
            </p>
          </div>
          <div className="flex-1">
            <Button variant="outline" size="sm" className="w-full" onClick={handleCopyImplementationPrompt}>
              {implCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{lang === 'zh' ? '复制实施 Prompt' : 'Copy Implementation Prompt'}</span>
            </Button>
            <p className="text-xs text-muted-foreground mt-1.5 m-0">
              {lang === 'zh'
                ? '将结构化产品概念转化为分阶段技术实施方案。'
                : 'Turn the structured product concept into a phased technical implementation plan.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
