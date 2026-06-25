import { cn } from '@/lib/utils';
import type { Lang } from '@/lib/workbench/schema';
import type { StepCompletion } from '@/lib/workbench/completion';
import { t } from '@/data/translations';

const STEP_KEYS = ['framing', 'design', 'evaluate', 'export'] as const;

interface StepNavProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  completion: StepCompletion[];
  lang: Lang;
  vertical?: boolean;
}

const STATUS_COLORS: Record<StepCompletion['status'], string> = {
  'not-started': 'bg-muted',
  'in-progress': 'bg-amber-400',
  'ready': 'bg-emerald-400',
};

const STATUS_TEXT_COLORS: Record<StepCompletion['status'], string> = {
  'not-started': 'text-muted-foreground',
  'in-progress': 'text-amber-500',
  'ready': 'text-emerald-500',
};

export function StepNav({
  currentStep,
  onStepChange,
  completion,
  lang,
  vertical = false,
}: StepNavProps) {
  return (
    <nav aria-label="Workbench steps">
      <ol
        className={cn(
          'flex gap-1',
          vertical ? 'flex-col' : 'flex-row items-center overflow-x-auto',
        )}
      >
        {STEP_KEYS.map((key, index) => {
          const comp = completion[index];
          const isCurrent = index === currentStep;

          return (
            <li key={key} className="flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => onStepChange(index)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors w-full text-left',
                  'hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  isCurrent
                    ? 'bg-muted/60 text-foreground font-medium'
                    : STATUS_TEXT_COLORS[comp.status],
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step number / status dot */}
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium transition-colors',
                    isCurrent
                      ? 'ring-2 ring-foreground/20 text-foreground'
                      : cn(STATUS_COLORS[comp.status], comp.status === 'ready' ? 'text-emerald-950' : 'text-muted-foreground'),
                  )}
                >
                  {index + 1}
                </span>

                {/* Step label */}
                <span className={cn('flex-1', vertical ? '' : 'whitespace-nowrap')}>
                  {t(`workbench.stepLabels.${key}`, lang)}
                </span>

                {/* Field count */}
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {comp.filled}/{comp.total}
                </span>
              </button>

              {/* Connecting line between steps (horizontal mode) */}
              {!vertical && index < STEP_KEYS.length - 1 && (
                <div
                  className={cn(
                    'mx-0.5 h-px w-4 shrink-0 transition-colors',
                    comp.status === 'ready' ? 'bg-emerald-400' : 'bg-muted',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
