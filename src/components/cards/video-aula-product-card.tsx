"use client";

import React from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, ShoppingCart, Calendar, CheckCircle, Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { VideoAula, VideoAulaType } from "@/@types/video-aula";

const DEFAULT_BANNER_URL =
  "https://marketplace.canva.com/EAGNFIKrpWU/1/0/1600w/canva-banner-p%C3%A1gina-de-pagamento-da-hotmart-curso-online-marketing-digital-roxo-e-branco-blRdMY-1b1E.jpg";

const TYPE_LABELS: Record<VideoAulaType, string> = {
  FREE: "Gratuita",
  PAID: "Paga",
  PAID_WITH_PLAN_DISCOUNT: "Com desconto por plano",
};

const TYPE_BADGE_COLORS: Record<VideoAulaType, string> = {
  FREE: "bg-success",
  PAID: "bg-primary",
  PAID_WITH_PLAN_DISCOUNT: "bg-info",
};

const STATUS_LABELS: Record<VideoAula["status"], string> = {
  ACTIVE: "Disponível",
  ARCHIVED: "Arquivada",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export interface VideoAulaProductCardProps {
  videoAula: VideoAula;
  className?: string;
  purchaseLink?: string;
}

export const VideoAulaProductCard: React.FC<VideoAulaProductCardProps> = ({ videoAula, className, purchaseLink }) => {
  const { title, description, link, type, price, bannerUrl, status, createdAt, author, engagement } = videoAula;
  const isFree = type === "FREE";
  const label = TYPE_LABELS[type];
  const badgeColor = TYPE_BADGE_COLORS[type];
  const displayBannerUrl = bannerUrl ?? DEFAULT_BANNER_URL;

  const ctaHref = isFree ? link : purchaseLink ?? link;
  const ctaLabel = isFree ? "Assistir" : "Comprar";
  const CtaIcon = isFree ? Play : ShoppingCart;

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-0 rounded-2xl bg-background border border-border overflow-hidden w-full min-h-0",
        className
      )}
    >
      {/* Banner */}
      <div className="relative w-full md:w-[320px] lg:w-[380px] shrink-0 aspect-video md:aspect-auto md:min-h-[240px]">
        <Image
          src={displayBannerUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 380px"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6 justify-between">
        <div className="flex flex-col gap-3">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge title={label} color={badgeColor} variant="outline" />
            <CategoryBadge title={STATUS_LABELS[status] ?? ""} icon={CheckCircle} useIcon={true} />
            <CategoryBadge title={`Cadastro: ${formatDate(createdAt)}`} icon={Calendar} useIcon={true} />
          </div>

          {/* Title — same size as post card */}
          <h3 className="body-title-medium text-foreground leading-tight">{title}</h3>

          {/* Description — same size as post card */}
          <p className="body-paragraph text-muted-foreground line-clamp-2">{description}</p>

          {/* Price tag if paid */}
          {!isFree && price != null && (
            <span className="body-title-bold text-foreground">{formatPrice(price)}</span>
          )}
        </div>

        {/* Footer: Author + Actions (left) + CTA (right) — like a post card */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Author avatar + name */}
            <div className="flex items-center gap-2">
              <Avatar className="size-8 border-2 border-card">
                <AvatarImage src={author.imageUrl} alt={author.name} />
                <AvatarFallback className="body-caption">
                  {getInitials(author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="body-callout-bold text-foreground truncate max-w-[160px]">
                  {author.name}
                </span>
                {author.role && (
                  <span className="body-caption text-muted-foreground truncate max-w-[160px]">
                    {author.role}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-9 relative">
                <Heart className="size-4" />
                {engagement.likesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-background body-caption flex items-center justify-center">
                    {engagement.likesCount > 99 ? "99+" : engagement.likesCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="size-9 relative">
                <MessageCircle className="size-4" />
                {engagement.commentsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-primary text-background body-caption flex items-center justify-center">
                    {engagement.commentsCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="size-9">
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          {/* CTA button */}
          <Link
            href={ctaHref}
            target={ctaHref.startsWith("http") ? "_blank" : undefined}
            rel={ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className={cn(buttonVariants({ variant: "default", size: "default" }), "gap-2")}
          >
            {ctaLabel}
            <CtaIcon className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
