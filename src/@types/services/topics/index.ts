// Comentário de usuário
export interface CommentReactions {
  likes: number;
  dislikes: number;
  userReaction: "like" | "dislike" | null;
}

export interface Comment {
  id: string;
  name: string;
  imageUrl?: string;
  date: string; // ISO string
  time?: string; // opcional, pode ser extraído de date
  text: string;
  reactions?: CommentReactions;
  replies?: Comment[];
}
// Tipos base
export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  specialty?: string;
  institution?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Enum para tipos de posts
export enum PostType {
  NEWS = "NEWS",
  SCIENTIFIC_ARTICLE = "SCIENTIFIC_ARTICLE",
  TECHNICAL_ANALYSIS = "TECHNICAL_ANALYSIS",
  CASE_STUDY = "CASE_STUDY",
  EDUCATIONAL_CONTENT = "EDUCATIONAL_CONTENT",
  PARTICIPATION_CALL = "PARTICIPATION_CALL",
  COLLABORATIVE_PROJECT = "COLLABORATIVE_PROJECT",
  QUICK_INSIGHT = "QUICK_INSIGHT",
}

// Interface base para todos os posts
export interface BasePost {
  id: string;
  type: PostType;
  title: string;
  description: string[];
  author: Author;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
}

// NOTÍCIA
export interface NewsPost extends BasePost {
  type: PostType.NEWS;
  source?: string;
  externalLink?: string;
  featuredImage?: string;
  urgent?: boolean;
  category: "breakthrough" | "research" | "treatment" | "prevention" | "general";
  comments?: Comment[];
}

// ARTIGO CIENTÍFICO
export interface ScientificArticlePost extends BasePost {
  type: PostType.SCIENTIFIC_ARTICLE;
  abstract: string[];
  keywords: string[];
  doi?: string;
  publicationDate: string;
  journal?: string;
  authors: Author[];
  pdfLink?: string;
  citationCount?: number;
  methodology?: string;
  findings: string[];
  limitations?: string[];
  comments?: Comment[];
}

// ANÁLISE/OPINIÃO TÉCNICA
export interface TechnicalAnalysisPost extends BasePost {
  type: PostType.TECHNICAL_ANALYSIS;
  topic: string;
  perspective: "clinical" | "research" | "caregiving" | "policy" | "technology";
  keyPoints: string[];
  references?: string[];
  disclaimer?: string;
  comments?: Comment[];
}

// ESTUDO DE CASO
export interface CaseStudyPost extends BasePost {
  type: PostType.CASE_STUDY;
  patientProfile: {
    age?: string;
    gender?: string;
    diagnosis: string;
    stageDementia?: string;
  };
  presentation: string[];
  intervention: string[];
  outcomes: string[];
  lessonsLearned: string[];
  followUpPeriod?: string;
  ethicsApproval?: boolean;
  comments?: Comment[];
}

// CONTEÚDO EDUCACIONAL
export interface EducationalContentPost extends BasePost {
  type: PostType.EDUCATIONAL_CONTENT;
  contentType: "tutorial" | "guide" | "webinar" | "course" | "infographic" | "video";
  targetAudience: string[];
  learningObjectives: string[];
  resources?: {
    type: string;
    url: string;
    title: string;
  }[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration?: string;
  certificateAvailable?: boolean;
  comments?: Comment[];
}

// CHAMADA PARA PARTICIPAÇÃO
export interface ParticipationCallPost extends BasePost {
  type: PostType.PARTICIPATION_CALL;
  callType: "research" | "conference" | "workshop" | "survey" | "volunteer" | "clinical_trial";
  deadline?: string;
  eligibilityCriteria?: string[];
  location?: {
    type: "online" | "in-person" | "hybrid";
    address?: string;
    city?: string;
    country?: string;
  };
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  registrationLink?: string;
  expectations?: string[];
  compensation?: string;
  comments?: Comment[];
}

// PROJETO COLABORATIVO
export interface CollaborativeProjectPost extends BasePost {
  type: PostType.COLLABORATIVE_PROJECT;
  projectName: string;
  objectives: string[];
  currentPhase: "planning" | "recruitment" | "active" | "analysis" | "completed";
  collaborators: Author[];
  rolesNeeded?: string[];
  timeline?: {
    start: string;
    end?: string;
    milestones?: {
      date: string;
      description: string;
    }[];
  };
  fundingSource?: string;
  expectedOutcomes?: string[];
  comments?: Comment[];
}

// INSIGHT RÁPIDO
export interface QuickInsightPost extends BasePost {
  type: PostType.QUICK_INSIGHT;
  insight: string;
  context?: string;
  source?: string;
  relatedTopics?: string[];
  actionable?: boolean;
  comments?: Comment[];
}

// Union type para todos os tipos de posts
export type Post =
  | NewsPost
  | ScientificArticlePost
  | TechnicalAnalysisPost
  | CaseStudyPost
  | EducationalContentPost
  | ParticipationCallPost
  | CollaborativeProjectPost
  | QuickInsightPost;

// TÓPICO
export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  posts: Post[];
  createdAt: string;
  updatedAt: string;
  moderators: Author[];
  subscribersCount?: number;
  isActive: boolean;
  tags?: string[];
  icon?: string;
}

// Tipos para requisições paginadas
export interface GetTopicsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: "recent" | "popular" | "active";
  tags?: string[];
}

export interface GetPostsParams {
  topicId: string;
  page?: number;
  limit?: number;
  type?: PostType;
  sortBy?: "recent" | "popular" | "commented";
  authorId?: string;
}

export type PaginatedTopics = PaginatedResponse<Topic>;
export type PaginatedPosts = PaginatedResponse<Post>;
