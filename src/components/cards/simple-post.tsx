import React from "react";
import { CategoryBadge } from "../CategoryBadge";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, MessageCircle, Share2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export interface SimplePostCardProps {
  badges: {
    title: string;
    color: string;
  }[];
  title: string;
  descriptions: string[];
  author: {
    name: string;
    imageUrl: string;
  };
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
}

export const SimplePostCard: React.FC<SimplePostCardProps> = ({
  badges,
  title,
  descriptions,
  author,
  date,
  link = "#",
  viewCount,
  className,
  image,
}) => {
  return (
    <div className={cn("flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border", className)}>
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
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={cn("object-cover", image.className)}
            fill={image.fill}
            sizes={image.sizes}
          />
        </div>
      )}

      <h3 className="body-title-medium text-foreground">{title}</h3>

      <div className="flex flex-col gap-2">
        {descriptions.map((desc, index) => (
          <p key={index} className="body-paragraph text-muted-foreground line-clamp-2">
            {desc}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-9">
              <Heart className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-9">
              <MessageCircle className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-9">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>

        <Link href={link} className={`${buttonVariants({ variant: "default", size: "default" })} gap-2`}>
          Explorar
          {viewCount && <span className="opacity-80">| {viewCount}</span>}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
};
