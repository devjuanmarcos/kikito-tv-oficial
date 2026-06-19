import { cn } from "@/lib/utils";

interface ImageItem {
  src: string;
  alt: string;
}

interface AnimatedCanopyProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  repeat?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  applyMask?: boolean;
}

const AnimatedCanopy = ({
  children,
  vertical = false,
  repeat = 4,
  pauseOnHover = false,
  reverse = false,
  className,
  applyMask = true,
  ...props
}: AnimatedCanopyProps) => (
  <div
    {...props}
    className={cn(
      "group relative flex h-full w-full overflow-hidden p-2 [--duration:10s] [--gap:12px] [gap:var(--gap)]",
      vertical ? "flex-col" : "flex-row",
      className
    )}
  >
    {Array.from({ length: repeat }).map((_, index) => (
      <div
        key={`item-${index}`}
        className={cn("flex shrink-0 [gap:var(--gap)]", {
          "group-hover:[animation-play-state:paused]": pauseOnHover,
          "[animation-direction:reverse]": reverse,
          "animate-canopy-horizontal flex-row": !vertical,
          "animate-canopy-vertical flex-col": vertical,
        })}
      >
        {children}
      </div>
    ))}
    {applyMask && (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 h-full w-full from-white/50 from-5% via-transparent via-50% to-white/50 to-95% dark:from-gray-800/50 dark:via-transparent dark:to-gray-800/50",
          vertical ? "bg-gradient-to-b" : "bg-gradient-to-r"
        )}
      />
    )}
  </div>
);

const ImageCard = ({ image, className }: { image: ImageItem; className?: string }) => (
  <div
    className={cn(
      "group mx-2 flex h-32 w-80 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-transparent p-3 transition-all hover:border-blue-400 hover:shadow-[0_0_10px_#60a5fa] dark:hover:border-blue-400",
      className
    )}
  >
    <div className="flex items-center justify-center w-full h-full">
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover rounded-lg"
        style={{ aspectRatio: "796/679" }}
      />
    </div>
  </div>
);

export const AnimatedImages = ({
  data,
  className,
  cardClassName,
}: {
  data: ImageItem[];
  className?: string;
  cardClassName?: string;
}) => (
  <div className={cn("w-full overflow-x-hidden py-4", className)}>
    {[false, true, false].map((reverse, index) => (
      <AnimatedCanopy
        key={`Canopy-${index}`}
        reverse={reverse}
        className="[--duration:25s]"
        pauseOnHover
        applyMask={false}
        repeat={3}
      >
        {data.map((image, index) => (
          <ImageCard key={`${image.src}-${index}`} image={image} className={cardClassName} />
        ))}
      </AnimatedCanopy>
    ))}
  </div>
);
