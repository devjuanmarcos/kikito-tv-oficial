import { Icons } from "@/components/icons";

export interface NavItem {
  type?: string;
  title?: string;
  url?: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  target?: "_blank" | "_self";
}

export const adminNavItems = (): NavItem[] => {
  const baseNavItems: NavItem[] = [
    {
      type: "Visão Geral",
      items: [
        {
          title: "Painel Inicial",
          url: "/pt/dashboard/bioconecta/administrador",
          icon: "dashboard",
          isActive: false,
          shortcut: ["d", "h"],
        },
      ],
    },
    {
      type: "Conteúdo e Conhecimento",
      items: [
        {
          title: "Tópicos e Publicações",
          url: "/pt/dashboard/bioconecta/administrador/topicos",
          icon: "fileText",
          isActive: false,
          shortcut: ["t", "p"],
          items: [
            {
              title: "Notícias",
              url: "/pt/dashboard/bioconecta/administrador/topicos/noticias",
              icon: "newspaper",
            },
            {
              title: "Artigos Científicos",
              url: "/pt/dashboard/bioconecta/administrador/topicos/artigos-cientificos",
              icon: "microscope",
            },
            {
              title: "Análises e Opiniões Técnicas",
              url: "/pt/dashboard/bioconecta/administrador/topicos/analises-tecnicas",
              icon: "fileSearch",
            },
            {
              title: "Estudos de Caso",
              url: "/pt/dashboard/bioconecta/administrador/topicos/estudos-de-caso",
              icon: "clipboard",
            },
            {
              title: "Conteúdo Educacional",
              url: "/pt/dashboard/bioconecta/administrador/topicos/conteudo-educacional",
              icon: "graduationCap",
            },
            {
              title: "Curadoria de Conteúdo",
              url: "/pt/dashboard/bioconecta/administrador/topicos/curadoria",
              icon: "library",
            },
            {
              title: "Insights Rápidos",
              url: "/pt/dashboard/bioconecta/administrador/topicos/insights",
              icon: "lightbulb",
            },
          ],
        },
        {
          title: "Recursos e Biblioteca",
          url: "/pt/dashboard/bioconecta/administrador/recursos",
          icon: "library",
          isActive: false,
          shortcut: ["r", "b"],
          items: [
            {
              title: "Materiais Educativos",
              url: "/pt/dashboard/bioconecta/administrador/recursos/materiais",
              icon: "book",
            },
            {
              title: "Guias e Manuais",
              url: "/pt/dashboard/bioconecta/administrador/recursos/guias",
              icon: "bookOpen",
            },
            {
              title: "Vídeos e Webinars",
              url: "/pt/dashboard/bioconecta/administrador/recursos/videos",
              icon: "video",
            },
          ],
        },
      ],
    },
    {
      type: "Assistência e Cuidado",
      items: [
        {
          title: "Profissionais de Saúde",
          url: "/pt/dashboard/bioconecta/administrador/profissionais",
          icon: "stethoscope",
          isActive: false,
          shortcut: ["p", "s"],
          items: [
            {
              title: "Lista de Profissionais",
              url: "/pt/dashboard/bioconecta/administrador/profissionais/lista",
              icon: "users",
            },
            {
              title: "Cadastrar Profissional",
              url: "/pt/dashboard/bioconecta/administrador/profissionais/cadastrar",
              icon: "userPlus",
            },
            {
              title: "Especialidades",
              url: "/pt/dashboard/bioconecta/administrador/profissionais/especialidades",
              icon: "briefcase",
            },
          ],
        },
        {
          title: "Pacientes e Cuidadores",
          url: "/pt/dashboard/bioconecta/administrador/pacientes",
          icon: "heart",
          isActive: false,
          shortcut: ["p", "c"],
          items: [
            {
              title: "Busca de Atendimento",
              url: "/pt/dashboard/bioconecta/administrador/pacientes/busca-atendimento",
              icon: "search",
            },
            {
              title: "Cadastro de Pacientes",
              url: "/pt/dashboard/bioconecta/administrador/pacientes/cadastrar",
              icon: "userPlus",
            },
            {
              title: "Apoio a Cuidadores",
              url: "/pt/dashboard/bioconecta/administrador/pacientes/apoio-cuidadores",
              icon: "handHeart",
            },
          ],
        },
        {
          title: "Diagnóstico e Avaliação",
          url: "/pt/dashboard/bioconecta/administrador/diagnostico",
          icon: "clipboardList",
          isActive: false,
          shortcut: ["d", "a"],
          items: [
            {
              title: "Ferramentas de Triagem",
              url: "/pt/dashboard/bioconecta/administrador/diagnostico/triagem",
              icon: "checkSquare",
            },
            {
              title: "Recursos de Diagnóstico",
              url: "/pt/dashboard/bioconecta/administrador/diagnostico/recursos",
              icon: "fileText",
            },
            {
              title: "Protocolos de Avaliação",
              url: "/pt/dashboard/bioconecta/administrador/diagnostico/protocolos",
              icon: "clipboard",
            },
          ],
        },
      ],
    },
    {
      type: "Engajamento Comunitário",
      items: [
        {
          title: "Comunidade e Participação",
          url: "/pt/dashboard/bioconecta/administrador/comunidade",
          icon: "users",
          isActive: false,
          shortcut: ["c", "p"],
          items: [
            {
              title: "Projetos Colaborativos",
              url: "/pt/dashboard/bioconecta/administrador/comunidade/projetos",
              icon: "handshake",
            },
            {
              title: "Chamadas para Participação",
              url: "/pt/dashboard/bioconecta/administrador/comunidade/chamadas",
              icon: "megaphone",
            },
            {
              title: "Fóruns de Discussão",
              url: "/pt/dashboard/bioconecta/administrador/comunidade/foruns",
              icon: "messageSquare",
            },
            {
              title: "Eventos",
              url: "/pt/dashboard/bioconecta/administrador/comunidade/eventos",
              icon: "calendar",
            },
          ],
        },
      ],
    },
    {
      type: "Administração",
      items: [
        {
          title: "Gestão de Usuários",
          url: "/pt/dashboard/bioconecta/administrador/usuarios",
          icon: "UsersRound",
          isActive: false,
          shortcut: ["g", "u"],
        },
        {
          title: "Organizações Parceiras",
          url: "/pt/dashboard/bioconecta/administrador/organizacoes",
          icon: "building",
          isActive: false,
          shortcut: ["o", "p"],
        },
      ],
    },
  ];

  return baseNavItems;
};
