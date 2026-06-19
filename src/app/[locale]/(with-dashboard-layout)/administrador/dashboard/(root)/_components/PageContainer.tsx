"use client";

import { PageBoxLayout } from "@/components/layout/page-box";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { Shield } from "lucide-react";
import { TopicCard } from "./TopicCard";
import { TableCard } from "./TableCard";

export const PageContainer = () => {
  return (
    <PageBoxLayout
      breadcrumbs={<PageBreadcrumbs />}
      titleIcon={{ icon: Shield }}
      title="Painel Administrativo - Boas vindas!"
      description="Gerencie turmas, alunos, matérias, empresas e acompanhe as métricas da plataforma de ensino."
    >
      <div className="flex min-w-0 flex-col gap-8">
        <TopicCard
          title="Ferramentas de Administração"
          description="Acesso centralizado para gerenciar assinantes, planos, usuários, conteúdo educacional e acompanhar métricas da plataforma."
          followersIncrease={120}
          isFollowing={false}
        />
        <TableCard
          title="Usuários"
          description="Gerencie usuários, planos, assinantes e acompanhe as métricas da plataforma."
        />
      </div>
    </PageBoxLayout>
  );
};
