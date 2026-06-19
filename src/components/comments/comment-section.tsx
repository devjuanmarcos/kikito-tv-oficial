"use client";

import React, { useState, useRef, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SendHorizonal, MessageCircle } from "lucide-react";
import { CommentItem } from "./comment-item";
import type { Comment } from "@/@types/services/topics";
import { nanoid } from "nanoid";

interface CommentSectionProps {
  comments: Comment[];
  className?: string;
}

function addReplyToComment(
  comments: Comment[],
  parentId: string,
  reply: Comment
): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...(c.replies || []), reply] };
    }
    if (c.replies && c.replies.length > 0) {
      return {
        ...c,
        replies: addReplyToComment(c.replies, parentId, reply),
      };
    }
    return c;
  });
}

function toggleReaction(
  comments: Comment[],
  commentId: string,
  reaction: "like" | "dislike"
): Comment[] {
  return comments.map((c) => {
    if (c.id === commentId) {
      const current = c.reactions?.userReaction;
      const likes = c.reactions?.likes ?? 0;
      const dislikes = c.reactions?.dislikes ?? 0;

      if (current === reaction) {
        return {
          ...c,
          reactions: {
            likes: reaction === "like" ? likes - 1 : likes,
            dislikes: reaction === "dislike" ? dislikes - 1 : dislikes,
            userReaction: null,
          },
        };
      }

      return {
        ...c,
        reactions: {
          likes:
            reaction === "like"
              ? likes + 1
              : current === "like"
                ? likes - 1
                : likes,
          dislikes:
            reaction === "dislike"
              ? dislikes + 1
              : current === "dislike"
                ? dislikes - 1
                : dislikes,
          userReaction: reaction,
        },
      };
    }
    if (c.replies && c.replies.length > 0) {
      return {
        ...c,
        replies: toggleReaction(c.replies, commentId, reaction),
      };
    }
    return c;
  });
}

function countAllComments(comments: Comment[]): number {
  return comments.reduce((acc, c) => {
    return acc + 1 + countAllComments(c.replies || []);
  }, 0);
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments: initialComments,
  className,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const totalComments = countAllComments(comments);

  const handleAddComment = useCallback(() => {
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: nanoid(),
      name: "Você",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      text: newCommentText.trim(),
      reactions: { likes: 0, dislikes: 0, userReaction: null },
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText("");
    setIsFocused(false);
  }, [newCommentText]);

  const handleAddReply = useCallback(
    (parentId: string, text: string) => {
      const reply: Comment = {
        id: nanoid(),
        name: "Você",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        text,
        reactions: { likes: 0, dislikes: 0, userReaction: null },
        replies: [],
      };
      setComments((prev) => addReplyToComment(prev, parentId, reply));
    },
    []
  );

  const handleReact = useCallback(
    (commentId: string, reaction: "like" | "dislike") => {
      setComments((prev) => toggleReaction(prev, commentId, reaction));
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="size-5 text-foreground" />
        <h4 className="body-title-medium text-foreground">
          Comentários
        </h4>
        <span className="body-callout text-muted-foreground">
          ({totalComments})
        </span>
      </div>

      {/* New comment input */}
      <div className="flex gap-3 items-start mb-5">
        <Avatar className="size-8 mt-0.5 shrink-0">
          <AvatarFallback className="body-caption bg-primary text-background">
            VC
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            ref={textareaRef}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva um comentário..."
            className="min-h-[44px] body-callout resize-none rounded-xl"
            rows={isFocused ? 3 : 1}
          />
          {isFocused && (
            <div className="flex items-center justify-between">
              <span className="body-caption text-muted-foreground">
                Pressione <kbd className="px-1 py-0.5 rounded border border-border bg-muted-surface body-caption">Enter</kbd> para enviar, <kbd className="px-1 py-0.5 rounded border border-border bg-muted-surface body-caption">Shift+Enter</kbd> para nova linha
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 body-caption text-muted-foreground"
                  onClick={() => {
                    setIsFocused(false);
                    setNewCommentText("");
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={handleAddComment}
                  disabled={!newCommentText.trim()}
                >
                  <SendHorizonal className="size-3.5" />
                  Comentar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Comments list */}
      <ScrollArea className="max-h-[420px] pr-2">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <MessageCircle className="size-10 text-muted-foreground/40" />
            <p className="body-callout text-muted-foreground">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onAddReply={handleAddReply}
                onReact={handleReact}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
