"use client"

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

export interface TopicCardProps {
  title: string;
  description: string;
  isFollowing?: boolean;
  followersIncrease?: number;
}

const iconMap = {
  Users,
  Zap,
  UserCog,
  BookOpen,
  Video,
  FileText,
  MoreVertical,
};

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof iconMap;
  disabled?: boolean;
  isLoading?: boolean;
  dropdownItems?: Array<
    | { label: string; icon: keyof typeof iconMap; href: string }
    | { label: string; icon: keyof typeof iconMap; onClick: string }
  >;
}

const dashboardCards: { cards: DashboardCard[] } = {
  cards: [
    {
      id: "subscribers",
      title: "Assinantes",
      description: "Acompanhe e administre os assinantes da plataforma.",
      icon: "Users",
      dropdownItems: [
        { label: "Ver assinantes", icon: "Users", href: "/admin/subscribers" },
        { label: "Editar planos", icon: "Zap", href: "/admin/subscribers/plans" },
        { label: "Relatórios", icon: "FileText", href: "/admin/subscribers/reports" },
      ],
    },
    {
      id: "plans",
      title: "Planos de Assinatura",
      description: "Configure os planos de assinatura disponíveis.",
      icon: "Zap",
      dropdownItems: [
        { label: "Ver planos", icon: "Zap", href: "/admin/plans" },
        { label: "Criar novo plano", icon: "FileText", href: "/admin/plans/create" },
        { label: "Editar planos", icon: "UserCog", href: "/admin/plans/edit" },
      ],
    },
    {
      id: "users",
      title: "Usuários",
      description: "Administre contas, permissões e acesso de usuários.",
      icon: "UserCog",
      dropdownItems: [
        { label: "Ver usuários", icon: "Users", href: "/admin/users" },
        { label: "Adicionar usuário", icon: "FileText", href: "/admin/users/create" },
        { label: "Permissões", icon: "Zap", href: "/admin/users/permissions" },
      ],
    },
    {
      id: "topics",
      title: "Tópicos",
      description: "Organize e administre tópicos e categorias de conteúdo.",
      icon: "BookOpen",
      dropdownItems: [
        { label: "Ver tópicos", icon: "BookOpen", href: "/admin/topics" },
        { label: "Criar tópico", icon: "FileText", href: "/admin/topics/create" },
        { label: "Editar tópicos", icon: "UserCog", href: "/admin/topics/edit" },
      ],
    },
    {
      id: "video-aulas",
      title: "Vídeo Aulas",
      description: "Administre e organize as vídeo aulas disponíveis.",
      icon: "Video",
      dropdownItems: [
        { label: "Ver vídeo aulas", icon: "Video", href: "/admin/video-aulas" },
        { label: "Publicar aula", icon: "FileText", href: "/admin/video-aulas/create" },
        { label: "Editar aulas", icon: "UserCog", href: "/admin/video-aulas/edit" },
      ],
    },
    {
      id: "articles",
      title: "Artigos",
      description: "Crie, edite e publique artigos e conteúdo educacional.",
      icon: "FileText",
      dropdownItems: [
        { label: "Ver artigos", icon: "FileText", href: "/admin/articles" },
        { label: "Criar artigo", icon: "Users", href: "/admin/articles/create" },
        { label: "Editar artigos", icon: "UserCog", href: "/admin/articles/edit" },
      ],
    },
  ],
};

export const TopicCard: React.FC<TopicCardProps> = ({ title, description, isFollowing = false, followersIncrease }) => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
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

          <InputSearch placeholder="Insira um termo para buscar" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {dashboardCards.cards.map((card) => {
              const IconComponent = iconMap[card.icon as keyof typeof iconMap];
              return (
                <div key={card.id} className="relative">
                  <SimpleIconCard
                    title={card.title}
                    description={card.description}
                    icon={IconComponent}
                    isLoading={card.isLoading}
                  />
                  <DropdownMenu
                    open={dropdownOpen === card.id}
                    onOpenChange={(open) => setDropdownOpen(open ? card.id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={card.disabled}
                        className="absolute top-4 right-4 z-10"
                        aria-label={`Opções de ${card.title}`}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {card.dropdownItems?.map((item, idx: number) => {
                        const ItemIcon = iconMap[item.icon as keyof typeof iconMap];

                        if ("href" in item) {
                          return (
                            <DropdownMenuItem key={idx} asChild>
                              <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                                {ItemIcon && <ItemIcon className="h-4 w-4" />}
                                <span>{item.label}</span>
                              </Link>
                            </DropdownMenuItem>
                          );
                        }

                        return null;
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>

          <Separator />
        </React.Fragment>
      </BaseCard>
    </Reveal>
  );
};
