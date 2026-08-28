"use client";
import { useState } from "react";

import { Badge } from "@/components/ui/cn/badge/Badge";
import { Button } from "@/components/ui/cn/button/Button";
import { cn } from "@/lib/utils";

import type { UserCardProps } from "./user-card.types";

export function UserCard({
  name,
  username,
  bio,
  avatar,
  avatarFallback,
  stats = [],
  badge,
  followed: controlledFollowed,
  onFollow,
  coverColor,
  className,
  style,
}: UserCardProps) {
  const [internalFollowed, setInternalFollowed] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const isControlled = controlledFollowed !== undefined;
  const followed = isControlled ? controlledFollowed : internalFollowed;

  function handleFollow() {
    if (!isControlled) setInternalFollowed((f) => !f);
    onFollow?.(!followed);
  }

  const initials = (avatarFallback ?? name).slice(0, 2).toUpperCase();
  const showImg = avatar && !avatarError;

  return (
    // rounded-lg (14px): mais próximo de 16px original, sem match exato na escala (entre lg e xl)
    <div className={cn("bg-raised border border-rule rounded-lg overflow-hidden w-[280px]", className)} style={style}>
      <div
        className="h-20"
        // gradiente de capa precisa das duas cores de marca simultâneas — sem token composto
        // equivalente (bg-patina/bg-kinpaku são sólidas, não um par de gradiente pronto)
        style={{ background: coverColor ?? "linear-gradient(135deg,var(--ks-primary),var(--ks-kinpaku))" }}
      />
      {/* px-5/pb-5 (20px): sem match exato na escala de spacing (entre lg e xl) */}
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-7 mb-(--spacing-md)">
          <div className="w-14 h-14 rounded-full border-[3px] border-raised bg-patina flex items-center justify-center text-body-title font-bold text-patina-fg overflow-hidden shrink-0">
            {showImg ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              initials
            )}
          </div>
          {onFollow !== undefined && (
            <Button
              type="button"
              variant={followed ? "solid" : "outline"}
              intent="primary"
              size="sm"
              rounded="full"
              onClick={handleFollow}
            >
              {followed ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        <div className="text-body-paragraph font-bold text-foreground">{name}</div>
        {username && <div className="text-body-caption text-faint mt-(--spacing-3xs)">@{username}</div>}
        {badge && (
          <Badge intent="primary" variant="soft" size="sm" className="mt-(--spacing-2xs)">
            {badge}
          </Badge>
        )}
        {bio && <div className="text-body-caption text-muted mt-(--spacing-sm) leading-relaxed">{bio}</div>}

        {stats.length > 0 && (
          // gap-5/mt-[14px]/pt-[14px] (20px/14px): sem match exato na escala de spacing
          <div className="flex gap-5 mt-[14px] pt-[14px] border-t border-rule">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-(--spacing-3xs)">
                <span className="text-body-paragraph font-bold tabular-nums">{s.value}</span>
                {/* below scale minimum: micro-label de suporte sob o valor do stat */}
                <span className="text-[0.625rem] text-faint uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
