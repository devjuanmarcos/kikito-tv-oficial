export interface CardStackItem {
  id: string
  content: React.ReactNode
}

export interface CardStackProps {
  cards: CardStackItem[]
  offset?: number
  scaleFactor?: number
  autoPlay?: boolean
  interval?: number
  className?: string
  style?: React.CSSProperties
}
