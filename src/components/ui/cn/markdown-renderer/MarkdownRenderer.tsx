import { cn } from '@/lib/utils'
import type { MarkdownRendererProps } from './markdown-renderer.types'

function parseMarkdown(md: string): string {
  return md
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^#{6}\s(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s(.+)$/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^>\s(.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^\s*[-*+]\s(.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^(?!<[a-z]).+$/gm, (line) => (!line.trim() ? '' : `<p>${line}</p>`))
    .replace(/\n{2,}/g, '\n')
}

export function MarkdownRenderer({ content, className, style }: MarkdownRendererProps) {
  const html = parseMarkdown(content)
  return (
    <div
      className={cn(
        'text-foreground leading-[1.7] text-[15px]',
        '[&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:leading-snug [&_h1]:text-[2em]',
        '[&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:leading-snug [&_h2]:text-[1.5em] [&_h2]:border-b [&_h2]:border-rule [&_h2]:pb-[0.3em]',
        '[&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:leading-snug [&_h3]:text-[1.25em]',
        '[&_h4]:font-bold [&_h4]:text-foreground [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:leading-snug [&_h4]:text-[1em]',
        '[&_p]:my-3',
        '[&_a]:text-patina [&_a]:underline [&_a:hover]:text-patina-deep',
        '[&_strong]:font-bold [&_strong]:text-foreground',
        '[&_em]:italic [&_em]:text-muted',
        '[&_code]:font-mono [&_code]:text-[0.85em] [&_code]:bg-sunken [&_code]:border [&_code]:border-rule [&_code]:rounded-[4px] [&_code]:px-[0.4em] [&_code]:py-[0.1em] [&_code]:text-patina',
        '[&_pre]:bg-sunken [&_pre]:border [&_pre]:border-rule [&_pre]:rounded-[--radius-md] [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4',
        '[&_pre_code]:bg-transparent [&_pre_code]:border-none [&_pre_code]:p-0 [&_pre_code]:text-foreground [&_pre_code]:text-[13px]',
        '[&_blockquote]:border-l-[3px] [&_blockquote]:border-l-patina [&_blockquote]:my-4 [&_blockquote]:py-2 [&_blockquote]:px-4 [&_blockquote]:text-muted [&_blockquote]:bg-raised [&_blockquote]:rounded-r-[--radius-sm]',
        '[&_ul]:my-3 [&_ul]:pl-[1.6em] [&_ol]:my-3 [&_ol]:pl-[1.6em]',
        '[&_li]:my-[0.3em] [&_li::marker]:text-faint',
        '[&_hr]:border-none [&_hr]:border-t [&_hr]:border-rule [&_hr]:my-6',
        '[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-[14px]',
        '[&_th]:px-3 [&_th]:py-2 [&_th]:bg-sunken [&_th]:border [&_th]:border-rule [&_th]:font-bold [&_th]:text-muted [&_th]:text-left',
        '[&_td]:px-3 [&_td]:py-2 [&_td]:border [&_td]:border-rule [&_td]:text-foreground',
        '[&_img]:max-w-full [&_img]:rounded-[--radius-md]',
        className,
      )}
      style={style}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
