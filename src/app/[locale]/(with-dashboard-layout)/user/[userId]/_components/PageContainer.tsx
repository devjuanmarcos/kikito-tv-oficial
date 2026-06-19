"use client";
import React from "react";
import { PageBoxLayout } from "@/components/layout/page-box";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { Separator } from "@/components/ui/separator";
import { MainBox } from "./MainBox";
import { UserPosts } from "./UserPosts";
import { Briefcase, BookOpen } from "lucide-react";
import { InfoCard } from "@/components/cards/info-card";
import { SimpleSquareTitleIcon } from "@/components/ui/title-icon";
import { Reveal } from "@/components/Reveal";

const academicBackgroundData = {
  academicBackgroundes: [
    {
      id: 1,
      course: "Bacharelado em Enfermagem",
      institution: "Universidade Estadual de Ciências da Saúde",
      completion_year: "2018-12-15",
      highlights: "Monitoria em Anatomia e Neurociência aplicada.",
      location: "Rio de Janeiro, RJ",
    },
    {
      id: 2,
      course: "Especialização em Gerontologia",
      institution: "Hospital Israelita Albert Einstein",
      completion_year: "2020-06-30",
      highlights: "Foco em avaliação multidimensional do idoso.",
      location: "São Paulo, SP",
    },
    {
      id: 3,
      course: "Mestrado em Neuropsicologia Cognitiva",
      institution: "PUC - Pontifícia Universidade Católica",
      completion_year: "2023-11-20",
      highlights: "Dissertação sobre intervenções não farmacológicas em Alzheimer precoce.",
      location: "Porto Alegre, RS",
    },
    {
      id: 4,
      course: "Capacitação em Cuidados Paliativos em Demências Avançadas",
      institution: "Instituto de Ensino e Pesquisa Sírio-Libanês",
      completion_year: "2024-05-10",
      highlights: "Protocolos de manejo de sintomas e conforto familiar.",
      location: "São Paulo, SP",
    },
  ],
};

const expirenceData = {
  expirences: [
    {
      id: 1,
      position: "Consultor em Gestão de Cuidados",
      enterprise: "Centro de Apoio à Memória (CAM)",
      descriptionOfActivities:
        "Elaboração de planos de cuidados individualizados para pacientes com Demência de Corpos de Lewy.",
    },
    {
      id: 2,
      position: "Coordenador de Equipe Multidisciplinar",
      enterprise: "Residencial Geriátrico Longevidade",
      descriptionOfActivities:
        "Supervisão de terapeutas ocupacionais e fisioterapeutas em atividades de estimulação cognitiva.",
    },
    {
      id: 3,
      position: "Enfermeiro Especialista",
      enterprise: "Home Care Senior Care",
      descriptionOfActivities: "Manejo de alterações comportamentais e suporte à família no ambiente domiciliar.",
    },
    {
      id: 4,
      position: "Pesquisador de Campo",
      enterprise: "Associação Brasileira de Alzheimer (ABRAz)",
      descriptionOfActivities:
        "Aplicação de testes neuropsicológicos (MMSE, MoCA) para rastreio de comprometimento cognitivo leve.",
    },
    {
      id: 5,
      position: "Palestrante e Educador",
      enterprise: "Viver Bem Saúde",
      descriptionOfActivities: "Treinamento de cuidadores formais sobre a higiene e segurança do idoso demenciado.",
    },
  ],
};

export const PageContainer = () => {
  return (
    <PageBoxLayout breadcrumbs={<PageBreadcrumbs />} ignoreIcon>
      <div className="flex gap-6 items-start justify-start w-full max-w-[1700px] mx-auto">
        <div className="flex flex-col gap-6 w-full">
          <MainBox />
          <Separator />
          <UserPosts />
        </div>

        <Reveal>
          <div className="flex flex-col">
            {academicBackgroundData &&
              academicBackgroundData.academicBackgroundes &&
              academicBackgroundData.academicBackgroundes.length > 0 && (
                <>
                  <div className="mb-8">
                    <h2 className="body-title-bold mb-3 text-foreground">Formação acadêmica</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {academicBackgroundData?.academicBackgroundes.map((item) => (
                        <InfoCard
                          key={item.id}
                          id={String(item.id)}
                          title={item.course}
                          icon={BookOpen}
                          items={[
                            { label: "Instituição", value: item.institution },
                            {
                              label: "Conclusão",
                              value: item.completion_year ? item.completion_year.split("-")[0] : "Não informado",
                            },
                            ...(item.highlights
                              ? [{ label: "Destaque", value: item.highlights, highlight: true }]
                              : []),
                            { label: "Localização", value: item.location },
                          ]}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

            {expirenceData && expirenceData.expirences && expirenceData.expirences.length > 0 && (
              <>
                <h2 className="body-title-bold mb-3 text-foreground">Experiência profissional</h2>
                <div className="grid grid-cols-1 gap-3">
                  {expirenceData?.expirences.map((item) => (
                    <div className="flex gap-3 [&>*:first-child]:w-20" key={item.id}>
                      <SimpleSquareTitleIcon icon={Briefcase} />
                      <div className="w-full">
                        <p className="font-medium">
                          {item.position} - {item.enterprise}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.descriptionOfActivities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </PageBoxLayout>
  );
};
