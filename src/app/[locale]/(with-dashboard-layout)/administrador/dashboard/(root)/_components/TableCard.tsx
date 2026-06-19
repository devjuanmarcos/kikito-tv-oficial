import React, { useState } from "react";
import Link from "next/link";

import { Reveal } from "@/components/Reveal";
import { BaseCard } from "@/components/cards/base-card";
import { SimpleIconCard } from "@/components/cards/simple-icon";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ArrowRight, MoreVertical, Users, Zap, UserCog, BookOpen, Video, FileText } from "lucide-react";
import { InputSearch } from "@/components/ui/input-search";
import { Separator } from "@/components/ui/separator";
import { UsersTable } from "./users-table";

export interface TableCardProps {
  title: string;
  description: string;
  isFollowing?: boolean;
  followersIncrease?: number;
}

export const TableCard: React.FC<TableCardProps> = ({ title, description, isFollowing = false, followersIncrease }) => {
  return (
    <Reveal width="100%">
      <BaseCard>
        <React.Fragment>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between gap-2 w-full flex-wrap">
              <div className="flex gap-2 flex-wrap">
                <CategoryBadge title="Gerenciamento rápido de informações" color="bg-primary" variant="outline" />
              </div>
              <Button variant={isFollowing ? "outline" : "default"} size="default" className="gap-2">
                {isFollowing ? "Seguindo" : "Follow"}
                {followersIncrease && <span className="opacity-80">| {followersIncrease}</span>}
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <h2 className="heading-02-bold text-foreground">{title}</h2>
            <p className="body-paragraph text-muted-foreground">{description}</p>
          </div>

          <UsersTable />
        </React.Fragment>
      </BaseCard>
    </Reveal>
  );
};
