"use client";
import { Avatar } from "@/components/ui/cn/avatar";
import { cn } from "@/lib/utils";

import type { ChatBubbleProps, ChatBubbleStatus } from "./chat-bubble.types";

const STATUS_ICON: Record<ChatBubbleStatus, string> = {
  sent: "✓",
  delivered: "✓✓",
  read: "✓✓",
  error: "⚠",
};
const STATUS_CLS: Record<ChatBubbleStatus, string> = {
  sent: "text-faint",
  delivered: "text-faint",
  read: "text-info",
  error: "text-danger",
};
const STATUS_LABEL: Record<ChatBubbleStatus, string> = {
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  error: "Failed to send",
};

export function ChatBubble({
  message,
  side = "left",
  time,
  senderName,
  avatar,
  avatarFallback,
  status,
  isTyping = false,
  className,
  style,
}: ChatBubbleProps) {
  const isLeft = side === "left";
  const hasAvatar = !!avatar || !!avatarFallback;

  return (
    <div
      style={style}
      className={cn("flex gap-(--spacing-sm)", isLeft ? "flex-row items-end" : "flex-row-reverse items-end", className)}
    >
      {hasAvatar && isLeft && <Avatar src={avatar} name={avatarFallback} alt={senderName} size="xs" />}
      {hasAvatar && !isLeft && <div className="w-6" />}

      <div className={cn("flex flex-col gap-(--spacing-3xs) max-w-[70%]", isLeft ? "items-start" : "items-end")}>
        {senderName && isLeft && (
          // below scale minimum: rótulo curto de remetente acima da bolha, decorativo
          <span className="text-[0.65rem] font-medium text-faint px-(--spacing-2xs)">{senderName}</span>
        )}

        <div
          className={cn(
            "rounded-2xl px-(--spacing-md) py-(--spacing-sm) text-body-callout leading-snug break-words",
            isLeft ? "rounded-bl-sm bg-graphite-2 text-foreground" : "rounded-br-sm bg-patina text-patina-fg"
          )}
        >
          {isTyping ? (
            <span role="status" aria-label="Typing" className="flex items-center gap-(--spacing-2xs) h-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce"
                  style={{ animationDelay: `${i * 160}ms`, animationDuration: "800ms" }}
                />
              ))}
            </span>
          ) : (
            message
          )}
        </div>

        {(time || status) && !isTyping && (
          <div
            className={cn("flex items-center gap-(--spacing-2xs) px-(--spacing-2xs)", isLeft ? "" : "flex-row-reverse")}
          >
            {/* below scale minimum: metadado secundário (horário/status), não conteúdo primário */}
            {time && <span className="text-[0.6rem] text-faint">{time}</span>}
            {status && !isLeft && (
              <span aria-label={STATUS_LABEL[status]} className={cn("text-[0.6rem] font-bold", STATUS_CLS[status])}>
                {STATUS_ICON[status]}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
