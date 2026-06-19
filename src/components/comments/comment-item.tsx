"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  SendHorizonal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Comment } from "@/@types/services/topics";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTimeAgo(dateStr: string, timeStr?: string): string {
  const full = timeStr ? `${dateStr}T${timeStr}:00` : dateStr;
  const date = new Date(full);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return date.toLocaleDateString("pt-BR");
  if (diffDays > 0) return `${diffDays}d atrás`;
  if (diffHours > 0) return `${diffHours}h atrás`;
  if (diffMins > 0) return `${diffMins}min atrás`;
  return "agora";
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onAddReply: (parentId: string, text: string) => void;
  onReact: (commentId: string, reaction: "like" | "dislike") => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth = 0,
  onAddReply,
  onReact,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(depth < 1);

  const maxDepth = 2;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length ?? 0;

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onAddReply(comment.id, replyText.trim());
    setReplyText("");
    setIsReplying(false);
    setShowReplies(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply();
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", depth > 0 && "ml-6 sm:ml-10")}>
      <div className="flex gap-3 items-start group">
        <Avatar className="size-8 mt-0.5 shrink-0">
          <AvatarImage src={comment.imageUrl} alt={comment.name} />
          <AvatarFallback className="body-caption bg-muted-surface text-muted-foreground">
            {getInitials(comment.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="rounded-xl bg-card border border-border px-4 py-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="body-callout-bold text-foreground truncate">
                {comment.name}
              </span>
              <span className="body-caption text-muted-foreground whitespace-nowrap">
                {formatTimeAgo(comment.date, comment.time)}
              </span>
            </div>
            <p className="body-callout text-foreground mt-1 whitespace-pre-wrap break-words">
              {comment.text}
            </p>
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-1 mt-1 px-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2 gap-1 body-caption text-muted-foreground hover:text-primary",
                comment.reactions?.userReaction === "like" && "text-primary"
              )}
              onClick={() => onReact(comment.id, "like")}
            >
              <ThumbsUp className="size-3.5" />
              {(comment.reactions?.likes ?? 0) > 0 && (
                <span>{comment.reactions?.likes}</span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2 gap-1 body-caption text-muted-foreground hover:text-destructive",
                comment.reactions?.userReaction === "dislike" &&
                  "text-destructive"
              )}
              onClick={() => onReact(comment.id, "dislike")}
            >
              <ThumbsDown className="size-3.5" />
              {(comment.reactions?.dislikes ?? 0) > 0 && (
                <span>{comment.reactions?.dislikes}</span>
              )}
            </Button>

            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 body-caption text-muted-foreground hover:text-foreground"
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageSquare className="size-3.5" />
                Responder
              </Button>
            )}

            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 body-caption text-primary hover:text-primary"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
                {replyCount}{" "}
                {replyCount === 1 ? "resposta" : "respostas"}
              </Button>
            )}
          </div>

          {/* Reply input */}
          {isReplying && (
            <div className="flex gap-2 mt-2 items-end">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Responder a ${comment.name.split(" ")[0]}...`}
                className="min-h-[40px] body-callout resize-none rounded-xl"
                rows={1}
              />
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 body-caption text-muted-foreground"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 gap-1"
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                >
                  <SendHorizonal className="size-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Nested replies */}
          {hasReplies && showReplies && (
            <div className="flex flex-col gap-3 mt-3">
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onAddReply={onAddReply}
                  onReact={onReact}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
