import { Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EXAMPLES } from '@/data/examples';
import { t } from '@/data/translations';
import { createEmptyProject } from '@/lib/workbench/storage';
import type { WorkbenchProject, Lang } from '@/lib/workbench/schema';

interface ExampleSelectorProps {
  onSelect: (project: WorkbenchProject) => void;
  lang: Lang;
  hasData: boolean;
}

export default function ExampleSelector({ onSelect, lang, hasData }: ExampleSelectorProps) {
  const handleClick = (project: WorkbenchProject) => {
    if (hasData) {
      const confirmed = window.confirm(t('examples.confirmLoad', lang));
      if (!confirmed) return;
    }
    onSelect(project);
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[11px] text-muted-foreground">
        {lang === 'zh' ? '示例:' : 'Examples:'}
      </span>
      {EXAMPLES.map((example) => (
        <Button
          key={example.key}
          variant="outline"
          size="sm"
          className="h-7 text-[11px] px-2.5"
          onClick={() => handleClick(example.project)}
        >
          <Sparkles className="size-3.5" />
          {example.label[lang]}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-[11px] px-2.5"
        onClick={() => handleClick(createEmptyProject())}
      >
        <RotateCcw className="size-3.5" />
        {t('workbench.buttons.startBlank', lang)}
      </Button>
    </div>
  );
}
