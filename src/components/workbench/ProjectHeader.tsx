import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Download, RotateCcw, Trash2 } from 'lucide-react';
import { t } from '@/data/translations';
import ExampleSelector from './ExampleSelector';
import type { WorkbenchProject, Lang } from '@/lib/workbench/schema';

interface ProjectHeaderProps {
  project: WorkbenchProject;
  lang: Lang;
  completion: { filled: number; total: number };
  saved: boolean;
  onLoadExample: (example: WorkbenchProject) => void;
  onReset: () => void;
  onClear: () => void;
  onDownloadJson: () => void;
  hasData: boolean;
}

export function ProjectHeader({
  project,
  lang,
  completion,
  saved,
  onLoadExample,
  onReset,
  onClear,
  onDownloadJson,
  hasData,
}: ProjectHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const projectName = project.metadata.projectName.trim();
  const displayName = projectName || t('workbench.projectHeader.untitled', lang);
  const productType = project.metadata.productType;

  const typeLabels: Record<string, Record<Lang, string>> = {
    agent: { en: 'Agent', zh: '智能体' },
    rag: { en: 'RAG', zh: 'RAG' },
    'content-generation': { en: 'Content Gen', zh: '内容生成' },
    classification: { en: 'Classification', zh: '分类模型' },
    'ontology-knowledge': { en: 'Ontology', zh: '本体/知识图谱' },
    'workflow-automation': { en: 'Workflow', zh: '工作流自动化' },
    other: { en: 'Other', zh: '其他' },
  };

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2.5 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[320px]">
          {displayName}
        </h1>
        {productType && (
          <Badge variant="secondary" className="hidden sm:inline-flex text-[11px]">
            {typeLabels[productType]?.[lang] ?? productType}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1.5">
          <span className="tabular-nums">{completion.filled}/{completion.total}</span>
          <span>{t('workbench.projectHeader.fieldsComplete', lang)}</span>
          {saved && (
            <span className="text-emerald-500 ml-1">{t('workbench.labels.savedLocally', lang)}</span>
          )}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        <ExampleSelector lang={lang} onSelect={onLoadExample} hasData={hasData} />
        <Button
          variant="outline"
          size="xs"
          onClick={onDownloadJson}
        >
          <Download className="size-3" />
          <span className="hidden sm:inline">{t('workbench.projectHeader.downloadJson', lang)}</span>
        </Button>

        {/* More menu */}
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={t('workbench.projectHeader.moreActions', lang)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <MoreHorizontal className="size-4" />
          </Button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-lg border border-border bg-popover p-1 shadow-lg"
            >
              <button
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => {
                  onReset();
                  setMenuOpen(false);
                }}
              >
                <RotateCcw className="size-3.5" />
                {t('workbench.projectHeader.resetToBlank', lang)}
              </button>
              <button
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => {
                  onClear();
                  setMenuOpen(false);
                }}
              >
                <Trash2 className="size-3.5" />
                {t('workbench.buttons.clearProject', lang)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
