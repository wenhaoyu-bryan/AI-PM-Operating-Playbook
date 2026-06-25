import type { Lang } from '@/lib/workbench/schema';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface DocumentPreviewProps {
  content: string;
  lang: Lang;
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

  return (
    <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
      {content}
    </div>
  );
}
