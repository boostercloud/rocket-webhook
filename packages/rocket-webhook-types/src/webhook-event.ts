import { EventInterface } from '@boostercloud/framework-types'

export interface WebhookEvent extends EventInterface {
  origin: string
  method: string
  url: string
  originalUrl: string
  headers: unknown
  query: unknown
  params: unknown
  body: unknown
  rawEvent: unknown
}
