import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import type { Lang, SaveState } from '@/lib/workbench/schema';
import { t } from '@/data/translations';

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
        <span>{t('workbench.saveState.saving', lang)}</span>
      </span>
    );
  }

  if (saveState === 'saved') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400" aria-live="polite">
        <Check className="size-3" />
        <span>{t('workbench.saveState.saved', lang)}</span>
      </span>
    );
  }

  // error
  return (
    <span className="inline-flex items-center gap-1 text-xs text-red-400" aria-live="polite">
      <AlertTriangle className="size-3" />
      <span>{t('workbench.saveState.error', lang)}</span>
    </span>
  );
}
