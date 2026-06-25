import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  WorkbenchProject,
  MetadataFields,
  FramingFields,
  KnowledgeFields,
  IntelligenceFields,
  DeliveryFields,
  Lang,
} from '@/lib/workbench/schema';
import {
  loadProject,
  saveProject,
  clearProject,
  createEmptyProject,
} from '@/lib/workbench/storage';
import { getStepCompletion } from '@/lib/workbench/completion';
import { StepNav } from './StepNav';
import { ProjectHeader } from './ProjectHeader';

// Step components
import { ProductFramingStep } from './ProductFramingStep';
import { WorkflowDesignStep } from './WorkflowDesignStep';
import { EvaluationStep } from './EvaluationStep';
import { OutputStep } from './OutputStep';

// Live preview — created by another agent
import { LivePreviewPanel } from './LivePreviewPanel';

interface WorkbenchShellProps {
  defaultLang?: Lang;
}

export function WorkbenchShell({ defaultLang = 'en' }: WorkbenchShellProps) {
  const [project, setProject] = useState<WorkbenchProject>(createEmptyProject);
  const [currentStep, setCurrentStep] = useState(0);
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [exportLang, setExportLang] = useState<Lang>(defaultLang);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // --- Mount: load from localStorage ---
  useEffect(() => {
    const stored = loadProject();
    if (stored) {
      setProject(stored);
    }
    setLoaded(true);
  }, []);

  // --- Auto-save on project change (after initial load) ---
  useEffect(() => {
    if (!loaded) return;
    saveProject(project);
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [project, loaded]);

  // --- Typed updaters for ProductFramingStep ---
  const updateMetadata = useCallback((fields: Partial<MetadataFields>) => {
    setProject((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, ...fields },
    }));
  }, []);

  const updateFraming = useCallback((fields: Partial<FramingFields>) => {
    setProject((prev) => ({
      ...prev,
      framing: { ...prev.framing, ...fields },
    }));
  }, []);

  const updateKnowledge = useCallback((fields: Partial<KnowledgeFields>) => {
    setProject((prev) => ({
      ...prev,
      knowledge: { ...prev.knowledge, ...fields },
    }));
  }, []);

  const updateIntelligence = useCallback((fields: Partial<IntelligenceFields>) => {
    setProject((prev) => ({
      ...prev,
      intelligence: { ...prev.intelligence, ...fields },
    }));
  }, []);

  const updateDelivery = useCallback((fields: Partial<DeliveryFields>) => {
    setProject((prev) => ({
      ...prev,
      delivery: { ...prev.delivery, ...fields },
    }));
  }, []);

  // --- Generic section updater for WorkflowDesignStep & EvaluationStep ---
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

  // --- Completion ---
  const stepCompletion = useMemo(() => getStepCompletion(project), [project]);

  const totalCompletion = useMemo(
    () => ({
      filled: stepCompletion.reduce((sum, s) => sum + s.filled, 0),
      total: stepCompletion.reduce((sum, s) => sum + s.total, 0),
    }),
    [stepCompletion],
  );

  // --- Has data check ---
  const hasData = useMemo(
    () =>
      Object.values(project).some((section) =>
        Object.values(section).some((v) => typeof v === 'string' && v.trim() !== ''),
      ),
    [project],
  );

  // --- Example loading ---
  const handleExampleSelect = useCallback((example: WorkbenchProject) => {
    setProject(example);
  }, []);

  // --- Reset to blank ---
  const handleReset = useCallback(() => {
    const confirmed = window.confirm(
      lang === 'zh'
        ? '确定要重置为空白项目吗？'
        : 'Reset to a blank project?',
    );
    if (!confirmed) return;
    setProject(createEmptyProject());
  }, [lang]);

  // --- Clear (with localStorage wipe) ---
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

  // --- Download JSON ---
  const handleDownloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = project.metadata.projectName.trim() || 'workbench-project';
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [project]);

  // --- Render active step ---
  const stepComponent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <ProductFramingStep
            project={project}
            onUpdateMetadata={updateMetadata}
            onUpdateFraming={updateFraming}
            onUpdateKnowledge={updateKnowledge}
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
          <OutputStep
            project={project}
            lang={lang}
            exportLang={exportLang}
            onExportLangChange={setExportLang}
          />
        );
      default:
        return null;
    }
  }, [currentStep, project, updateMetadata, updateFraming, updateKnowledge, updateSection, lang, exportLang]);

  // Loading state (replaces SSR guard)
  if (!loaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project header */}
      <ProjectHeader
        project={project}
        lang={lang}
        completion={totalCompletion}
        saved={saved}
        onLoadExample={handleExampleSelect}
        onReset={handleReset}
        onClear={handleClear}
        onDownloadJson={handleDownloadJson}
        hasData={hasData}
      />

      {/* Main area */}
      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-border p-4 overflow-y-auto">
          <StepNav
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            completion={stepCompletion}
            lang={lang}
            vertical
          />
        </aside>

        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
          {/* Mobile step nav */}
          <div className="lg:hidden border-b border-border px-4 py-2">
            <StepNav
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              completion={stepCompletion}
              lang={lang}
            />
          </div>

          {/* Form area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 min-w-0">
            {stepComponent}
          </div>

          {/* Live preview — desktop only */}
          <aside className="hidden lg:block w-96 shrink-0 border-l border-border overflow-y-auto">
            <LivePreviewPanel project={project} currentStep={currentStep} lang={lang} />
          </aside>
        </div>
      </div>
    </div>
  );
}
