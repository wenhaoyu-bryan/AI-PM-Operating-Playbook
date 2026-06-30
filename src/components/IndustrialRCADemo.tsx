import { useState, useCallback } from 'react';

type HITLDecision = 'approved' | 'revised' | 'rejected' | null;
type Lang = 'en' | 'zh';

const T = {
  en: {
    title: 'Industrial RCA Agent Interactive Demo',
    allSynthetic: 'All data in this demo is synthetic and public-safe.',
    caseOverview: 'Case Overview',
    line: 'Line',
    product: 'Product',
    metric: 'Metric',
    currentValue: 'Current',
    baseline: 'Baseline',
    severity: 'Severity',
    relatedEvent: 'Related Event',
    relatedSOP: 'Related SOP',
    runInvestigation: 'Run Investigation',
    investigationPlan: 'Agent Investigation Plan',
    steps: [
      'Check quality metrics',
      'Query equipment events',
      'Retrieve SOP snippets',
      'Generate root cause hypotheses',
      'Route risky recommendation to HITL',
      'Generate final RCA report',
      'Run evaluation',
    ],
    toolCalls: 'Tool Call Timeline',
    toolPurpose: 'Purpose',
    toolRisk: 'Risk',
    toolOutput: 'Output Summary',
    toolApproval: 'HITL',
    toolRequired: 'Required',
    toolNotRequired: 'Auto',
    tools: [
      { name: 'query_quality_metrics', purpose: 'Retrieve yield data for LINE-A / PROD-1001', risk: 'Low', output: 'yield_rate: 91.2% (baseline 97.8%), severity High', hitl: false },
      { name: 'query_equipment_events', purpose: 'Scan equipment logs ±4h around anomaly timestamp', risk: 'Low', output: 'Found 1 correlated event: parameter_drift on sensor S-03 at T-2.5h', hitl: false },
      { name: 'retrieve_sop_snippets', purpose: 'Search SOP library for calibration drift procedures', risk: 'Low', output: 'Matched SOP-CAL-042 Section 3.1: drift check procedure', hitl: false },
      { name: 'generate_rca_report', purpose: 'Compile hypotheses, evidence, and recommendations', risk: 'Medium', output: '3 hypotheses generated, primary confidence 0.85', hitl: false },
      { name: 'submit_hitl_review', purpose: 'Route high-risk calibration recommendation for human approval', risk: 'High', output: 'Routed to review queue — SLA: 30 min', hitl: true },
    ],
    evidenceCards: 'Evidence Cards',
    evidenceType: 'Type',
    evidenceSummary: 'Summary',
    evidenceWhy: 'Why It Matters',
    evidence: [
      { type: 'Quality Metric', summary: 'Yield dropped from 97.8% baseline to 91.2% — a 6.6 percentage point deviation.', why: 'Magnitude and recency confirm this is not a routine fluctuation.' },
      { type: 'Equipment Event', summary: 'parameter_drift detected on sensor S-03 approximately 2.5 hours before the yield drop.', why: 'Temporal proximity suggests a causal link between the drift and the quality deviation.' },
      { type: 'SOP Match', summary: 'SOP-CAL-042 Section 3.1: calibration drift check procedure is the relevant standard response.', why: 'Confirms that drift exceeding 5% of baseline triggers a mandatory calibration review.' },
      { type: 'Batch Context', summary: 'Affected batch PROD-1001 is synthetic — used only for this demonstration. No real production data.', why: 'Demonstrates how the agent links an anomaly to specific equipment events and procedures.' },
    ],
    hypotheses: 'Root Cause Hypotheses',
    hypothesis: 'Hypothesis',
    confidence: 'Confidence',
    evidenceSupp: 'Supporting Evidence',
    riskNote: 'Risk Note',
    hypos: [
      { rank: 1, text: 'Equipment parameter drift on sensor S-03 caused the yield deviation.', confidence: 'High (0.85)', evidence: 'parameter_drift event at T-2.5h; yield drop magnitude consistent with sensor miscalibration.', risk: 'High — recalibration may require temporary line pause.' },
      { rank: 2, text: 'Delayed calibration check allowed gradual drift to accumulate beyond threshold.', confidence: 'Medium (0.55)', evidence: 'Last calibration record was 18 days ago; SOP recommends every 7 days for this sensor class.', risk: 'Medium — process compliance gap, not an immediate safety risk.' },
      { rank: 3, text: 'Batch-specific process variation (raw material or environmental factor).', confidence: 'Low (0.20)', evidence: 'No raw material change logged; no environmental anomaly in shift records.', risk: 'Low — unlikely given available data, but not ruled out.' },
    ],
    hitlPanel: 'HITL Review Panel',
    hitlRecommendation: 'Recommendation',
    hitlRecText: 'Inspect equipment calibration before resuming normal production assumptions.',
    hitlRiskLevel: 'Risk Level',
    hitlNote: 'High-risk operational recommendations require human review before execution.',
    approve: 'Approve',
    requestRevision: 'Request Revision',
    reject: 'Reject',
    decisionApproved: 'Approved — recommendation will be included in the final report with reviewer sign-off.',
    decisionRevised: 'Revision requested — agent will update the recommendation with reviewer feedback before final report.',
    decisionRejected: 'Rejected — recommendation will not be included. Reason logged in audit trail.',
    decisionPending: 'Pending review — click a button above to simulate a HITL decision.',
    finalReport: 'Final RCA Report',
    executiveSummary: 'Executive Summary',
    executiveSummaryText: 'A yield rate deviation was detected on LINE-A for product PROD-1001. Investigation identified equipment parameter drift on sensor S-03 as the primary root cause (confidence 0.85). Calibration review is recommended. High-risk recommendation routed to HITL review.',
    anomalyDesc: 'Anomaly Description',
    anomalyDescText: 'Yield rate dropped from 97.8% baseline to 91.2%. Severity classified as High. Detected by automated quality monitoring.',
    evidenceReviewed: 'Evidence Reviewed',
    evidenceReviewedText: 'Quality metrics, equipment event logs (±4h window), SOP-CAL-042 Section 3.1, batch production records.',
    rootCauseHypothesis: 'Root Cause Hypothesis',
    rootCauseHypothesisText: 'Primary: Equipment parameter drift on sensor S-03. Secondary: Delayed calibration check. Tertiary: Batch-specific variation (low confidence, not ruled out).',
    recommendedAction: 'Recommended Action',
    recommendedActionText: 'Inspect equipment calibration before resuming normal production assumptions. Review calibration schedule compliance per SOP-CAL-042.',
    hitlDecision: 'HITL Decision',
    openQuestions: 'Open Questions',
    openQuestionsText: '1. Is the 18-day calibration gap a systemic scheduling issue?  2. Are other sensors on LINE-A due for calibration?  3. Should the drift threshold be tightened for this product class?',
    evaluationPanel: 'Evaluation Score Panel',
    evalDimensions: [
      { name: 'Evidence Grounding', weight: '25%', score: 9, desc: 'Multiple independent data sources cited. All claims traceable.' },
      { name: 'Root Cause Plausibility', weight: '20%', score: 8, desc: 'Primary hypothesis well-supported. Alternatives considered and ranked.' },
      { name: 'Actionability', weight: '15%', score: 8, desc: 'Specific SOP cited. Clear next step for operations team.' },
      { name: 'Safety', weight: '15%', score: 9, desc: 'High-risk item correctly gated behind HITL. No unsafe auto-approvals.' },
      { name: 'HITL Routing Quality', weight: '10%', score: 9, desc: 'Correct risk classification. Appropriate reviewer and SLA assigned.' },
      { name: 'Report Completeness', weight: '10%', score: 8, desc: 'All required sections present. Open questions flagged for follow-up.' },
      { name: 'Regression Stability', weight: '5%', score: 8, desc: 'Known eval cases pass. No hallucinated evidence detected.' },
    ],
    weightedOverall: 'Weighted Overall',
    pass: 'PASS',
    archiveNote: 'This interactive demo is adapted from the original Industrial Agent Product Sandbox. The standalone repository is no longer the canonical version; the Playbook module now contains the integrated case pattern and demo experience.',
  },
  zh: {
    title: '工业 RCA Agent 交互式 Demo',
    allSynthetic: '本 Demo 中的所有数据均为模拟数据，可公开展示。',
    caseOverview: '案例概览',
    line: '产线',
    product: '产品',
    metric: '指标',
    currentValue: '当前值',
    baseline: '基线',
    severity: '严重程度',
    relatedEvent: '相关事件',
    relatedSOP: '相关 SOP',
    runInvestigation: '运行调查',
    investigationPlan: 'Agent 调查计划',
    steps: [
      '检查良率指标',
      '查询设备事件',
      '检索 SOP 片段',
      '生成根因假设',
      '将高风险建议提交人工审核',
      '生成最终 RCA 报告',
      '运行评估',
    ],
    toolCalls: '工具调用时间线',
    toolPurpose: '用途',
    toolRisk: '风险',
    toolOutput: '输出摘要',
    toolApproval: '审核',
    toolRequired: '需要',
    toolNotRequired: '自动',
    tools: [
      { name: 'query_quality_metrics', purpose: '检索 LINE-A / PROD-1001 的良率数据', risk: '低', output: 'yield_rate: 91.2%（基线 97.8%），严重程度：高', hitl: false },
      { name: 'query_equipment_events', purpose: '扫描异常时间戳前后 ±4h 的设备日志', risk: '低', output: '发现 1 个关联事件：传感器 S-03 在 T-2.5h 发生 parameter_drift', hitl: false },
      { name: 'retrieve_sop_snippets', purpose: '在 SOP 库中搜索校准漂移程序', risk: '低', output: '匹配到 SOP-CAL-042 第 3.1 节：漂移检查程序', hitl: false },
      { name: 'generate_rca_report', purpose: '编制假设、证据和建议', risk: '中', output: '生成 3 个假设，主要假设置信度 0.85', hitl: false },
      { name: 'submit_hitl_review', purpose: '将高风险校准建议提交人工审批', risk: '高', output: '已路由到审核队列 — SLA：30 分钟', hitl: true },
    ],
    evidenceCards: '证据卡片',
    evidenceType: '类型',
    evidenceSummary: '摘要',
    evidenceWhy: '为什么重要',
    evidence: [
      { type: '质量指标', summary: '良率从 97.8% 基线降至 91.2% — 下降了 6.6 个百分点。', why: '偏差幅度和时效性表明这不是常规波动。' },
      { type: '设备事件', summary: '良率下降前约 2.5 小时，传感器 S-03 检测到 parameter_drift。', why: '时间上的接近性表明漂移与质量偏差之间存在因果关联。' },
      { type: 'SOP 匹配', summary: 'SOP-CAL-042 第 3.1 节：校准漂移检查程序是相关的标准响应。', why: '确认漂移超过基线 5% 会触发强制性校准审查。' },
      { type: '批次背景', summary: '受影响的 PROD-1001 批次为合成数据 — 仅用于本演示，不含真实生产数据。', why: '展示 Agent 如何将异常关联到特定设备事件和程序。' },
    ],
    hypotheses: '根因假设',
    hypothesis: '假设',
    confidence: '置信度',
    evidenceSupp: '支撑证据',
    riskNote: '风险备注',
    hypos: [
      { rank: 1, text: '传感器 S-03 的设备参数漂移导致了良率偏差。', confidence: '高 (0.85)', evidence: 'T-2.5h 的 parameter_drift 事件；良率下降幅度与传感器误校准一致。', risk: '高 — 重新校准可能需要临时停线。' },
      { rank: 2, text: '校准检查延迟导致渐进性漂移累积超过阈值。', confidence: '中 (0.55)', evidence: '上次校准记录为 18 天前；SOP 建议此类传感器每 7 天校准一次。', risk: '中 — 流程合规差距，非即时安全风险。' },
      { rank: 3, text: '批次特定的工艺波动（原材料或环境因素）。', confidence: '低 (0.20)', evidence: '未记录原材料变更；班次记录中无环境异常。', risk: '低 — 根据可用数据不太可能，但不能排除。' },
    ],
    hitlPanel: '人工审核面板',
    hitlRecommendation: '审核建议',
    hitlRecText: '在恢复正常生产假设之前检查设备校准状态。',
    hitlRiskLevel: '风险等级',
    hitlNote: '高风险运营建议在执行前需要人工审核。',
    approve: '批准',
    requestRevision: '要求修改',
    reject: '驳回',
    decisionApproved: '已批准 — 建议将纳入最终报告并附审核人签字。',
    decisionRevised: '已要求修改 — Agent 将根据审核人反馈更新建议后重新提交。',
    decisionRejected: '已驳回 — 建议不予采纳。原因已记录在审计日志中。',
    decisionPending: '等待审核 — 点击上方按钮模拟人工审核决策。',
    finalReport: '最终 RCA 报告',
    executiveSummary: '执行摘要',
    executiveSummaryText: '在 LINE-A 产线检测到 PROD-1001 产品的良率偏差。调查确定传感器 S-03 的设备参数漂移为主要根因（置信度 0.85）。建议进行校准审查。高风险建议已提交人工审核。',
    anomalyDesc: '异常描述',
    anomalyDescText: '良率从 97.8% 基线降至 91.2%。严重程度判定为高。由自动化质量监控系统检测。',
    evidenceReviewed: '已审查证据',
    evidenceReviewedText: '质量指标、设备事件日志（±4h 窗口）、SOP-CAL-042 第 3.1 节、批次生产记录。',
    rootCauseHypothesis: '根因假设',
    rootCauseHypothesisText: '主要：传感器 S-03 设备参数漂移。次要：校准检查延迟。第三：批次特定波动（低置信度，不能排除）。',
    recommendedAction: '建议措施',
    recommendedActionText: '在恢复正常生产假设之前检查设备校准状态。依据 SOP-CAL-042 审查校准排程合规性。',
    hitlDecision: '人工审核决策',
    openQuestions: '待解决问题',
    openQuestionsText: '1. 18 天的校准间隔是否为系统性排程问题？  2. LINE-A 上其他传感器是否也即将到期校准？  3. 是否应对此类产品收紧漂移阈值？',
    evaluationPanel: '评估得分面板',
    evalDimensions: [
      { name: '证据锚定', weight: '25%', score: 9, desc: '引用了多个独立数据源。所有声明均可追溯。' },
      { name: '根因合理性', weight: '20%', score: 8, desc: '主要假设论证充分。考虑了替代假设并排序。' },
      { name: '可操作性', weight: '15%', score: 8, desc: '引用了具体 SOP。运营团队有明确的下一步。' },
      { name: '安全性', weight: '15%', score: 9, desc: '高风险项正确地被 HITL 闸门拦截。无危险自动批准。' },
      { name: 'HITL 路由质量', weight: '10%', score: 9, desc: '风险分类正确。分配了合适的审核人和 SLA。' },
      { name: '报告完整性', weight: '10%', score: 8, desc: '所有必需章节均已包含。待解决问题已标记用于跟进。' },
      { name: '回归稳定性', weight: '5%', score: 8, desc: '已知评估案例通过。未检测到幻觉证据。' },
    ],
    weightedOverall: '加权总分',
    pass: '通过',
    archiveNote: '本交互式 Demo 改编自原 Industrial Agent Product Sandbox。独立仓库不再作为主要版本维护，Playbook 模块现在是该案例模式与 Demo 体验的主要承载位置。',
  },
};

function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-foreground w-5 text-right">{score}</span>
    </div>
  );
}

export default function IndustrialRCADemo({ lang }: { lang: Lang }) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [hitlDecision, setHitlDecision] = useState<HITLDecision>(null);
  const t = T[lang];

  const handleRun = useCallback(() => {
    setPhase('running');
    setHitlDecision(null);
    // Simulate progressive reveal: idle → running → done after short delay
    setTimeout(() => setPhase('done'), 600);
  }, []);

  const hitlLabel: Record<HITLDecision, string> = {
    approved: lang === 'zh' ? '已批准' : 'Approved',
    revised: lang === 'zh' ? '已要求修改' : 'Revision Requested',
    rejected: lang === 'zh' ? '已驳回' : 'Rejected',
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Synthetic data notice */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20 text-xs text-amber-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {t.allSynthetic}
      </div>

      {/* 1. Case Overview */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">{t.caseOverview}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            [t.line, 'LINE-A'], [t.product, 'PROD-1001'],
            [t.metric, 'yield_rate'], [t.currentValue, '91.2%'],
            [t.baseline, '97.8%'], [t.severity, 'High'],
            [t.relatedEvent, 'parameter_drift'], [t.relatedSOP, 'SOP-CAL-042 §3.1'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-card ring-1 ring-foreground/10 px-3 py-2">
              <div className="text-muted-foreground mb-0.5">{label}</div>
              <div className="font-mono font-medium text-foreground">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Run Investigation button */}
      <div className="text-center">
        <button
          onClick={handleRun}
          disabled={phase === 'running'}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          {t.runInvestigation}
        </button>
      </div>

      {/* Workflow sections — visible after running */}
      {phase !== 'idle' && (
        <>
          {/* 3. Investigation Plan */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.investigationPlan}</h2>
            <div className="space-y-1.5">
              {t.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card ring-1 ring-foreground/10 text-xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] font-medium shrink-0">{i + 1}</span>
                  <span className="text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Tool Call Timeline */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.toolCalls}</h2>
            <div className="space-y-2">
              {t.tools.map((tool, i) => (
                <div key={i} className="rounded-lg bg-card ring-1 ring-foreground/10 p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-emerald-400">{tool.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tool.risk === 'High' || tool.risk === '高' ? 'bg-red-500/10 text-red-400' : tool.risk === 'Medium' || tool.risk === '中' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {t.toolRisk}: {tool.risk}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tool.hitl ? 'bg-red-500/10 text-red-400' : 'bg-secondary text-muted-foreground'}`}>
                        {t.toolApproval}: {tool.hitl ? t.toolRequired : t.toolNotRequired}
                      </span>
                    </div>
                  </div>
                  <div className="text-muted-foreground">{t.toolPurpose}: {tool.purpose}</div>
                  <div className="text-foreground/80">{t.toolOutput}: {tool.output}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Evidence Cards */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.evidenceCards}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {t.evidence.map((e, i) => (
                <div key={i} className="rounded-lg bg-card ring-1 ring-foreground/10 p-3 text-xs space-y-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400">{e.type}</span>
                  <div className="text-foreground font-medium">{e.summary}</div>
                  <div className="text-muted-foreground">{t.evidenceWhy}: {e.why}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Root Cause Hypotheses */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.hypotheses}</h2>
            <div className="space-y-2">
              {t.hypos.map((h, i) => (
                <div key={i} className="rounded-lg bg-card ring-1 ring-foreground/10 p-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">{h.rank}</span>
                    <span className="font-medium text-foreground">{h.text}</span>
                    <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${h.confidence.startsWith('High') || h.confidence.startsWith('高') ? 'bg-emerald-500/10 text-emerald-400' : h.confidence.startsWith('Medium') || h.confidence.startsWith('中') ? 'bg-amber-500/10 text-amber-400' : 'bg-secondary text-muted-foreground'}`}>
                      {t.confidence}: {h.confidence}
                    </span>
                  </div>
                  <div className="text-muted-foreground pl-7">{t.evidenceSupp}: {h.evidence}</div>
                  <div className="text-muted-foreground pl-7">{t.riskNote}: {h.risk}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. HITL Review Panel */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.hitlPanel}</h2>
            <div className="rounded-lg bg-card ring-1 ring-foreground/10 p-4 text-xs space-y-3">
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-medium shrink-0 mt-0.5">{t.hitlRiskLevel}: High / 高</span>
                <span className="text-foreground">{t.hitlRecText}</span>
              </div>
              <div className="text-muted-foreground">{t.hitlNote}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setHitlDecision('approved')}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${hitlDecision === 'approved' ? 'bg-emerald-600 text-white' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                >
                  {t.approve}
                </button>
                <button
                  onClick={() => setHitlDecision('revised')}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${hitlDecision === 'revised' ? 'bg-amber-600 text-white' : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'}`}
                >
                  {t.requestRevision}
                </button>
                <button
                  onClick={() => setHitlDecision('rejected')}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${hitlDecision === 'rejected' ? 'bg-red-600 text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                >
                  {t.reject}
                </button>
              </div>
              {/* Decision feedback */}
              {phase === 'done' && (
                <div className={`px-3 py-2 rounded-md text-[11px] ${hitlDecision ? 'bg-emerald-500/5 ring-1 ring-emerald-500/20 text-emerald-400' : 'bg-secondary text-muted-foreground'}`}>
                  {hitlDecision ? T[lang][`decision${hitlDecision.charAt(0).toUpperCase() + hitlDecision.slice(1)}` as keyof typeof T['en']] : t.decisionPending}
                </div>
              )}
            </div>
          </section>

          {/* 8. Final RCA Report */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.finalReport}</h2>
            <div className="rounded-lg bg-card ring-1 ring-foreground/10 p-4 text-xs space-y-3">
              <div>
                <div className="font-semibold text-foreground mb-1">{t.executiveSummary}</div>
                <div className="text-muted-foreground">{t.executiveSummaryText}</div>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">{t.anomalyDesc}</div>
                <div className="text-muted-foreground">{t.anomalyDescText}</div>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">{t.evidenceReviewed}</div>
                <div className="text-muted-foreground">{t.evidenceReviewedText}</div>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">{t.rootCauseHypothesis}</div>
                <div className="text-muted-foreground">{t.rootCauseHypothesisText}</div>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">{t.recommendedAction}</div>
                <div className="text-muted-foreground">{t.recommendedActionText}</div>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">{t.hitlDecision}</div>
                {hitlDecision ? (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${hitlDecision === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : hitlDecision === 'revised' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                    {hitlLabel[hitlDecision]}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{lang === 'zh' ? '点击上方按钮做出审核决策' : 'Click a button above to make a review decision'}</span>
                )}
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">{t.openQuestions}</div>
                <div className="text-muted-foreground whitespace-pre-line">{t.openQuestionsText}</div>
              </div>
            </div>
          </section>

          {/* 9. Evaluation Score Panel */}
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">{t.evaluationPanel}</h2>
            <div className="rounded-lg bg-card ring-1 ring-foreground/10 p-4 space-y-3">
              {t.evalDimensions.map((dim, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{dim.name}</span>
                    <span className="text-muted-foreground">{dim.weight}</span>
                  </div>
                  <ScoreBar score={dim.score} />
                  <div className="text-[10px] text-muted-foreground">{dim.desc}</div>
                </div>
              ))}
              {/* Weighted total */}
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{t.weightedOverall}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-emerald-400">8.55</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">{t.pass}</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Archive note */}
      <div className="border-t border-border pt-6 mt-6">
        <p className="text-[11px] text-muted-foreground leading-relaxed">{t.archiveNote}</p>
      </div>
    </div>
  );
}
