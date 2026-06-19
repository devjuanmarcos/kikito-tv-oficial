export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance'

export interface ServiceItem {
  name: string
  status: ServiceStatus
  description?: string
}

export interface StatusGroup {
  group: string
  services: ServiceItem[]
}

export interface StatusPageProps {
  groups: StatusGroup[]
  title?: string
  lastUpdated?: Date | string
  overallStatus?: ServiceStatus
  className?: string
  style?: React.CSSProperties
}
