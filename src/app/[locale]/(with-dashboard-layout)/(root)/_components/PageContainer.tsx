"use client";

import { PageBoxLayout } from "@/components/layout/page-box";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { AuroraBackgroundMainRoot } from "./aurora-background";
import { TopicCard } from "@/components/cards/topic-card";
import { mockTopics } from "@/mockdata";

export const PageContainer = () => {
  const mockPosts = [
    {
      badges: [
        { title: "Demência", color: "bg-blue-500" },
        { title: "Pesquisa", color: "bg-purple-500" },
      ],
      title: "Novas abordagens para o diagnóstico precoce da demência",
      descriptions: [
        "Pesquisadores brasileiros desenvolvem métodos inovadores para identificar sinais iniciais de demência, possibilitando intervenções mais eficazes.",
        "O estudo destaca a importância do acompanhamento multidisciplinar e do suporte familiar desde os primeiros sintomas.",
      ],
      persons: [
        { name: "Dra. Ana Souza", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Dr. Carlos Mendes", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Enf. Lucia Ferreira", imageUrl: "/img/avatar-placeholder.png" },
      ],
      date: "10 de Jan",
      link: "/post/1",
      viewCount: 1920,
    },
    {
      badges: [
        { title: "Cuidado", color: "bg-green-500" },
        { title: "Família", color: "bg-yellow-500" },
      ],
      title: "O papel da família no suporte à pessoa com demência",
      descriptions: [
        "A participação ativa dos familiares é fundamental para a qualidade de vida do paciente com demência.",
        "Especialistas recomendam estratégias de comunicação e acolhimento para lidar com os desafios do dia a dia.",
      ],
      persons: [
        { name: "João Silva", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Maria Santos", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Pedro Costa", imageUrl: "/img/avatar-placeholder.png" },
      ],
      date: "12 de Jan",
      link: "/post/2",
      viewCount: 1580,
    },
    {
      badges: [
        { title: "Eventos", color: "bg-pink-500" },
        { title: "Conscientização", color: "bg-orange-500" },
      ],
      title: "Semana Nacional de Conscientização sobre Demência",
      descriptions: [
        "A campanha visa informar a população sobre os sinais, sintomas e formas de prevenção da demência.",
        "Participe dos eventos online e presenciais promovidos pela Comunidade Lumen!",
      ],
      persons: [
        { name: "Bruno Alves", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Fernanda Lima", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Gabriel Souza", imageUrl: "/img/avatar-placeholder.png" },
      ],
      date: "15 de Jan",
      link: "/post/3",
      viewCount: 990,
    },
    // Novo post 1
    {
      badges: [
        { title: "Tecnologia", color: "bg-cyan-500" },
        { title: "Inovação", color: "bg-indigo-500" },
      ],
      title: "Aplicativos móveis auxiliam no cuidado de pacientes com demência",
      descriptions: [
        "Ferramentas digitais estão transformando o acompanhamento diário e a comunicação entre cuidadores e profissionais de saúde.",
        "O uso de apps facilita o registro de sintomas, lembretes de medicação e o suporte remoto.",
      ],
      persons: [
        { name: "Patrícia Gomes", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Dr. Eduardo Lima", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Enf. Carla Souza", imageUrl: "/img/avatar-placeholder.png" },
      ],
      date: "18 de Jan",
      link: "/post/4",
      viewCount: 1340,
    },
    // Novo post 2
    {
      badges: [
        { title: "Prevenção", color: "bg-lime-500" },
        { title: "Saúde", color: "bg-teal-500" },
      ],
      title: "Alimentação balanceada reduz risco de demência, aponta estudo",
      descriptions: [
        "Pesquisas recentes mostram que uma dieta rica em vegetais, frutas e peixes está associada a menor incidência de demência.",
        "Especialistas recomendam a adoção de hábitos alimentares saudáveis desde a meia-idade.",
      ],
      persons: [
        { name: "Dr. Rafael Torres", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Nutri. Camila Dias", imageUrl: "/img/avatar-placeholder.png" },
        { name: "Enf. Paula Martins", imageUrl: "/img/avatar-placeholder.png" },
      ],
      date: "20 de Jan",
      link: "/post/5",
      viewCount: 1105,
    },
  ];

  const mockPostsWithImages = mockPosts.map((post, index) => ({
    ...post,
    image: {
      src: `/img/wallpaper/banner_mar.png`,
      alt: `Imagem do post ${index + 1}`,
      width: 400,
      height: 250,
      className: "rounded-lg w-full",
    } as any,
  }));

  const relatedTopics = mockTopics.slice(0, 15).map((topic: { id: string; title: string }) => ({
    id: topic.id,
    name: topic.title,
    isFollowing: false,
  }));

  return (
    <PageBoxLayout breadcrumbs={<PageBreadcrumbs />} ignoreIcon>
      <AuroraBackgroundMainRoot />
      <div className="flex flex-col gap-6 items-center justify-center w-full max-w-[1700px] mx-auto">
        <TopicCard
          title="Demência: Informação, Apoio e Conexão"
          description="A Comunidade Lumen reúne profissionais, familiares e pessoas interessadas em demência para compartilhar conhecimento, experiências e promover o cuidado humanizado. Descubra artigos, pesquisas, eventos e faça parte dessa rede de apoio."
          followersIncrease={120}
          isFollowing={false}
          posts={mockPosts}
          relatedTopics={relatedTopics}
          onFollow={() => console.log("Follow clicked")}
          onSearch={(query) => console.log("Search:", query)}
          onViewAll={() => console.log("View all clicked")}
        />
        <TopicCard
          title="Demência: Informação, Apoio e Conexão"
          description="A Comunidade Lumen reúne profissionais, familiares e pessoas interessadas em demência para compartilhar conhecimento, experiências e promover o cuidado humanizado. Descubra artigos, pesquisas, eventos e faça parte dessa rede de apoio."
          followersIncrease={120}
          isFollowing={false}
          posts={mockPostsWithImages}
          onFollow={() => console.log("Follow clicked")}
          onSearch={(query) => console.log("Search:", query)}
          onViewAll={() => console.log("View all clicked")}
        />
      </div>
    </PageBoxLayout>
  );
};
