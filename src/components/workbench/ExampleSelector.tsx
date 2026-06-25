import { useState, useCallback, useEffect } from 'react';
import { X, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EXAMPLES } from '@/data/examples';
import { t } from '@/data/translations';
import { createEmptyProject } from '@/lib/workbench/storage';
import type { WorkbenchProject, Lang } from '@/lib/workbench/schema';

const EXAMPLE_META: Record<string, { tag: Record<Lang, string>; scenario: Record<Lang, string>; challenge: Record<Lang, string> }> = {
  'prompt-to-ontology': {
    tag: { en: 'Ontology / Knowledge', zh: '本体/知识' },
    scenario: { en: 'Knowledge Management', zh: '知识管理' },
    challenge: { en: 'Transform messy business terminology into structured ontology assets.', zh: '将杂乱的业务术语转化为结构化的本体资产。' },
  },
  'industrial-agent': {
    tag: { en: 'Agent', zh: '智能体' },
    scenario: { en: 'Industrial AI', zh: '工业 AI' },
    challenge: { en: 'Combine evidence from multiple systems while keeping high-impact actions under human control.', zh: '整合多系统证据，同时将高影响操作置于人工控制之下。' },
  },
  'rag-assistant': {
    tag: { en: 'RAG', zh: 'RAG' },
    scenario: { en: 'Enterprise Knowledge', zh: '企业知识' },
    challenge: { en: 'Help employees find accurate answers without surfacing sensitive or outdated content.', zh: '帮助员工找到准确答案，同时避免暴露敏感或过时内容。' },
  },
};

interface ExampleSelectorProps {
  onSelect: (project: WorkbenchProject) => void;
  lang: Lang;
  hasData: boolean;
}

export default function ExampleSelector({ onSelect, lang, hasData }: ExampleSelectorProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<WorkbenchProject | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setPending(null); setOpen(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const handleSelect = useCallback((project: WorkbenchProject) => {
    if (hasData && !pending) {
      setPending(project);
      return;
    }
    onSelect(project);
    setPending(null);
    setOpen(false);
  }, [hasData, pending, onSelect]);

  return (
    <>
      {/* Trigger */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-[11px] px-2.5 gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Sparkles className="size-3.5" />
        {lang === 'zh' ? '加载示例' : 'Load Example'}
      </Button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-lg bg-card ring-1 ring-foreground/10 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">
                {lang === 'zh' ? '选择示例项目' : 'Choose an Example Project'}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {/* Inline confirmation */}
              {pending ? (
                <div className="p-4 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20 space-y-3">
                  <p className="text-sm text-amber-300 font-medium m-0">
                    {lang === 'zh' ? '当前项目数据将被覆盖' : 'Your current project data will be replaced'}
                  </p>
                  <p className="text-xs text-amber-400/80 m-0">
                    {lang === 'zh'
                      ? '此操作不可撤销。确定要加载示例吗？'
                      : 'This cannot be undone. Load the example anyway?'}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-500 text-white"
                      onClick={() => handleSelect(pending)}
                    >
                      {lang === 'zh' ? '确认加载' : 'Load Example'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPending(null)}
                    >
                      {lang === 'zh' ? '取消' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              ) : (
                EXAMPLES.map((example) => {
                  const meta = EXAMPLE_META[example.key];
                  return (
                    <button
                      key={example.key}
                      onClick={() => handleSelect(example.project)}
                      className="w-full text-left p-3.5 rounded-lg ring-1 ring-foreground/8 hover:ring-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-medium text-foreground group-hover:text-emerald-400 transition-colors">
                              {example.label[lang]}
                            </span>
                          </div>
                          {meta && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
                                {meta.tag[lang]}
                              </span>
                              <span className="text-[10px] text-muted-foreground">&middot;</span>
                              <span className="text-[10px] text-muted-foreground">
                                {meta.scenario[lang]}
                              </span>
                            </div>
                          )}
                          {meta && (
                            <p className="text-xs text-muted-foreground leading-relaxed m-0">
                              {meta.challenge[lang]}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-emerald-400 transition-colors mt-0.5" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleSelect(createEmptyProject())}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="size-3" />
                  {t('workbench.buttons.startBlank', lang)}
                </button>
                <span className="text-[10px] text-muted-foreground">
                  {lang === 'zh' ? '加载示例将覆盖当前数据' : 'Loading an example replaces current data'}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground/70 mt-2 pt-2 border-t border-border">
                {lang === 'zh'
                  ? '以下为使用模拟假设构建的示例。真实项目中的指标与目标需要另行验证。'
                  : 'Illustrative examples using simulated assumptions. Metrics and targets must be validated for each real project.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
