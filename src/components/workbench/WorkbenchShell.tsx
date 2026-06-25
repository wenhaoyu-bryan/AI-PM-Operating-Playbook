import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Languages } from 'lucide-react';
import type {
  WorkbenchProject,
  MetadataFields,
  Lang,
} from '@/lib/workbench/schema';
import {
  loadProject,
  saveProject,
  clearProject,
  createEmptyProject,
} from '@/lib/workbench/storage';
import { t } from '@/data/translations';
import { SaveIndicator } from './SaveIndicator';
import { StepNav } from './StepNav';

// Step components — to be implemented separately
import { ProductFramingStep } from './ProductFramingStep';
import { WorkflowDesignStep } from './WorkflowDesignStep';
import { EvaluationStep } from './EvaluationStep';
import { OutputStep } from './OutputStep';

interface Example {
  id: string;
  label: string;
  project: WorkbenchProject;
}

interface WorkbenchShellProps {
  defaultLang?: Lang;
}

import ExampleSelector from './ExampleSelector';

export function WorkbenchShell({ defaultLang = 'en' }: WorkbenchShellProps) {
  const [project, setProject] = useState<WorkbenchProject>(createEmptyProject);
  const [currentStep, setCurrentStep] = useState(0);
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [exportLang, setExportLang] = useState<Lang>(defaultLang);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --- Mount: load from localStorage ---
  useEffect(() => {
    const stored = loadProject();
    if (stored) {
      setProject(stored);
    }
    setMounted(true);
  }, []);

  // --- Auto-save on project change (after mount) ---
  useEffect(() => {
    if (!mounted) return;
    saveProject(project);
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [project, mounted]);

  // --- Section updater ---
  const updateSection = useCallback(
    (section: string, fields: Record<string, string>) => {
      setProject((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof WorkbenchProject] as Record<string, string>),
          ...fields,
        },
      }));
    },
    [],
  );

  // --- Metadata updater ---
  const updateMetadata = useCallback(
    (fields: Partial<MetadataFields>) => {
      setProject((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, ...fields },
      }));
    },
    [],
  );

  // --- Check if project has data ---
  const hasData = useMemo(() =>
    Object.values(project).some((section) =>
      Object.values(section).some((v) => typeof v === 'string' && v.trim() !== ''),
    ), [project]);

  // --- Example loading (confirm handled by ExampleSelector) ---
  const handleExampleSelect = useCallback(
    (example: WorkbenchProject) => {
      setProject(example);
    },
    [],
  );

  // --- Clear ---
  const handleClear = useCallback(() => {
    const confirmed = window.confirm(
      lang === 'zh'
        ? '确定要清空当前项目吗？此操作不可撤销。'
        : 'Clear the current project? This cannot be undone.',
    );
    if (!confirmed) return;
    clearProject();
    setProject(createEmptyProject());
  }, [lang]);

  // --- Completion status ---
  const completion = useMemo<boolean[]>(() => {
    const { metadata, framing, intelligence, delivery } = project;
    return [
      // Step 0: Product Framing
      !!(
        metadata.projectName.trim() &&
        framing.businessScenario.trim() &&
        framing.targetUser.trim()
      ),
      // Step 1: Workflow Design
      !!intelligence.aiCapability.trim(),
      // Step 2: Evaluation
      !!delivery.prototypeScope.trim(),
      // Step 3: Output (always complete)
      true,
    ];
  }, [project]);

  // --- Render active step ---
  const stepComponent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <ProductFramingStep
            project={project}
            updateSection={updateSection}
            updateMetadata={updateMetadata}
            lang={lang}
          />
        );
      case 1:
        return (
          <WorkflowDesignStep
            project={project}
            updateSection={updateSection}
            lang={lang}
          />
        );
      case 2:
        return (
          <EvaluationStep
            project={project}
            updateSection={updateSection}
            lang={lang}
          />
        );
      case 3:
        return (
          <OutputStep project={project} lang={lang} exportLang={exportLang} onExportLangChange={setExportLang} />
        );
      default:
        return null;
    }
  }, [currentStep, project, updateSection, updateMetadata, lang, exportLang]);

  // SSR guard
  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        <SaveIndicator saved={saved} lang={lang} />

        <ExampleSelector lang={lang} onSelect={handleExampleSelect} hasData={hasData} />

        <Button
          variant="destructive"
          size="xs"
          onClick={handleClear}
          aria-label={t('workbench.buttons.clearProject', lang)}
        >
          <Trash2 className="size-3" />
          <span>{t('workbench.buttons.clearProject', lang)}</span>
        </Button>

        {/* Export language toggle */}
        <div className="ml-auto flex items-center gap-1.5">
          <Languages className="size-3.5 text-muted-foreground" />
          <Button
            variant={exportLang === 'en' ? 'secondary' : 'ghost'}
            size="xs"
            onClick={() => setExportLang('en')}
          >
            EN
          </Button>
          <Button
            variant={exportLang === 'zh' ? 'secondary' : 'ghost'}
            size="xs"
            onClick={() => setExportLang('zh')}
          >
            中
          </Button>
        </div>
      </div>

      {/* Step navigation */}
      <StepNav
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        completion={completion}
        lang={lang}
      />

      {/* Active step */}
      <div>{stepComponent}</div>
    </div>
  );
}
