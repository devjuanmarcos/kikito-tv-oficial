import {
  Author,
  Topic,
  PostType,
  NewsPost,
  ScientificArticlePost,
  TechnicalAnalysisPost,
  CaseStudyPost,
  EducationalContentPost,
  ParticipationCallPost,
  CollaborativeProjectPost,
  QuickInsightPost,
  PaginatedTopics,
  PaginatedPosts,
  Comment,
} from "../@types/services/topics/index";
// Comentários mockados
export const mockComments: Comment[] = [
  {
    id: "c1",
    name: "Luiz Guilherme Figueiredo Leite",
    imageUrl: "/img/avatars/luiz.jpg",
    date: "2026-01-25",
    time: "16:32",
    text: "Curabitur porttitor ornare tellus, id congue libero maximus ac. Phasellus dolor risus, iaculis non dui eu, pharetra vestibulum dolor.",
  },
  {
    id: "c2",
    name: "Luiz Guilherme Figueiredo Leite",
    imageUrl: "/img/avatars/luiz.jpg",
    date: "2026-01-25",
    time: "16:32",
    text: "Curabitur porttitor ornare tellus, id congue libero maximus ac. Phasellus dolor risus, iaculis non dui eu, pharetra vestibulum dolor.",
  },
  {
    id: "c3",
    name: "Samuel Benassi",
    imageUrl: "/img/avatars/samuel.jpg",
    date: "2026-01-25",
    time: "18:02",
    text: "Curabitur porttitor ornare tellus, id congue libero maximus ac. Phasellus dolor risus, iaculis non dui eu, pharetra vestibulum dolor. Integer nec sapien at augue vestibulum porta at sed nulla.",
  },
];

// Autores mockados
export const mockAuthors: Author[] = [
  {
    id: "1",
    name: "Dr. Ana Silva",
    email: "ana.silva@hospital.com",
    avatar: "/img/avatars/ana.jpg",
    specialty: "Neurologia",
    institution: "Hospital das Clínicas",
  },
  {
    id: "2",
    name: "Dr. Carlos Mendes",
    email: "carlos.mendes@univ.br",
    avatar: "/img/avatars/carlos.jpg",
    specialty: "Geriatria",
    institution: "Universidade Federal",
  },
  {
    id: "3",
    name: "Dra. Beatriz Costa",
    email: "beatriz.costa@research.org",
    avatar: "/img/avatars/beatriz.jpg",
    specialty: "Neuropsicologia",
    institution: "Instituto de Pesquisa",
  },
  {
    id: "4",
    name: "Dr. Roberto Alves",
    email: "roberto.alves@clinic.com",
    avatar: "/img/avatars/roberto.jpg",
    specialty: "Psiquiatria Geriátrica",
    institution: "Clínica Especializada",
  },
  {
    id: "5",
    name: "Dra. Marina Santos",
    email: "marina.santos@university.edu",
    avatar: "/img/avatars/marina.jpg",
    specialty: "Neurociência",
    institution: "Universidade Estadual",
  },
];

// Posts mockados de cada tipo

// NOTÍCIAS
const newsPost1: NewsPost = {
  id: "news-1",
  type: PostType.NEWS,
  title: "Nova terapia promissora para Alzheimer aprovada pela ANVISA",
  description: [
    "A ANVISA aprovou hoje uma nova terapia inovadora para o tratamento de Alzheimer em estágios iniciais.",
    "O medicamento, desenvolvido após 10 anos de pesquisa, mostrou resultados promissores em ensaios clínicos de fase 3, com redução de 27% na progressão da doença.",
    "Especialistas afirmam que esta é a aprovação mais significativa dos últimos 20 anos na área de tratamento de demências.",
    "O tratamento estará disponível no SUS a partir do segundo semestre de 2026.",
  ],
  author: mockAuthors[0],
  createdAt: "2026-01-27T10:30:00Z",
  updatedAt: "2026-01-27T10:30:00Z",
  tags: ["Alzheimer", "tratamento", "ANVISA", "inovação"],
  viewsCount: 1245,
  likesCount: 234,
  commentsCount: 67,
  source: "ANVISA",
  externalLink: "https://anvisa.gov.br/noticias/2026/nova-terapia-alzheimer",
  featuredImage:
    "https://s2-g1.glbimg.com/5HsXRJEyLO_4JKpmSibp0Imqus8=/0x0:640x360/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/3/e/klAe2sSDWnOzq6y9xAew/1.jpg",
  urgent: true,
  category: "treatment",
  comments: mockComments,
};

const newsPost2: NewsPost = {
  id: "news-2",
  type: PostType.NEWS,
  title: "Estudo brasileiro identifica novo biomarcador para diagnóstico precoce",
  description: [
    "Pesquisadores da USP identificaram um novo biomarcador sanguíneo que pode detectar Alzheimer até 15 anos antes dos primeiros sintomas.",
    "O estudo, publicado na revista Nature Medicine, analisou mais de 2.000 pacientes durante 5 anos.",
    "O novo teste tem precisão de 91% e é menos invasivo que os métodos atuais.",
    "A descoberta pode revolucionar o diagnóstico precoce e permitir intervenções mais eficazes.",
  ],
  author: mockAuthors[2],
  createdAt: "2026-01-25T14:20:00Z",
  updatedAt: "2026-01-25T14:20:00Z",
  tags: ["diagnóstico", "biomarcador", "pesquisa", "USP"],
  viewsCount: 892,
  likesCount: 178,
  commentsCount: 43,
  source: "USP",
  externalLink: "https://usp.br/pesquisa/biomarcador-alzheimer",
  featuredImage:
    "https://s2-g1.glbimg.com/5HsXRJEyLO_4JKpmSibp0Imqus8=/0x0:640x360/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/3/e/klAe2sSDWnOzq6y9xAew/1.jpg",
  urgent: false,
  category: "research",
  comments: mockComments,
};

// ARTIGOS CIENTÍFICOS
const scientificArticle1: ScientificArticlePost = {
  id: "article-1",
  type: PostType.SCIENTIFIC_ARTICLE,
  title: "Efeitos da estimulação cognitiva em pacientes com demência leve: ensaio clínico randomizado",
  description: [
    "Este estudo investigou os efeitos de um programa de estimulação cognitiva estruturada em pacientes com demência leve.",
    "Participaram 120 pacientes divididos em grupo experimental e controle.",
    "Os resultados demonstraram melhora significativa nas funções executivas e qualidade de vida.",
  ],
  abstract: [
    "Introdução: A estimulação cognitiva tem sido proposta como intervenção não-farmacológica para demência.",
    "Objetivo: Avaliar a eficácia de um programa de estimulação cognitiva de 12 semanas em pacientes com demência leve.",
    "Métodos: Ensaio clínico randomizado com 120 participantes, divididos em grupo intervenção (n=60) e controle (n=60).",
    "Resultados: O grupo intervenção apresentou melhora significativa no MEEM (p<0.001) e na escala de qualidade de vida (p<0.05).",
    "Conclusão: A estimulação cognitiva estruturada mostrou-se eficaz na melhora das funções cognitivas e qualidade de vida.",
  ],
  keywords: ["demência", "estimulação cognitiva", "intervenção não-farmacológica", "ensaio clínico"],
  doi: "10.1016/j.dementia.2026.01.015",
  publicationDate: "2026-01-15",
  journal: "Brazilian Journal of Dementia Research",
  authors: [mockAuthors[1], mockAuthors[2], mockAuthors[3]],
  pdfLink: "/pdfs/cognitive-stimulation-study.pdf",
  citationCount: 12,
  methodology: "Ensaio clínico randomizado duplo-cego",
  findings: [
    "Melhora de 18% no MEEM após 12 semanas",
    "Aumento de 23% na pontuação de qualidade de vida",
    "Redução de 15% nos sintomas comportamentais",
    "Efeitos mantidos por até 6 meses após intervenção",
  ],
  limitations: [
    "Amostra limitada a uma única região geográfica",
    "Não foi possível avaliar efeitos a longo prazo além de 6 meses",
    "Possível viés de seleção devido aos critérios de inclusão estritos",
  ],
  author: mockAuthors[1],
  createdAt: "2026-01-20T09:00:00Z",
  updatedAt: "2026-01-20T09:00:00Z",
  tags: ["pesquisa", "cognição", "intervenção"],
  viewsCount: 567,
  likesCount: 89,
  commentsCount: 34,
  comments: mockComments,
};

// ANÁLISE/OPINIÃO TÉCNICA
const technicalAnalysis1: TechnicalAnalysisPost = {
  id: "analysis-1",
  type: PostType.TECHNICAL_ANALYSIS,
  title: "Perspectivas sobre o uso de inteligência artificial no diagnóstico de demências",
  description: [
    "Análise crítica sobre a implementação de IA em processos diagnósticos.",
    "Discute benefícios, limitações e questões éticas envolvidas.",
    "Baseada em evidências recentes e experiência clínica de 15 anos.",
  ],
  topic: "Inteligência Artificial no Diagnóstico",
  perspective: "clinical",
  keyPoints: [
    "A IA pode aumentar a precisão diagnóstica em até 30% quando combinada com avaliação clínica",
    "Algoritmos de machine learning mostram especial eficácia na análise de neuroimagens",
    "Questões éticas incluem privacidade de dados e responsabilidade diagnóstica",
    "Necessidade de validação em populações diversas antes da implementação generalizada",
    "O profissional de saúde deve manter papel central na interpretação dos resultados",
  ],
  references: [
    "Smith et al. (2025) - AI in Dementia Diagnosis: A Systematic Review",
    "Journal of Medical AI, Vol. 12, 2025",
    "WHO Guidelines on AI in Healthcare, 2025",
  ],
  disclaimer: "As opiniões expressas são do autor e baseadas em sua experiência clínica e revisão da literatura.",
  author: mockAuthors[0],
  createdAt: "2026-01-22T16:45:00Z",
  updatedAt: "2026-01-22T16:45:00Z",
  tags: ["IA", "diagnóstico", "tecnologia", "ética"],
  viewsCount: 423,
  likesCount: 67,
  commentsCount: 28,
  comments: mockComments,
};

// ESTUDO DE CASO
const caseStudy1: CaseStudyPost = {
  id: "case-1",
  type: PostType.CASE_STUDY,
  title: "Manejo de sintomas comportamentais em demência frontotemporal: relato de caso",
  description: [
    "Apresentação de caso clínico de paciente com demência frontotemporal variante comportamental.",
    "Abordagem multidisciplinar para controle de sintomas comportamentais desafiadores.",
    "Resultados positivos com combinação de intervenções farmacológicas e não-farmacológicas.",
  ],
  patientProfile: {
    age: "62 anos",
    gender: "Masculino",
    diagnosis: "Demência frontotemporal - variante comportamental",
    stageDementia: "Moderada",
  },
  presentation: [
    "Paciente de 62 anos com diagnóstico de DFT há 3 anos",
    "Apresentava desinibição social severa, agressividade verbal e apatia",
    "Família relatava grande sobrecarga no cuidado",
    "Tentativas prévias de tratamento farmacológico com resposta parcial",
  ],
  intervention: [
    "Ajuste medicamentoso: introdução de antipsicótico atípico em dose baixa",
    "Terapia ocupacional 3x/semana focada em atividades estruturadas",
    "Programa de psicoeducação para familiares",
    "Adequação ambiental domiciliar",
    "Acompanhamento psicológico para o cuidador principal",
  ],
  outcomes: [
    "Redução de 60% nos episódios de agitação após 8 semanas",
    "Melhora na adesão às atividades diárias",
    "Redução significativa da sobrecarga do cuidador (Zarit Burden Interview)",
    "Manutenção dos ganhos após 6 meses de acompanhamento",
  ],
  lessonsLearned: [
    "Abordagem multidisciplinar é essencial no manejo de sintomas comportamentais",
    "Envolvimento e capacitação da família são fatores-chave para o sucesso",
    "Intervenções não-farmacológicas devem ser priorizadas sempre que possível",
    "Monitoramento frequente permite ajustes precoces no plano terapêutico",
  ],
  followUpPeriod: "12 meses",
  ethicsApproval: true,
  author: mockAuthors[3],
  createdAt: "2026-01-18T11:30:00Z",
  updatedAt: "2026-01-18T11:30:00Z",
  tags: ["DFT", "sintomas comportamentais", "caso clínico"],
  viewsCount: 678,
  likesCount: 123,
  commentsCount: 45,
  comments: mockComments,
};

// CONTEÚDO EDUCACIONAL
const educational1: EducationalContentPost = {
  id: "edu-1",
  type: PostType.EDUCATIONAL_CONTENT,
  title: "Guia completo: Avaliação neuropsicológica em demências",
  description: [
    "Material educacional abrangente sobre avaliação neuropsicológica.",
    "Inclui protocolos, instrumentos validados e interpretação de resultados.",
    "Direcionado a profissionais que desejam aprimorar suas habilidades diagnósticas.",
  ],
  contentType: "guide",
  targetAudience: ["Neuropsicólogos", "Neurologistas", "Geriatras", "Psiquiatras"],
  learningObjectives: [
    "Compreender os princípios da avaliação neuropsicológica em demências",
    "Conhecer os principais instrumentos de avaliação e suas indicações",
    "Interpretar resultados e elaborar laudos diagnósticos",
    "Diferenciar perfis neuropsicológicos das principais demências",
  ],
  resources: [
    {
      type: "PDF",
      url: "/resources/guia-avaliacao-neuropsicologica.pdf",
      title: "Guia Completo - Avaliação Neuropsicológica",
    },
    {
      type: "Checklist",
      url: "/resources/checklist-avaliacao.pdf",
      title: "Checklist de Avaliação",
    },
    {
      type: "Vídeo",
      url: "/resources/videos/avaliacao-pratica.mp4",
      title: "Demonstração Prática de Avaliação",
    },
  ],
  difficulty: "intermediate",
  duration: "4 horas",
  certificateAvailable: false,
  author: mockAuthors[2],
  createdAt: "2026-01-15T08:00:00Z",
  updatedAt: "2026-01-15T08:00:00Z",
  tags: ["educação", "neuropsicologia", "avaliação"],
  viewsCount: 1123,
  likesCount: 234,
  commentsCount: 56,
  comments: mockComments,
};

// CHAMADA PARA PARTICIPAÇÃO
const participation1: ParticipationCallPost = {
  id: "call-1",
  type: PostType.PARTICIPATION_CALL,
  title: "Chamada para participantes: Estudo sobre biomarcadores em DCL",
  description: [
    "Convidamos profissionais de saúde para participar de estudo multicêntrico.",
    "Pesquisa sobre biomarcadores em Déficit Cognitivo Leve.",
    "Financiamento aprovado pela FAPESP.",
  ],
  callType: "research",
  deadline: "2026-03-31",
  eligibilityCriteria: [
    "Profissional de saúde com atuação em neurologia, geriatria ou neuropsicologia",
    "Experiência mínima de 2 anos em avaliação de pacientes com DCL",
    "Disponibilidade para participar de reuniões mensais online",
    "Acesso a população de pacientes com DCL para recrutamento",
  ],
  location: {
    type: "hybrid",
    city: "São Paulo",
    country: "Brasil",
  },
  contactInfo: {
    name: "Dra. Beatriz Costa",
    email: "beatriz.costa@research.org",
    phone: "+55 11 98765-4321",
  },
  registrationLink: "https://research.org/biomarkers-study/registration",
  expectations: [
    "Recrutamento de 15-20 pacientes por centro",
    "Coleta de dados clínicos e amostras biológicas",
    "Participação em análises colaborativas",
    "Coautoria em publicações resultantes",
  ],
  compensation: "Bolsa de produtividade e apoio financeiro para coleta de dados",
  author: mockAuthors[2],
  createdAt: "2026-01-10T09:00:00Z",
  updatedAt: "2026-01-10T09:00:00Z",
  tags: ["pesquisa", "biomarcadores", "DCL", "multicêntrico"],
  viewsCount: 456,
  likesCount: 78,
  commentsCount: 23,
  comments: mockComments,
};

// PROJETO COLABORATIVO
const collaborative1: CollaborativeProjectPost = {
  id: "proj-1",
  type: PostType.COLLABORATIVE_PROJECT,
  title: "Rede Brasileira de Cuidados em Demência - Fase 2",
  description: [
    "Projeto colaborativo nacional para desenvolvimento de protocolos de cuidado.",
    "Integra profissionais de diferentes regiões do Brasil.",
    "Foco em intervenções baseadas em evidências adaptadas à realidade brasileira.",
  ],
  projectName: "Rede Brasileira de Cuidados em Demência",
  objectives: [
    "Desenvolver protocolos nacionais de cuidado em demência",
    "Criar material educacional para profissionais e cuidadores",
    "Estabelecer diretrizes de boas práticas",
    "Implementar programa de capacitação em serviço",
    "Avaliar impacto das intervenções em diferentes contextos",
  ],
  currentPhase: "active",
  collaborators: [mockAuthors[0], mockAuthors[1], mockAuthors[3], mockAuthors[4]],
  rolesNeeded: [
    "Especialista em políticas públicas",
    "Desenvolvedor de conteúdo educacional",
    "Estatístico para análise de dados",
    "Coordenador regional - Nordeste",
  ],
  timeline: {
    start: "2025-06-01",
    end: "2027-06-01",
    milestones: [
      {
        date: "2025-12-01",
        description: "Conclusão do mapeamento nacional",
      },
      {
        date: "2026-06-01",
        description: "Lançamento dos primeiros protocolos",
      },
      {
        date: "2026-12-01",
        description: "Início do programa de capacitação",
      },
      {
        date: "2027-06-01",
        description: "Publicação de resultados e diretrizes finais",
      },
    ],
  },
  fundingSource: "Ministério da Saúde / CNPq",
  expectedOutcomes: [
    "Protocolos de cuidado validados e implementados em 50+ serviços",
    "Material educacional disponível gratuitamente",
    "Rede permanente de colaboração entre profissionais",
    "Publicações científicas em periódicos nacionais e internacionais",
  ],
  author: mockAuthors[0],
  createdAt: "2026-01-05T10:00:00Z",
  updatedAt: "2026-01-26T15:30:00Z",
  tags: ["colaboração", "protocolos", "rede nacional"],
  viewsCount: 892,
  likesCount: 167,
  commentsCount: 89,
  comments: mockComments,
};

// INSIGHT RÁPIDO
const insight1: QuickInsightPost = {
  id: "insight-1",
  type: PostType.QUICK_INSIGHT,
  title: "Hidratação adequada melhora cognição em idosos",
  description: [
    "Estudo recente mostra que desidratação leve pode afetar funções cognitivas.",
    "Manter hidratação adequada é intervenção simples e eficaz.",
  ],
  insight:
    "Pesquisa publicada hoje demonstra que idosos que mantêm hidratação adequada (pelo menos 1,5L água/dia) apresentam desempenho cognitivo 12% melhor em testes de atenção e memória de trabalho comparado a idosos levemente desidratados.",
  context: "Estudo observacional com 340 idosos saudáveis, idade 65-85 anos, durante 6 meses.",
  source: "Journal of Geriatric Neuroscience, Janeiro 2026",
  relatedTopics: ["prevenção", "saúde cognitiva", "cuidados básicos"],
  actionable: true,
  author: mockAuthors[4],
  createdAt: "2026-01-28T07:15:00Z",
  updatedAt: "2026-01-28T07:15:00Z",
  tags: ["prevenção", "hidratação", "cognição"],
  viewsCount: 234,
  likesCount: 45,
  commentsCount: 12,
  comments: mockComments,
};

const insight2: QuickInsightPost = {
  id: "insight-2",
  type: PostType.QUICK_INSIGHT,
  title: "Correlação entre qualidade do sono e progressão de Alzheimer",
  description: [
    "Novo estudo estabelece relação direta entre distúrbios do sono e velocidade de progressão.",
    "Intervenções para melhorar o sono podem desacelerar a doença.",
  ],
  insight:
    "Análise de dados longitudinais de 500 pacientes com Alzheimer inicial revelou que aqueles com qualidade de sono ruim (apneia não tratada, insônia crônica) apresentaram progressão 35% mais rápida da doença em 2 anos.",
  context:
    "Dados do estudo ADNI (Alzheimer's Disease Neuroimaging Initiative) analisados por pesquisadores de Stanford.",
  source: "Nature Neuroscience, Vol. 28, 2026",
  relatedTopics: ["sono", "progressão", "Alzheimer"],
  actionable: true,
  author: mockAuthors[1],
  createdAt: "2026-01-26T18:30:00Z",
  updatedAt: "2026-01-26T18:30:00Z",
  tags: ["sono", "Alzheimer", "progressão"],
  viewsCount: 567,
  likesCount: 98,
  commentsCount: 34,
  comments: mockComments,
};

// TÓPICOS MOCKADOS
export const mockTopics: Topic[] = [
  {
    id: "topic-1",
    title: "Avanços em Tratamento de Alzheimer",
    description:
      "Discussões sobre novas terapias, medicamentos e abordagens inovadoras no tratamento da Doença de Alzheimer.",
    category: "Tratamento",
    posts: [newsPost1, scientificArticle1, technicalAnalysis1],
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2026-01-27T10:30:00Z",
    moderators: [mockAuthors[0], mockAuthors[2]],
    subscribersCount: 342,
    isActive: true,
    tags: ["Alzheimer", "tratamento", "terapias"],
    icon: "🧠",
  },
  {
    id: "topic-2",
    title: "Diagnóstico Precoce e Biomarcadores",
    description: "Novidades em métodos diagnósticos, biomarcadores e tecnologias para detecção precoce de demências.",
    category: "Diagnóstico",
    posts: [newsPost2, educational1, participation1],
    createdAt: "2025-10-15T14:00:00Z",
    updatedAt: "2026-01-25T14:20:00Z",
    moderators: [mockAuthors[2]],
    subscribersCount: 278,
    isActive: true,
    tags: ["diagnóstico", "biomarcadores", "detecção precoce"],
    icon: "🔬",
  },
  {
    id: "topic-3",
    title: "Manejo de Sintomas Comportamentais",
    description: "Estratégias e experiências no manejo de sintomas comportamentais e psicológicos da demência.",
    category: "Cuidados",
    posts: [caseStudy1, insight2],
    createdAt: "2025-12-01T09:00:00Z",
    updatedAt: "2026-01-26T18:30:00Z",
    moderators: [mockAuthors[3]],
    subscribersCount: 195,
    isActive: true,
    tags: ["sintomas comportamentais", "SCPD", "manejo"],
    icon: "🤝",
  },
  {
    id: "topic-4",
    title: "Pesquisa e Inovação",
    description:
      "Projetos de pesquisa, chamadas para colaboração e discussões sobre metodologias de pesquisa em demência.",
    category: "Pesquisa",
    posts: [collaborative1, participation1, scientificArticle1],
    createdAt: "2025-09-20T11:00:00Z",
    updatedAt: "2026-01-26T15:30:00Z",
    moderators: [mockAuthors[1], mockAuthors[2]],
    subscribersCount: 421,
    isActive: true,
    tags: ["pesquisa", "inovação", "colaboração"],
    icon: "🔍",
  },
  {
    id: "topic-5",
    title: "Prevenção e Saúde Cognitiva",
    description: "Estratégias de prevenção, promoção de saúde cerebral e fatores de risco modificáveis.",
    category: "Prevenção",
    posts: [insight1, insight2, educational1],
    createdAt: "2025-11-10T13:00:00Z",
    updatedAt: "2026-01-28T07:15:00Z",
    moderators: [mockAuthors[4]],
    subscribersCount: 512,
    isActive: true,
    tags: ["prevenção", "saúde cognitiva", "estilo de vida"],
    icon: "💪",
  },
  {
    id: "topic-6",
    title: "Demência Frontotemporal",
    description: "Discussões específicas sobre diagnóstico, manejo e pesquisas em DFT e suas variantes.",
    category: "Tipos de Demência",
    posts: [caseStudy1, technicalAnalysis1],
    createdAt: "2025-10-05T15:00:00Z",
    updatedAt: "2026-01-22T16:45:00Z",
    moderators: [mockAuthors[3]],
    subscribersCount: 156,
    isActive: true,
    tags: ["DFT", "demência frontotemporal", "variantes"],
    icon: "🧩",
  },
  {
    id: "topic-7",
    title: "Tecnologias Assistivas e Demência",
    description: "Exploração de dispositivos, apps e soluções tecnológicas para apoio ao paciente e cuidador.",
    category: "Tecnologia",
    posts: [newsPost1, technicalAnalysis1],
    createdAt: "2025-08-12T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
    moderators: [mockAuthors[0]],
    subscribersCount: 210,
    isActive: true,
    tags: ["tecnologia", "assistência", "apps"],
    icon: "📱",
  },
  {
    id: "topic-8",
    title: "Cuidados Paliativos em Demência",
    description: "Discussão sobre cuidados no fim da vida, manejo de sintomas e suporte à família.",
    category: "Cuidados",
    posts: [caseStudy1],
    createdAt: "2025-07-01T09:00:00Z",
    updatedAt: "2026-01-05T09:00:00Z",
    moderators: [mockAuthors[1]],
    subscribersCount: 134,
    isActive: true,
    tags: ["cuidados paliativos", "fim da vida"],
    icon: "🌅",
  },
  {
    id: "topic-9",
    title: "Direitos e Políticas Públicas",
    description: "Informações sobre direitos do paciente, legislação e políticas públicas para demência.",
    category: "Sociedade",
    posts: [newsPost2],
    createdAt: "2025-06-15T14:00:00Z",
    updatedAt: "2026-01-15T14:00:00Z",
    moderators: [mockAuthors[2]],
    subscribersCount: 98,
    isActive: true,
    tags: ["direitos", "políticas públicas"],
    icon: "⚖️",
  },
  {
    id: "topic-10",
    title: "Demência em Jovens",
    description: "Casos raros, desafios diagnósticos e manejo de demência de início precoce.",
    category: "Tipos de Demência",
    posts: [caseStudy1],
    createdAt: "2025-05-10T11:00:00Z",
    updatedAt: "2026-01-10T11:00:00Z",
    moderators: [mockAuthors[3]],
    subscribersCount: 45,
    isActive: true,
    tags: ["jovens", "início precoce"],
    icon: "🧒",
  },
  {
    id: "topic-11",
    title: "Apoio ao Cuidador",
    description: "Espaço para troca de experiências, dicas e suporte emocional a cuidadores de pessoas com demência.",
    category: "Apoio",
    posts: [insight1, insight2],
    createdAt: "2025-04-20T10:00:00Z",
    updatedAt: "2026-01-08T10:00:00Z",
    moderators: [mockAuthors[4]],
    subscribersCount: 320,
    isActive: true,
    tags: ["cuidadores", "apoio", "família"],
    icon: "🤗",
  },
  {
    id: "topic-12",
    title: "Demência e Nutrição",
    description: "Discussão sobre alimentação, suplementação e impacto nutricional na progressão da demência.",
    category: "Saúde",
    posts: [newsPost1],
    createdAt: "2025-03-15T09:00:00Z",
    updatedAt: "2026-01-05T09:00:00Z",
    moderators: [mockAuthors[0]],
    subscribersCount: 110,
    isActive: true,
    tags: ["nutrição", "alimentação", "saúde"],
    icon: "🥗",
  },
  {
    id: "topic-13",
    title: "Demência e Atividade Física",
    description: "Benefícios do exercício físico para prevenção e manejo dos sintomas da demência.",
    category: "Saúde",
    posts: [insight2],
    createdAt: "2025-02-10T08:00:00Z",
    updatedAt: "2026-01-02T08:00:00Z",
    moderators: [mockAuthors[1]],
    subscribersCount: 150,
    isActive: true,
    tags: ["atividade física", "exercício", "prevenção"],
    icon: "🏃",
  },
  {
    id: "topic-14",
    title: "Demência e Saúde Mental",
    description: "Relação entre demência, depressão, ansiedade e estratégias de manejo psicológico.",
    category: "Saúde Mental",
    posts: [technicalAnalysis1],
    createdAt: "2025-01-05T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    moderators: [mockAuthors[2]],
    subscribersCount: 175,
    isActive: true,
    tags: ["saúde mental", "depressão", "ansiedade"],
    icon: "🧘",
  },
  {
    id: "topic-15",
    title: "Demência e Inclusão Social",
    description: "Ações, projetos e iniciativas para inclusão social de pessoas com demência.",
    category: "Sociedade",
    posts: [newsPost2, educational1],
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2026-01-01T09:00:00Z",
    moderators: [mockAuthors[3]],
    subscribersCount: 88,
    isActive: true,
    tags: ["inclusão", "sociedade", "projetos"],
    icon: "🌍",
  },
];

// Função helper para criar resposta paginada de tópicos
export const getMockPaginatedTopics = (page: number = 1, limit: number = 10): PaginatedTopics => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockTopics.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(mockTopics.length / limit),
      totalItems: mockTopics.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < mockTopics.length,
      hasPreviousPage: page > 1,
    },
  };
};

// Função helper para criar resposta paginada de posts de um tópico
export const getMockPaginatedPosts = (topicId: string, page: number = 1, limit: number = 10): PaginatedPosts | null => {
  const topic = mockTopics.find((t) => t.id === topicId);

  if (!topic) {
    return null;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = topic.posts.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(topic.posts.length / limit),
      totalItems: topic.posts.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < topic.posts.length,
      hasPreviousPage: page > 1,
    },
  };
};

// Exportar todos os posts individuais para uso em testes
export const allMockPosts = [
  newsPost1,
  newsPost2,
  scientificArticle1,
  technicalAnalysis1,
  caseStudy1,
  educational1,
  participation1,
  collaborative1,
  insight1,
  insight2,
];
