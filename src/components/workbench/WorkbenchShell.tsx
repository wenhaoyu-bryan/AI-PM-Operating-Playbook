import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  WorkbenchProject,
  MetadataFields,
  FramingFields,
  KnowledgeFields,
  IntelligenceFields,
  DeliveryFields,
  Lang,
  SaveState,
} from '@/lib/workbench/schema';
import {
  loadProject,
  saveProject,
  clearProject,
  createEmptyProject,
  parseImportedJSON,
} from '@/lib/workbench/storage';
import { getStepCompletion } from '@/lib/workbench/completion';
import { isProjectBlank, getTotalCompletion } from '@/lib/workbench/fields';
import { getExampleByKey } from '@/lib/workbench/examples';
import { Button } from '@/components/ui/button';
import { StepNav } from './StepNav';
import { ProjectHeader } from './ProjectHeader';

// Step components
import { ProductFramingStep } from './ProductFramingStep';
import { WorkflowDesignStep } from './WorkflowDesignStep';
import { EvaluationStep } from './EvaluationStep';
import { OutputStep } from './OutputStep';

import { LivePreviewPanel } from './LivePreviewPanel';

interface WorkbenchShellProps {
  defaultLang?: Lang;
}

export function WorkbenchShell({ defaultLang = 'en' }: WorkbenchShellProps) {
  const [project, setProject] = useState<WorkbenchProject>(createEmptyProject);
  const [currentStep, setCurrentStep] = useState(0);
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [exportLang, setExportLang] = useState<Lang>(defaultLang);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [loaded, setLoaded] = useState(false);
  const [pendingExample, setPendingExample] = useState<WorkbenchProject | null>(null);

  // --- Mount: load from localStorage ---
  useEffect(() => {
    const stored = loadProject();
    if (stored) {
      setProject(stored);
    }
    setLoaded(true);
  }, []);

  // --- Consume sessionStorage example on mount ---
  useEffect(() => {
    if (!loaded) return;
    const pendingKey = sessionStorage.getItem('ai-pm-load-example');
    if (!pendingKey) return;
    sessionStorage.removeItem('ai-pm-load-example');

    const example = getExampleByKey(pendingKey);
    if (!example) return; // invalid key, fail gracefully

    if (isProjectBlank(project)) {
      // Blank project — load directly
      setProject(example);
    } else {
      // Has data — store as pending, show confirmation
      setPendingExample(example);
    }
  }, [loaded]); // intentionally only runs on load

  // --- Auto-save on project change (after initial load) ---
  useEffect(() => {
    if (!loaded) return;
    setSaveState('saving');
    const success = saveProject(project);
    setSaveState(success ? 'saved' : 'error');
    if (success) {
      const timer = setTimeout(() => setSaveState('idle'), 2000);
      return () => clearTimeout(timer);
    }
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
          ...(prev[section as keyof WorkbenchProject] as unknown as Record<string, string>),
          ...fields,
        },
      }));
    },
    [],
  );

  // --- Completion ---
  const stepCompletion = useMemo(() => getStepCompletion(project), [project]);

  const totalCompletion = useMemo(() => getTotalCompletion(project), [project]);

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

  // --- New Project (combined reset + clear) ---
  const handleNewProject = useCallback(() => {
    if (hasData) {
      const confirmed = window.confirm(
        lang === 'zh'
          ? '当前项目将被替换。建议先下载 JSON 备份。是否继续？'
          : 'Current project will be replaced. Consider downloading a JSON backup first. Continue?',
      );
      if (!confirmed) return;
    }
    clearProject();
    setProject(createEmptyProject());
    setCurrentStep(0);
  }, [hasData, lang]);

  // --- Import JSON ---
  const handleImportJSON = useCallback((jsonString: string) => {
    const result = parseImportedJSON(jsonString);
    if (!result.success) {
      window.alert(lang === 'zh' ? `导入失败：${result.error}` : `Import failed: ${result.error}`);
      return;
    }
    if (hasData) {
      const confirmed = window.confirm(
        lang === 'zh'
          ? '当前项目将被替换。是否继续导入？'
          : 'Current project will be replaced. Continue with import?',
      );
      if (!confirmed) return;
    }
    setProject(result.project);
    setCurrentStep(0);
  }, [hasData, lang]);

  // --- Export JSON (wrapped format with schema version) ---
  const handleExportJson = useCallback(() => {
    const wrapped = { schemaVersion: 1 as const, project };
    const blob = new Blob([JSON.stringify(wrapped, null, 2)], {
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
            onNavigateToStep={(step) => {
              setCurrentStep(step);
              const formArea = document.querySelector('.flex-1.overflow-y-auto');
              formArea?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );
      default:
        return null;
    }
  }, [currentStep, project, updateMetadata, updateFraming, updateKnowledge, updateSection, lang, exportLang]);

  // Loading state
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
        saveState={saveState}
        onLoadExample={handleExampleSelect}
        onNewProject={handleNewProject}
        onDownloadJson={handleExportJson}
        onImportJSON={handleImportJSON}
        hasData={hasData}
      />

      {/* Pending example confirmation banner */}
      {pendingExample && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mx-4 mt-3">
          <p className="text-sm text-amber-300 font-medium mb-2">
            {lang === 'zh' ? '检测到从示例页面跳转' : 'Example loaded from previous page'}
          </p>
          <p className="text-xs text-amber-400/80 mb-3">
            {lang === 'zh'
              ? '当前项目数据将被替换。是否加载示例？'
              : 'Your current project will be replaced. Load this example?'}
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white" onClick={() => {
              setProject(pendingExample);
              setPendingExample(null);
            }}>
              {lang === 'zh' ? '确认加载' : 'Load Example'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPendingExample(null)}>
              {lang === 'zh' ? '取消' : 'Cancel'}
            </Button>
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-border p-4 overflow-y-auto">
          <StepNav
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            completion={stepCompletion}
            lang={lang}
            project={project}
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
              project={project}
            />
          </div>

          {/* Form area — full width on Export step */}
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 min-w-0 ${currentStep === 3 ? 'lg:max-w-none' : ''}`}>
            {stepComponent}
          </div>

          {/* Live preview — desktop only, hidden on Export */}
          {currentStep !== 3 && (
            <aside className="hidden lg:block w-96 shrink-0 border-l border-border overflow-y-auto">
              <LivePreviewPanel project={project} currentStep={currentStep} lang={lang} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
