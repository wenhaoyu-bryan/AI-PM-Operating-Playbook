import { useState, useMemo, useCallback } from 'react';
import { Languages, Download, FileJson, AlertTriangle, Copy, Check, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
}

/* ------------------------------------------------------------------ */
/*  Required fields for validation                                     */
/* ------------------------------------------------------------------ */

const REQUIRED_FIELDS: {
  section: keyof WorkbenchProject;
  key: string;
  labelEn: string;
  labelZh: string;
}[] = [
  { section: 'metadata', key: 'projectName', labelEn: 'Project Name', labelZh: '项目名称' },
  { section: 'metadata', key: 'oneLineIdea', labelEn: 'One-Line Idea', labelZh: '一句话想法' },
  { section: 'framing', key: 'businessScenario', labelEn: 'Business Scenario', labelZh: '业务场景' },
  { section: 'framing', key: 'targetUser', labelEn: 'Target User', labelZh: '目标用户' },
  { section: 'framing', key: 'decisionToSupport', labelEn: 'Decision to Support', labelZh: '支持的决策' },
  { section: 'intelligence', key: 'aiCapability', labelEn: 'AI Capability', labelZh: 'AI 能力' },
  { section: 'delivery', key: 'prototypeScope', labelEn: 'Prototype Scope', labelZh: '原型范围' },
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

export function OutputStep({ project, lang, exportLang, onExportLangChange }: OutputStepProps) {
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

  /* ---- Labels ---- */
  const labels = {
    downloadAll: lang === 'zh' ? '下载全部' : 'Download All',
    downloadJson: lang === 'zh' ? '下载 JSON' : 'Download JSON',
    missingTitle: lang === 'zh' ? '部分必填字段尚未填写' : 'Some required fields are missing.',
    missingHint: lang === 'zh'
      ? '生成的文档可能不完整。'
      : 'Generated documents may be incomplete.',
    continueTitle: lang === 'zh' ? '用 AI 继续' : 'Continue with AI',
    reviewPromptLabel: lang === 'zh' ? '复制评审 Prompt' : 'Copy Review Prompt',
    implPromptLabel: lang === 'zh' ? '复制实施 Prompt' : 'Copy Implementation Prompt',
  };

  return (
    <div className="space-y-6">
      {/* ---- Top bar ---- */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Export language toggle */}
        <div className="flex items-center gap-1.5">
          <Languages className="size-3.5 text-muted-foreground" />
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

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="xs" onClick={handleDownloadAll}>
            <Download className="size-3" />
            <span>{labels.downloadAll}</span>
          </Button>
          <Button variant="outline" size="xs" onClick={handleDownloadJson}>
            <FileJson className="size-3" />
            <span>{labels.downloadJson}</span>
          </Button>
        </div>
      </div>

      {/* ---- Validation warning ---- */}
      {missingFields.length > 0 && (
        <div className="bg-amber-500/10 ring-1 ring-amber-500/20 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-300 m-0">
              {labels.missingTitle}
            </p>
            <p className="text-xs text-amber-400/80 m-0">
              {labels.missingHint}
            </p>
            <ul className="text-xs text-amber-400/80 m-0 mt-1 space-y-0.5 list-disc pl-4">
              {missingFields.map((f) => (
                <li key={`${f.section}.${f.key}`}>
                  {lang === 'zh' ? f.labelZh : f.labelEn}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ---- Document tabs ---- */}
      <Tabs defaultValue={documents[0]?.key}>
        <TabsList variant="line">
          {documents.map((doc) => (
            <TabsTrigger key={doc.key} value={doc.key}>
              {doc.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {documents.map((doc, index) => (
          <TabsContent key={doc.key} value={doc.key}>
            <DocumentPreview
              content={doc.content}
              title={doc.title}
              copied={copiedIndex === index}
              lang={lang}
              onCopy={() => handleCopy(index)}
              onDownload={() => handleDownload(index)}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* ---- Continue with AI ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4" />
            {labels.continueTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={handleCopyReviewPrompt}>
              {reviewCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{labels.reviewPromptLabel}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyImplementationPrompt}>
              {implCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{labels.implPromptLabel}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
