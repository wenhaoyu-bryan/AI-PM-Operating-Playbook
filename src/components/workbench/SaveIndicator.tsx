import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import type { Lang } from '@/lib/workbench/schema';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface SaveIndicatorProps {
  saveState: SaveState;
  lang: Lang;
}

export function SaveIndicator({ saveState, lang }: SaveIndicatorProps) {
  if (saveState === 'idle') {
    return <span className="inline-flex items-center gap-1 text-xs opacity-0" aria-hidden="true">&nbsp;</span>;
  }

  if (saveState === 'saving') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
        <Loader2 className="size-3 animate-spin" />
        <span>{lang === 'zh' ? '正在保存...' : 'Saving...'}</span>
      </span>
    );
  }

  if (saveState === 'saved') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400" aria-live="polite">
        <Check className="size-3" />
        <span>{lang === 'zh' ? '已保存到本地' : 'Saved locally'}</span>
      </span>
    );
  }

  // error
  return (
    <span className="inline-flex items-center gap-1 text-xs text-red-400" aria-live="polite">
      <AlertTriangle className="size-3" />
      <span>{lang === 'zh' ? '无法保存到本地' : 'Could not save locally'}</span>
    </span>
  );
}
