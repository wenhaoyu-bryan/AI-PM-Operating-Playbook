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
  generateReviewPrompt,
  generateImplementationPrompt,
} from '@/lib/workbench/generators';
import { getMissingRequiredFields, getExportReady } from '@/lib/workbench/fields';
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

  /* ---- Missing field validation (grouped by step) ---- */
  const missingByStep = useMemo(() => getMissingRequiredFields(project, lang), [project, lang]);

  /* ---- Export readiness ---- */
  const exportReady = useMemo(() => getExportReady(project), [project]);

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

  /* ---- AI prompts (from generators) ---- */
  const reviewPrompt = useMemo(
    () => generateReviewPrompt(project, exportLang),
    [project, exportLang],
  );

  const implementationPrompt = useMemo(
    () => generateImplementationPrompt(project, exportLang),
    [project, exportLang],
  );

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
      {/* ---- Validation warning (grouped by step) ---- */}
      {missingByStep.length > 0 && (
        <div className="bg-amber-500/10 ring-1 ring-amber-500/20 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300 m-0">
                {lang === 'zh'
                  ? '以下必填区域尚未完成'
                  : 'The following required areas are incomplete'}
              </p>
              {missingByStep.map((group) => (
                <div key={group.step} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-amber-300">{group.stepLabel}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-amber-400"
                      onClick={() => onNavigateToStep?.(group.step)}
                    >
                      {lang === 'zh' ? '前往填写' : 'Go to step'}
                    </Button>
                  </div>
                  <ul className="text-xs text-amber-400/80 space-y-0.5 ml-2">
                    {group.fields.map((f) => (
                      <li key={f}>- {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- Export readiness + positioning ---- */}
      <div className={`ring-1 rounded-lg p-3 text-sm ${
        exportReady
          ? 'ring-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          : 'ring-amber-500/20 bg-amber-500/10 text-amber-400'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          {exportReady
            ? (lang === 'zh' ? '✅ 可导出' : '✅ Ready to export')
            : (lang === 'zh' ? '⚠️ 尚未就绪' : '⚠️ Not ready')}
        </div>
        <p className="text-xs opacity-80 m-0">
          {lang === 'zh'
            ? '以下文档由确定性模板根据表单内容自动生成，旨在作为初始产物供 PM 与团队校对迭代，而非最终交付件。'
            : 'The following documents are generated deterministically from your form inputs. They are intended as starter artifacts for PM review and team iteration — not final deliverables.'}
        </p>
      </div>

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
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
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
                aria-pressed={exportLang === 'en'}
                onClick={() => onExportLangChange?.('en')}
              >
                EN
              </Button>
              <Button
                variant={exportLang === 'zh' ? 'secondary' : 'ghost'}
                size="xs"
                aria-pressed={exportLang === 'zh'}
                onClick={() => onExportLangChange?.('zh')}
              >
                中
              </Button>
            </div>

            {/* Downloads */}
            <div className="space-y-1.5">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleDownloadAll}>
                <Download className="size-3.5" />
                <span>{lang === 'zh' ? '下载完整包 (.md)' : 'Download Complete Pack (.md)'}</span>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => {
                const content = documents.map(d => `# ${d.title}\n\n${d.content}`).join('\n\n---\n\n');
                navigator.clipboard.writeText(content);
                // brief feedback via a temporary element would be ideal, but just copy works
              }}>
                <Copy className="size-3.5" />
                <span>{lang === 'zh' ? '复制完整包' : 'Copy Full Pack'}</span>
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
