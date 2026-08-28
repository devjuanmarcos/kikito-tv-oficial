import type { ReactNode } from "react";

export interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  threshold?: number;
  loader?: ReactNode;
  endMessage?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
