import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lang } from '@/lib/workbench/schema';
import { t } from '@/data/translations';

const STEP_KEYS = ['framing', 'design', 'evaluate', 'export'] as const;

interface StepNavProps {
  currentStep: number;
  onStepChange: (n: number) => void;
  completion: boolean[];
  lang: Lang;
}

export function StepNav({
  currentStep,
  onStepChange,
  completion,
  lang,
}: StepNavProps) {
  return (
    <nav
      className="bg-card rounded-xl p-4 ring-1 ring-foreground/10"
      aria-label="Workbench steps"
    >
      <ol className="flex items-center gap-1 overflow-x-auto sm:gap-0">
        {STEP_KEYS.map((key, index) => {
          const isComplete = completion[index];
          const isCurrent = index === currentStep;

          return (
            <li key={key} className="flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => onStepChange(index)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors',
                  'hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  isCurrent && !isComplete && 'text-emerald-400',
                  isComplete && 'text-emerald-400',
                  !isCurrent && !isComplete && 'text-muted-foreground',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step circle */}
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                    isComplete &&
                      'bg-emerald-400 text-emerald-950',
                    isCurrent &&
                      !isComplete &&
                      'ring-2 ring-emerald-400 text-emerald-400',
                    !isCurrent &&
                      !isComplete &&
                      'bg-muted text-muted-foreground',
                  )}
                >
                  {isComplete ? (
                    <Check className="size-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>

                {/* Step label */}
                <span className="hidden sm:inline whitespace-nowrap">
                  {t(`workbench.steps.${key}`, lang)}
                </span>
              </button>

              {/* Connecting line between steps */}
              {index < STEP_KEYS.length - 1 && (
                <div
                  className={cn(
                    'mx-1 h-px w-6 shrink-0 sm:w-10 transition-colors',
                    isComplete ? 'bg-emerald-400' : 'bg-muted',
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
