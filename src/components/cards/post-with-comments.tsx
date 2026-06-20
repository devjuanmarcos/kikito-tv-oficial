"use client"

import React, { useState } from "react";
import { CategoryBadge } from "../CategoryBadge";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, MessageCircle, Share2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { CommentSection } from "@/components/comments";
import type { Comment } from "@/@types/services/topics";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export interface PostAuthor {
  name: string;
  imageUrl: string;
}

export interface SharedByInfo {
  name: string;
  imageUrl: string;
  comment: string;
  date?: string;
}

export interface PostWithCommentsProps {
  badges: {
    title: string;
    color: string;
  }[];
  title: string;
  descriptions: string[];
  author: PostAuthor;
  date?: string;
  link?: string;
  viewCount?: number;
  className?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    fill?: boolean;
    sizes?: string;
  };
  comments: Comment[];
  sharedBy?: SharedByInfo;
}

export const PostWithComments: React.FC<PostWithCommentsProps> = ({
  badges,
  title,
  descriptions,
  author,
  date,
  link = "#",
  viewCount,
  className,
  image,
  comments,
  sharedBy,
}) => {
  const [open, setOpen] = useState(false);

  const innerPostCard = (
    <div className={cn(
      "flex flex-col gap-4 rounded-2xl bg-background border border-border",
      sharedBy ? "p-4" : "p-6",
      !sharedBy && className
    )}>
      {/* Header: Badges + Date */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {badges.map((badge, index) => (
            <CategoryBadge key={index} title={badge.title} color={badge.color} variant="outline" />
          ))}
        </div>
        {date && (
          <span className="body-paragraph text-muted-foreground flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-foreground" />
            {date}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="body-title-medium text-foreground">{title}</h3>

      {/* Descriptions */}
      <div className="flex flex-col gap-2">
        {descriptions.map((desc, index) => (
          <p key={index} className="body-paragraph text-muted-foreground line-clamp-2">
            {desc}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {image && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt || "Post Image"}
              width={image.width || 300}
              height={image.height || 200}
              className={cn("object-cover w-full h-auto", image.className)}
              fill={image.fill}
              sizes={image.sizes}
            />
          </div>
        )}

        {/* Footer: Author + Actions + Link */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Author: single avatar + name */}
            <div className="flex items-center gap-2">
              <Avatar className="size-8 border-2 border-card">
                <AvatarImage src={author.imageUrl} alt={author.name} />
                <AvatarFallback className="body-caption">
                  {getInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              <span className="body-callout-bold text-foreground truncate max-w-[160px]">
                {author.name}
              </span>
            </div>

            {/* Action Icons — only on non-shared cards */}
            {!sharedBy && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="size-9">
                  <Heart className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 relative"
                  onClick={() => setOpen(true)}
                  aria-label="Abrir comentários"
                >
                  <MessageCircle className="size-4" />
                  {comments.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-background body-caption flex items-center justify-center">
                      {comments.length}
                    </span>
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="size-9">
                  <Share2 className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Right: Explore Button */}
          <Link href={link} className={`${buttonVariants({ variant: "default", size: "default" })} gap-2`}>
            Explorar
            {viewCount && <span className="opacity-80">| {viewCount}</span>}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  const cardContent = sharedBy ? (
    <div className={cn("flex flex-col gap-3 p-6 rounded-2xl bg-background border border-border", className)}>
      {/* Sharer header */}
      <div className="flex items-center gap-3">
        <Avatar className="size-10 border-2 border-card">
          <AvatarImage src={sharedBy.imageUrl} alt={sharedBy.name} />
          <AvatarFallback className="body-callout">
            {getInitials(sharedBy.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="body-callout-bold text-foreground truncate">
            {sharedBy.name}
          </span>
          <span className="body-caption text-muted-foreground">
            compartilhou uma publicação
            {sharedBy.date && <> · {sharedBy.date}</>}
          </span>
        </div>
      </div>

      {/* Sharer's comment */}
      {sharedBy.comment && (
        <p className="body-paragraph text-foreground px-1">
          {sharedBy.comment}
        </p>
      )}

      {/* Nested original post */}
      {innerPostCard}

      {/* Action buttons for the share */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="ghost" size="icon" className="size-9">
          <Heart className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 relative"
          onClick={() => setOpen(true)}
          aria-label="Abrir comentários"
        >
          <MessageCircle className="size-4" />
          {comments.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-background body-caption flex items-center justify-center">
              {comments.length}
            </span>
          )}
        </Button>
        <Button variant="ghost" size="icon" className="size-9">
          <Share2 className="size-4" />
        </Button>
      </div>
    </div>
  ) : (
    innerPostCard
  );

  const dialogContent = (
    <div className="flex flex-col gap-6 w-full">
      {sharedBy && (
        <>
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border-2 border-card">
              <AvatarImage src={sharedBy.imageUrl} alt={sharedBy.name} />
              <AvatarFallback className="body-callout">
                {getInitials(sharedBy.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="body-callout-bold text-foreground">{sharedBy.name}</span>
              <span className="body-caption text-muted-foreground">
                compartilhou uma publicação
                {sharedBy.date && <> · {sharedBy.date}</>}
              </span>
            </div>
          </div>
          {sharedBy.comment && (
            <p className="body-paragraph text-foreground">{sharedBy.comment}</p>
          )}
          <Separator />
        </>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {badges.map((badge, index) => (
            <CategoryBadge key={index} title={badge.title} color={badge.color} variant="outline" />
          ))}
        </div>
        {date && (
          <span className="body-paragraph text-muted-foreground flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-foreground" />
            {date}
          </span>
        )}
      </div>

      {image && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt || "Post Image"}
            width={image.width || 300}
            height={image.height || 200}
            className={cn("object-cover w-full h-auto", image.className)}
            fill={image.fill}
            sizes={image.sizes}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {descriptions.map((desc, index) => (
          <p key={index} className="body-paragraph text-muted-foreground">{desc}</p>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Avatar className="size-8 border-2 border-card">
            <AvatarImage src={author.imageUrl} alt={author.name} />
            <AvatarFallback className="body-caption">{getInitials(author.name)}</AvatarFallback>
          </Avatar>
          <span className="body-callout-bold text-foreground">{author.name}</span>
        </div>
        <Link href={link} className={`${buttonVariants({ variant: "default", size: "default" })} gap-2`}>
          Explorar
          {viewCount && <span className="opacity-80">| {viewCount}</span>}
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <Separator />

      <CommentSection comments={comments} />
    </div>
  );

  return (
    <>
      {cardContent}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="body-title-bold text-foreground">{title}</DialogTitle>
            <DialogDescription className="body-callout text-muted-foreground">
              {sharedBy
                ? `Compartilhamento de ${sharedBy.name}`
                : "Comentários e detalhes do post"}
            </DialogDescription>
          </DialogHeader>
          {dialogContent}
        </DialogContent>
      </Dialog>
    </>
  );
};
