import { Check } from 'lucide-react';
import type { Lang } from '@/lib/workbench/schema';
import { t } from '@/data/translations';

interface SaveIndicatorProps {
  saved: boolean;
  lang: Lang;
}

export function SaveIndicator({ saved, lang }: SaveIndicatorProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs transition-opacity duration-300"
      style={{ opacity: saved ? 1 : 0 }}
      aria-live="polite"
    >
      {saved ? (
        <>
          <Check className="size-3 text-emerald-400" />
          <span className="text-emerald-400">
            {t('workbench.labels.savedLocally', lang)}
          </span>
        </>
      ) : (
        <span className="invisible">&nbsp;</span>
      )}
    </span>
  );
}
