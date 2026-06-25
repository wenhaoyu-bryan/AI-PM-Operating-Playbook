import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Copy, Download, ChevronDown, RotateCcw, Sparkles, Languages, Check } from 'lucide-react';

interface Dimension {
  key: string;
  label: { en: string; zh: string };
  hint: { en: string; zh: string };
  group: 'context' | 'knowledge' | 'ai' | 'delivery';
}

const DIMENSIONS: Dimension[] = [
  { key: 'businessScenario', label: { en: 'Business Scenario', zh: '业务场景' }, hint: { en: 'What business context does this product operate in?', zh: '这个产品在什么业务场景下运作？' }, group: 'context' },
  { key: 'userOperator', label: { en: 'User / Operator', zh: '用户/运营者' }, hint: { en: 'Who uses this? Who operates or maintains it?', zh: '谁在用？谁在运营或维护？' }, group: 'context' },
  { key: 'decisionToSupport', label: { en: 'Decision to Support', zh: '支持的决策' }, hint: { en: 'What decision does this product help the user make?', zh: '这个产品帮用户做什么决策？' }, group: 'context' },
  { key: 'dataSources', label: { en: 'Data / Knowledge Sources', zh: '数据/知识来源' }, hint: { en: 'Where does the data or knowledge come from?', zh: '数据或知识从哪里来？' }, group: 'knowledge' },
  { key: 'objectModel', label: { en: 'Object Model', zh: '对象模型' }, hint: { en: 'What are the core entities and their relationships?', zh: '核心实体和它们的关系是什么？' }, group: 'knowledge' },
  { key: 'aiCapability', label: { en: 'AI / Agent Capability', zh: 'AI/Agent 能力' }, hint: { en: 'What AI capabilities does this product use?', zh: '这个产品用到什么 AI 能力？' }, group: 'ai' },
  { key: 'workflowBoundary', label: { en: 'Workflow Boundary', zh: '工作流边界' }, hint: { en: 'Where does AI automation end and human work begin?', zh: 'AI 自动化在哪里结束，人工在哪里开始？' }, group: 'ai' },
  { key: 'humanReview', label: { en: 'Human Review Point', zh: '人工审核点' }, hint: { en: 'Where does a human need to review or approve?', zh: '哪里需要人工审核或批准？' }, group: 'ai' },
  { key: 'evalMetric', label: { en: 'Evaluation Metric', zh: '评估指标' }, hint: { en: 'How do you measure if the AI is doing a good job?', zh: '怎么衡量 AI 做得好不好？' }, group: 'delivery' },
  { key: 'prototypeScope', label: { en: 'Prototype Scope', zh: '原型范围' }, hint: { en: 'What is the MVP? What is out of scope?', zh: 'MVP 是什么？第一版不做什么？' }, group: 'delivery' },
  { key: 'productionRisk', label: { en: 'Production Risk', zh: '生产风险' }, hint: { en: 'What could go wrong when this goes live?', zh: '上线后可能出什么问题？' }, group: 'delivery' },
  { key: 'productNarrative', label: { en: 'Product Narrative', zh: '产品叙事' }, hint: { en: 'How do you explain this product to stakeholders?', zh: '怎么向利益相关者解释这个产品？' }, group: 'delivery' },
];

const GROUPS = {
  context: { en: 'Context', zh: '上下文', color: 'var(--group-context)', bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20', gradient: 'from-slate-500/20 to-transparent' },
  knowledge: { en: 'Knowledge', zh: '知识', color: 'var(--group-knowledge)', bgClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20', gradient: 'from-violet-500/20 to-transparent' },
  ai: { en: 'AI Layer', zh: 'AI 层', color: 'var(--group-ai)', bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20', gradient: 'from-blue-500/20 to-transparent' },
  delivery: { en: 'Delivery', zh: '交付', color: 'var(--group-delivery)', bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', gradient: 'from-emerald-500/20 to-transparent' },
} as const;

type FormData = Record<string, string>;
type Lang = 'en' | 'zh';

interface ProjectMeta {
  name: string;
  idea: string;
  date: string;
}

interface StorageData {
  meta: ProjectMeta;
  data: FormData;
}

const STORAGE_KEY = 'ai-pm-canvas-data';

const EXAMPLES: { key: string; label: { en: string; zh: string }; meta: ProjectMeta; data: FormData }[] = [
  {
    key: 'prompt-to-ontology',
    label: { en: 'Prompt-to-Ontology', zh: 'Prompt-to-Ontology' },
    meta: { name: 'Prompt-to-Ontology', idea: 'Turn messy business language into structured ontology assets — making implicit knowledge explicit and machine-readable.', date: new Date().toISOString().slice(0, 10) },
    data: {
      businessScenario: "Enterprise knowledge management. Organizations store data across disconnected systems — spreadsheets, documents, databases. Relationships between business concepts are implicit and hard to discover.",
      userOperator: "Knowledge engineers (primary). Domain experts who validate extracted relationships. Data analysts who query the knowledge graph.",
      decisionToSupport: "What entities exist in this domain? How are they related? Which relationships are well-supported by evidence vs. inferred?",
      dataSources: "Business documents (SOPs, process descriptions), domain glossaries, database schemas, expert interviews.",
      objectModel: "Entity → has → Attributes\nEntity → related_to → Entity\nRelationship → supported_by → Evidence\nSchema → constrains → Entity",
      aiCapability: "LLM for entity and relationship extraction from natural language. Confidence scoring for extracted relationships. Schema suggestion based on domain patterns.",
      workflowBoundary: "AI: entity extraction, relationship inference, schema suggestion, confidence scoring.\nHuman: domain validation, relationship confirmation, schema approval.",
      humanReview: "Before adding any entity to the production ontology. Before accepting inferred relationships with confidence below 85%.",
      evalMetric: "Extraction precision (vs. expert labels). Relationship recall. Schema coverage. Expert agreement rate. Time-to-useful-ontology.",
      prototypeScope: "MVP: Single-domain entity extraction with human review.\nOut: Multi-domain scaling, real-time updates, production deployment.",
      productionRisk: "Hallucinated entities polluting the ontology. Incorrect relationships leading to wrong inferences. Over-reliance on automated extraction.",
      productNarrative: "Turn messy business language into structured ontology assets — making implicit knowledge explicit and machine-readable.",
    },
  },
  {
    key: 'industrial-agent',
    label: { en: 'Industrial Agent Decision Support', zh: '工业 Agent 决策支持' },
    meta: { name: 'Industrial Agent Decision Support', idea: 'An AI co-pilot for equipment engineers that turns scattered data into actionable diagnosis — reducing downtime from hours to minutes.', date: new Date().toISOString().slice(0, 10) },
    data: {
      businessScenario: "Manufacturing operations. Engineers manage complex equipment across multiple systems, needing to diagnose issues and make maintenance decisions under time pressure.",
      userOperator: "Equipment engineers (primary). Maintenance supervisors (secondary). Operations managers (oversight).",
      decisionToSupport: "Which equipment needs attention now? What is the likely root cause? Should we escalate, monitor, or intervene?",
      dataSources: "Equipment sensor data (time-series), maintenance history, engineering SOPs, expert knowledge, alarm logs.",
      objectModel: "Equipment → has → Sensors\nEquipment → belongs_to → Area\nAnomaly → triggers → Alert\nEngineer → owns → Equipment",
      aiCapability: "LLM for natural language query understanding. RAG over SOPs and maintenance docs. Agent workflow for multi-step diagnosis with tool use.",
      workflowBoundary: "AI: data retrieval, initial diagnosis, SOP lookup, report generation.\nHuman: final decision, equipment intervention, safety-critical actions.",
      humanReview: "Before any equipment action recommendation. Before escalation to supervisor. On confidence scores below 80%.",
      evalMetric: "Diagnosis accuracy (vs. expert label). Time-to-diagnosis. Engineer satisfaction. False positive rate.",
      prototypeScope: "MVP: Single equipment diagnosis flow with dashboard.\nOut: Multi-equipment correlation, predictive maintenance, mobile.",
      productionRisk: "Incorrect diagnosis leading to wrong equipment action. Data latency between sensor systems. Engineer over-reliance on AI recommendations.",
      productNarrative: "An AI co-pilot for equipment engineers that turns scattered data into actionable diagnosis — reducing downtime from hours to minutes.",
    },
  },
  {
    key: 'rag-knowledge-assistant',
    label: { en: 'RAG Knowledge Assistant', zh: 'RAG 知识助手' },
    meta: { name: 'RAG Knowledge Assistant', idea: 'An internal knowledge assistant that gives employees accurate, cited answers from company documents — reducing search time and knowledge silos.', date: new Date().toISOString().slice(0, 10) },
    data: {
      businessScenario: "Internal knowledge access. Employees spend significant time searching for information across wikis, docs, and internal systems.",
      userOperator: "All employees (primary). Knowledge managers who curate content. IT team (operators).",
      decisionToSupport: "Where is the relevant information? What does the policy say? Who has done this before?",
      dataSources: "Internal wiki pages, policy documents, Slack conversations, project documentation, HR policies.",
      objectModel: "Document → belongs_to → Topic\nDocument → authored_by → Person\nQuestion → answered_by → Document\nTopic → related_to → Topic",
      aiCapability: "Embedding-based document retrieval. LLM for answer synthesis with citations. Query understanding and reformulation.",
      workflowBoundary: "AI: document retrieval, answer generation, citation extraction.\nHuman: content curation, accuracy verification, sensitive content filtering.",
      humanReview: "For answers referencing policy or compliance. When confidence is low. For sensitive HR or legal topics.",
      evalMetric: "Answer accuracy (human-rated). Citation relevance. Time-to-answer vs. manual search. User satisfaction.",
      prototypeScope: "MVP: Single-domain Q&A over curated document set.\nOut: Multi-source integration, conversation memory, proactive suggestions.",
      productionRisk: "Stale or outdated answers. Hallucinated citations. Sensitive information leakage. Over-reliance on AI for compliance questions.",
      productNarrative: "An internal knowledge assistant that gives employees accurate, cited answers from company documents — reducing search time and knowledge silos.",
    },
  },
];

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultMeta(): ProjectMeta {
  return { name: '', idea: '', date: getToday() };
}

interface Props {
  defaultLang?: Lang;
}

function ProgressRing({ value, size = 36 }: { value: number; size?: number }) {
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="2"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 12)}
        strokeLinecap="round" className="text-emerald-500 transition-all duration-500"
      />
    </svg>
  );
}

export default function CanvasBuilder({ defaultLang = 'en' }: Props) {
  const [lang, setLang] = useState<Lang>(defaultLang);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<FormData>({});
  const [meta, setMeta] = useState<ProjectMeta>(defaultMeta);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && 'meta' in parsed && 'data' in parsed) {
          setMeta(parsed.meta);
          setData(parsed.data);
        } else {
          setData(parsed);
        }
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ meta, data }));
        setSaved(true);
        const t = setTimeout(() => setSaved(false), 1500);
        return () => clearTimeout(t);
      } catch {}
    }
  }, [data, meta, mounted]);

  const updateField = useCallback((key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateMeta = useCallback((key: keyof ProjectMeta, value: string) => {
    setMeta((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filledCount = DIMENSIONS.filter((d) => data[d.key]?.trim()).length;

  const generateMarkdown = useCallback(() => {
    const title = meta.name?.trim() || (lang === 'zh' ? '未命名项目' : 'Untitled Project');
    const ideaLine = meta.idea?.trim();
    const dateStr = meta.date || getToday();

    let md = `# AI PM Canvas: ${title}\n\n`;
    if (ideaLine) {
      md += `> ${ideaLine}\n\n`;
    }
    md += `**Generated**: ${dateStr}\n`;
    md += `**Tool**: [AI PM Operating Playbook](https://wenhaoyu-bryan.github.io/AI-PM-Operating-Playbook/en/canvas/)\n\n---\n\n`;

    const groupEntries = Object.entries(GROUPS);
    for (const [groupKey, group] of groupEntries) {
      md += `## ${group[lang]}\n\n`;
      const dims = DIMENSIONS.filter((d) => d.group === groupKey);
      for (const d of dims) {
        const globalIdx = DIMENSIONS.indexOf(d) + 1;
        const value = data[d.key] || (lang === 'zh' ? '_未填写_' : '_Not filled_');
        md += `### ${globalIdx}. ${d.label[lang]}\n\n${value}\n\n`;
      }
    }

    md += `---\n*Created with AI PM Operating Playbook*\n`;
    return md;
  }, [data, meta, lang]);

  const copyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [generateMarkdown]);

  const downloadMarkdown = useCallback(() => {
    const blob = new Blob([generateMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = meta.name?.trim().replace(/[^a-zA-Z0-9一-鿿_-]/g, '-').replace(/-+/g, '-').slice(0, 60);
    a.download = safeName ? `${safeName}-ai-pm-canvas.md` : 'ai-pm-canvas.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [generateMarkdown, meta.name]);

  const loadExample = useCallback((example: typeof EXAMPLES[number]) => {
    if (!window.confirm(lang === 'zh' ? '加载示例将覆盖当前内容，确定继续？' : 'Loading an example will replace your current content. Continue?')) return;
    setMeta({ ...example.meta, date: getToday() });
    setData({ ...example.data });
  }, [lang]);

  const clearAll = useCallback(() => {
    if (!window.confirm(lang === 'zh' ? '确定清空所有字段？此操作不可撤销。' : 'Clear all fields? This cannot be undone.')) return;
    setMeta(defaultMeta());
    setData({});
  }, [lang]);

  const labels = {
    canvasView: lang === 'zh' ? '概览' : 'Overview',
    formView: lang === 'zh' ? '填写' : 'Fill',
    mdView: 'Markdown',
    copy: lang === 'zh' ? '复制' : 'Copy',
    copied: lang === 'zh' ? '已复制' : 'Copied',
    download: lang === 'zh' ? '下载 .md' : 'Download .md',
    examples: lang === 'zh' ? '示例' : 'Examples',
    clear: lang === 'zh' ? '清空' : 'Clear',
    filled: lang === 'zh' ? '已填写' : 'filled',
    saved: lang === 'zh' ? '已保存' : 'Saved',
    startBlank: lang === 'zh' ? '空白' : 'Blank',
    projectName: lang === 'zh' ? '项目名称' : 'Project Name',
    oneLineIdea: lang === 'zh' ? '一句话描述' : 'One-line idea',
    date: lang === 'zh' ? '日期' : 'Date',
    privacy: lang === 'zh'
      ? '你的 Canvas 数据保存在浏览器本地，不会上传。'
      : 'Your Canvas stays in this browser and is not uploaded.',
  };

  const groupedDimensions = Object.entries(GROUPS).map(([groupKey, group]) => ({
    groupKey: groupKey as keyof typeof GROUPS,
    group,
    dimensions: DIMENSIONS.filter((d) => d.group === groupKey),
  }));

  return (
    <div className="space-y-4">
      {/* Metadata section */}
      <Card className="border-dashed">
        <CardContent className="pt-4 pb-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{labels.projectName}</label>
              <Input
                value={meta.name}
                onChange={(e) => updateMeta('name', e.target.value)}
                placeholder={lang === 'zh' ? '我的 AI 产品' : 'My AI Product'}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{labels.oneLineIdea}</label>
              <Input
                value={meta.idea}
                onChange={(e) => updateMeta('idea', e.target.value)}
                placeholder={lang === 'zh' ? '用一句话描述你的产品想法' : 'Describe your product idea in one line'}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{labels.date}</label>
              <Input
                type="date"
                value={meta.date}
                onChange={(e) => updateMeta('date', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground/60">{labels.privacy}</span>
            {saved && (
              <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                <Check className="w-3 h-3" /> {labels.saved}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Toolbar: tabs + controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Tabs defaultValue="canvas" className="w-full">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList variant="line">
              <TabsTrigger value="canvas">{labels.canvasView}</TabsTrigger>
              <TabsTrigger value="form">{labels.formView}</TabsTrigger>
              <TabsTrigger value="md">{labels.mdView}</TabsTrigger>
            </TabsList>

            {/* Right side controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex items-center justify-center">
                <ProgressRing value={filledCount} />
                <span className="absolute text-[10px] font-bold text-foreground" suppressHydrationWarning>{filledCount}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              >
                <Languages className="w-3.5 h-3.5" />
                {lang === 'en' ? 'EN' : '中文'}
              </Button>
              <span className="w-px h-4 bg-border" />
              <Button variant="outline" size="sm" onClick={copyMarkdown}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? labels.copied : labels.copy}
              </Button>
              <Button size="sm" onClick={downloadMarkdown}>
                <Download className="w-3.5 h-3.5" />
                {labels.download}
              </Button>
              <span className="w-px h-4 bg-border" />
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearAll}>
                <RotateCcw className="w-3.5 h-3.5" />
                {labels.clear}
              </Button>
            </div>
          </div>

          {/* Examples row */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-border/50">
            <span className="text-[11px] text-muted-foreground mr-0.5">{labels.examples}:</span>
            {EXAMPLES.map((ex) => (
              <Button
                key={ex.key}
                variant="outline"
                size="sm"
                className="text-[11px] h-7 px-2.5"
                onClick={() => loadExample(ex)}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {ex.label[lang]}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] h-7 px-2.5"
              onClick={() => {
                if (!window.confirm(lang === 'zh' ? '加载空白模板将覆盖当前内容，确定继续？' : 'Starting blank will replace your current content. Continue?')) return;
                setMeta(defaultMeta());
                setData({});
              }}
            >
              {labels.startBlank}
            </Button>
          </div>

          {/* Canvas / Overview View */}
          <TabsContent value="canvas">
            {groupedDimensions.map(({ groupKey, group, dimensions }) => (
              <div key={groupKey} className="mt-6 first:mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: group.color }} />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group[lang]}</span>
                  <span className="text-[10px] text-muted-foreground/50" suppressHydrationWarning>
                    {dimensions.filter((d) => data[d.key]?.trim()).length}/{dimensions.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dimensions.map((d, i) => {
                    const filled = !!data[d.key]?.trim();
                    const globalIdx = DIMENSIONS.indexOf(d) + 1;
                    return (
                      <button
                        key={d.key}
                        onClick={() => {
                          setExpandedKey(d.key);
                          const tabsList = document.querySelector('[data-slot="tabs-list"]');
                          const formTab = tabsList?.querySelector('[value="form"]') as HTMLElement;
                          formTab?.click();
                        }}
                        className="text-left cursor-pointer bg-transparent border-0 p-0"
                      >
                        <Card className={`relative transition-all duration-200 hover:ring-1 hover:ring-primary/30 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 ${filled ? 'opacity-100' : 'opacity-50 border-dashed hover:opacity-70'}`}>
                          <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-xl`} style={{ backgroundColor: filled ? group.color : 'transparent' }} />
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold text-white/90" style={{ backgroundColor: group.color }}>
                                  {globalIdx}
                                </span>
                                <CardTitle className="text-sm">{d.label[lang]}</CardTitle>
                              </div>
                              {filled && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
                                  <Check className="w-3 h-3 text-emerald-400" />
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            {filled ? (
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 m-0">{data[d.key]}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground/40 leading-relaxed m-0 italic">{d.hint[lang]}</p>
                            )}
                          </CardContent>
                        </Card>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Form View */}
          <TabsContent value="form">
            <div className="space-y-2 mt-4 max-w-2xl">
              {groupedDimensions.map(({ groupKey, group, dimensions }) => (
                <div key={groupKey}>
                  <div className="flex items-center gap-2 mt-4 mb-2 first:mt-0">
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: group.color }} />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{group[lang]}</span>
                  </div>
                  {dimensions.map((d) => {
                    const isExpanded = expandedKey === d.key;
                    const filled = !!data[d.key]?.trim();
                    const globalIdx = DIMENSIONS.indexOf(d) + 1;
                    return (
                      <Card key={d.key} className={`transition-all duration-200 ${isExpanded ? 'ring-1 ring-primary/20' : ''}`}>
                        <button
                          onClick={() => setExpandedKey(isExpanded ? null : d.key)}
                          className="w-full text-left cursor-pointer bg-transparent border-0 p-0"
                        >
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <span
                                className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold text-white/90"
                                style={{ backgroundColor: group.color }}
                              >
                                {globalIdx}
                              </span>
                              <CardTitle className="flex-1 text-sm">{d.label[lang]}</CardTitle>
                              {filled && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 flex-shrink-0">
                                  <Check className="w-3 h-3 text-emerald-400" />
                                </span>
                              )}
                              <ChevronDown
                                className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                          </CardHeader>
                        </button>
                        {isExpanded && (
                          <CardContent>
                            <p className="text-xs text-muted-foreground mb-3 m-0">{d.hint[lang]}</p>
                            <Textarea
                              value={data[d.key] || ''}
                              onChange={(e) => updateField(d.key, e.target.value)}
                              placeholder={d.hint[lang]}
                              rows={4}
                              className="resize-y min-h-24"
                            />
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Markdown View */}
          <TabsContent value="md">
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Markdown Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyMarkdown}>
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? labels.copied : labels.copy}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                      <Download className="w-3.5 h-3.5" />
                      {labels.download}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs leading-relaxed overflow-auto max-h-[60vh] whitespace-pre-wrap font-mono text-muted-foreground bg-transparent border-0 p-0 m-0">
                  {generateMarkdown()}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
