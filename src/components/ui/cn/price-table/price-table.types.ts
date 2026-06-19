export interface PriceFeature {
  label: string
  plans: Record<string, boolean | string>
}

export interface PricePlan {
  id: string
  name: string
  price: string | number
  period?: string
  description?: string
  highlight?: boolean
  badge?: string
  ctaLabel?: string
  onCta?: () => void
}

export interface PriceTableProps {
  plans: PricePlan[]
  features: PriceFeature[]
  className?: string
  style?: React.CSSProperties
}
