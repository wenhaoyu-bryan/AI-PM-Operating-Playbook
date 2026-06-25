import { Copy, Download, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Lang } from '@/lib/workbench/schema';

interface DocumentPreviewProps {
  content: string;
  title: string;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
  lang: Lang;
}

export function DocumentPreview({
  content,
  title,
  onCopy,
  onDownload,
  copied,
  lang,
}: DocumentPreviewProps) {
  const copyLabel = copied
    ? lang === 'zh' ? '已复制' : 'Copied'
    : lang === 'zh' ? '复制' : 'Copy';
  const downloadLabel = lang === 'zh' ? '下载' : 'Download';

  return (
    <Card className="bg-card rounded-xl ring-1 ring-foreground/10">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <Button variant="outline" size="xs" onClick={onCopy}>
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            <span>{copyLabel}</span>
          </Button>
          <Button variant="outline" size="xs" onClick={onDownload}>
            <Download className="size-3" />
            <span>{downloadLabel}</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-[60vh] overflow-auto p-4 bg-secondary/30 rounded-lg m-0">
          {content}
        </pre>
      </CardContent>
    </Card>
  );
}
