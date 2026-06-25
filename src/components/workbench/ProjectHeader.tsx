import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Download, Upload, FilePlus, Check } from 'lucide-react';
import { t } from '@/data/translations';
import ExampleSelector from './ExampleSelector';
import { getLocalizedProductType } from '@/lib/workbench/schema';
import type { WorkbenchProject, Lang } from '@/lib/workbench/schema';

interface ProjectHeaderProps {
  project: WorkbenchProject;
  lang: Lang;
  completion: { filled: number; total: number };
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  onLoadExample: (project: WorkbenchProject) => void;
  onNewProject: () => void;
  onDownloadJson: () => void;
  onImportJSON?: (jsonString: string) => void;
  hasData: boolean;
}

export function ProjectHeader({
  project,
  lang,
  completion,
  saveState,
  onLoadExample,
  onNewProject,
  onDownloadJson,
  onImportJSON,
  hasData,
}: ProjectHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text !== 'string') return;
        onImportJSON?.(text);
      };
      reader.readAsText(file);
      // Reset input so same file can be re-selected
      e.target.value = '';
    },
    [onImportJSON],
  );

  const projectName = project.metadata.projectName.trim();
  const displayName = projectName || t('workbench.projectHeader.untitled', lang);
  const productType = project.metadata.productType;

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2.5 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-sm font-semibold truncate max-w-[200px] sm:max-w-[320px]">
          {displayName}
        </h1>
        {productType && (
          <Badge variant="secondary" className="hidden sm:inline-flex text-[11px]">
            {getLocalizedProductType(productType, lang)}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1.5">
          <span className="tabular-nums">{completion.filled} of {completion.total}</span>
          <span>{lang === 'zh' ? '个规划字段已完成' : 'planning fields completed'}</span>
          {saveState === 'saving' && (
            <span className="text-muted-foreground ml-1">
              {lang === 'zh' ? '正在保存…' : 'Saving…'}
            </span>
          )}
          {saveState === 'saved' && (
            <span className="text-emerald-500 ml-1 inline-flex items-center gap-0.5">
              <Check className="size-3" />
              {lang === 'zh' ? '已保存到本地' : 'Saved locally'}
            </span>
          )}
          {saveState === 'error' && (
            <span className="text-destructive ml-1">
              {lang === 'zh' ? '无法保存' : 'Could not save'}
            </span>
          )}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Visible actions */}
        <ExampleSelector lang={lang} onSelect={onLoadExample} hasData={hasData} />

        <Button
          variant="outline"
          size="xs"
          onClick={handleImport}
        >
          <Upload className="size-3" />
          <span className="hidden lg:inline">{lang === 'zh' ? '导入 JSON' : 'Import JSON'}</span>
        </Button>

        <Button
          variant="outline"
          size="xs"
          onClick={onNewProject}
        >
          <FilePlus className="size-3" />
          <span className="hidden lg:inline">{lang === 'zh' ? '新建项目' : 'New Project'}</span>
        </Button>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />

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
                  onDownloadJson();
                  setMenuOpen(false);
                }}
              >
                <Download className="size-3.5" />
                {t('workbench.projectHeader.downloadJson', lang)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
