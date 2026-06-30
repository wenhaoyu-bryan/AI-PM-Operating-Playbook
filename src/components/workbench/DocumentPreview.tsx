import type { Lang } from '@/lib/workbench/schema';

interface DocumentPreviewProps {
  content: string;
  lang: Lang;
}

/* ------------------------------------------------------------------ */
/*  Inline helpers                                                     */
/* ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseTableRow(line: string): string[] {
  return line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => inlineMarkdown(c.trim()));
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-[12px] font-mono text-emerald-400">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener nofollow">$1</a>');
}

/* ------------------------------------------------------------------ */
/*  Block-level markdown renderer                                      */
/* ------------------------------------------------------------------ */

function renderMarkdown(content: string): string {
  if (!content?.trim()) return '';

  const lines = content.split('\n');
  const html: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let inTable = false;
  let tableBuffer: string[] = [];
  let pendingPara: string[] = [];
  let inList = false;

  function flushPara() {
    if (pendingPara.length > 0) {
      html.push(`<p class="text-sm text-foreground/90 my-1.5 leading-relaxed whitespace-pre-wrap break-words">${inlineMarkdown(pendingPara.join('\n'))}</p>`);
      pendingPara = [];
    }
  }

  function flushCode() {
    if (codeBuffer.length > 0) {
      html.push(`<pre class="my-3 rounded-lg bg-secondary/60 p-3 overflow-x-auto text-xs"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
      codeBuffer = [];
    }
  }

  function flushTable() {
    if (tableBuffer.length >= 2) {
      const headers = parseTableRow(tableBuffer[0]);
      const rows = tableBuffer.slice(2).map(parseTableRow);
      let t = '<div class="my-3 overflow-x-auto"><table class="w-full text-xs border-collapse"><thead><tr>';
      headers.forEach(h => { t += `<th class="text-left p-2 border-b border-border font-medium text-foreground">${h}</th>`; });
      t += '</tr></thead><tbody>';
      rows.forEach(row => {
        t += '<tr>';
        row.forEach(cell => { t += `<td class="p-2 border-b border-border/50 text-muted-foreground">${cell}</td>`; });
        for (let i = row.length; i < headers.length; i++) { t += '<td class="p-2 border-b border-border/50 text-muted-foreground"></td>'; }
        t += '</tr>';
      });
      t += '</tbody></table></div>';
      html.push(t);
    } else {
      tableBuffer.forEach(l => html.push(`<p class="text-sm text-foreground/90 my-1">${inlineMarkdown(l)}</p>`));
    }
    tableBuffer = [];
  }

  function endList() { if (inList) { html.push('</ul>'); inList = false; } }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // Code fences
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) { flushCode(); inCodeBlock = false; }
      else { flushPara(); endList(); flushTable(); inCodeBlock = true; }
      continue;
    }
    if (inCodeBlock) { codeBuffer.push(raw); continue; }

    // Tables
    const isTableRow = trimmed.startsWith('|') && trimmed.endsWith('|');
    const isTableSep = /^\|?[\s]*[-:]{3,}[\s|:-]*$/.test(trimmed);
    if (isTableRow) {
      if (!inTable) { flushPara(); endList(); inTable = true; }
      tableBuffer.push(trimmed);
      continue;
    } else if (isTableSep && inTable) {
      tableBuffer.push(trimmed);
      continue;
    } else if (inTable) { flushTable(); inTable = false; }

    // Headings
    const hm = trimmed.match(/^(#{1,4})\s+(.+)/);
    if (hm) {
      flushPara(); endList();
      const level = hm[1].length;
      const text = hm[2];
      const sizes: Record<number, string> = { 1: 'text-xl font-bold', 2: 'text-base font-semibold', 3: 'text-sm font-semibold', 4: 'text-xs font-semibold' };
      const margins: Record<number, string> = { 1: 'mt-6 mb-3', 2: 'mt-5 mb-2', 3: 'mt-4 mb-1.5', 4: 'mt-3 mb-1' };
      html.push(`<h${level} class="${sizes[level]} text-foreground ${margins[level]}">${inlineMarkdown(text)}</h${level}>`);
      continue;
    }

    // Horizontal rules
    if (/^[-*_]{3,}\s*$/.test(trimmed)) { flushPara(); endList(); html.push('<hr class="my-4 border-border" />'); continue; }

    // Blockquotes
    if (trimmed.startsWith('>')) {
      flushPara(); endList();
      html.push(`<blockquote class="border-l-2 border-primary/20 pl-3 my-3 text-xs text-muted-foreground">${inlineMarkdown(trimmed.replace(/^>\s*/, ''))}</blockquote>`);
      continue;
    }

    // List items
    if (/^[-*]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
      flushPara();
      if (!inList) { inList = true; html.push('<ul class="list-disc pl-5 my-2 space-y-0.5 text-sm">'); }
      const itemContent = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+[.)]\s+/, '');
      html.push(`<li class="text-muted-foreground">${inlineMarkdown(itemContent)}</li>`);
      continue;
    } else if (inList) { endList(); }

    // Empty lines
    if (trimmed === '') { flushPara(); endList(); continue; }

    // Regular paragraph
    pendingPara.push(trimmed);
  }

  flushTable(); flushCode(); endList(); flushPara();
  return html.join('\n');
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DocumentPreview({ content, lang }: DocumentPreviewProps) {
  if (!content?.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground m-0">
          {lang === 'zh' ? '选择一个文档查看预览' : 'Select a document to preview'}
        </p>
      </div>
    );
  }

  const html = renderMarkdown(content);

  return (
    <div
      className="text-sm text-foreground/90 leading-relaxed break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
