import { EventInterface } from '@boostercloud/framework-types'

export interface WebhookEvent extends EventInterface {
  origin: string
  method: string
  url: string
  originalUrl: string
  headers: Record<string, unknown>
  query: unknown
  params: unknown
  rawBody: string
  body: Record<string, unknown>
}
