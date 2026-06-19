import { cn } from '@/lib/utils'
import type { VideoCardProps } from './video-card.types'

export function VideoCard({
  poster,
  title = 'Untitled Video',
  description,
  duration,
  category,
  views,
  href,
  className,
  style,
}: VideoCardProps) {
  const El = href ? 'a' : 'div'
  return (
    <El
      className={cn(
        'group rounded-[--radius-lg] border border-rule bg-raised overflow-hidden transition-shadow hover:shadow-md',
        href && 'cursor-pointer',
        className
      )}
      style={style}
      {...(href ? { href } : {})}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-graphite overflow-hidden">
        {poster
          ? <img src={poster} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl text-foreground/20">▶</div>
          )
        }
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[1.25rem] translate-x-0.5">
            ▶
          </div>
        </div>
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[0.75rem] font-mono px-1.5 py-0.5 rounded">
            {duration}
          </div>
        )}
        {category && (
          <div className="absolute top-2 left-2 bg-patina text-patina-fg text-[0.6875rem] font-semibold px-2 py-0.5 rounded-full">
            {category}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-1">
        <p className="font-semibold text-foreground text-[0.9375rem] leading-snug line-clamp-2">{title}</p>
        {description && (
          <p className="text-[0.8125rem] text-muted leading-snug line-clamp-2">{description}</p>
        )}
        {views !== undefined && (
          <p className="text-[0.75rem] text-faint mt-0.5">
            {typeof views === 'number' ? `${views.toLocaleString()} views` : views}
          </p>
        )}
      </div>
    </El>
  )
}
