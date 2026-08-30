/** Tipos do VideoAulaProductCard (src/components/cards/video-aula-product-card.tsx) —
 * nunca tinha um arquivo de tipos de verdade, so o import quebrado. Shape derivado
 * direto do destructure/uso do proprio componente (nenhum outro arquivo consome
 * VideoAula ainda). */
export type VideoAulaType = "FREE" | "PAID" | "PAID_WITH_PLAN_DISCOUNT";

export type VideoAulaStatus = "ACTIVE" | "ARCHIVED";

export interface VideoAulaAuthor {
  name: string;
  imageUrl?: string;
  role?: string;
}

export interface VideoAulaEngagement {
  likesCount: number;
  commentsCount: number;
}

export interface VideoAula {
  title: string;
  description: string;
  link: string;
  type: VideoAulaType;
  /** Preço em reais (null/undefined quando `type === "FREE"`). */
  price?: number | null;
  bannerUrl?: string | null;
  status: VideoAulaStatus;
  createdAt: Date;
  author: VideoAulaAuthor;
  engagement: VideoAulaEngagement;
}
