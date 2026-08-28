import type React from "react";

export type ChatBubbleSide = "left" | "right";
export type ChatBubbleStatus = "sent" | "delivered" | "read" | "error";

export interface ChatBubbleProps {
  message: string;
  side?: ChatBubbleSide;
  time?: string;
  senderName?: string;
  avatar?: string;
  avatarFallback?: string;
  status?: ChatBubbleStatus;
  isTyping?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
