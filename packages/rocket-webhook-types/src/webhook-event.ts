import { EventInterface } from '@boostercloud/framework-types'
import { WebhookMultipartForm } from './webhook-multipart-form'

export interface WebhookEvent extends EventInterface {
  // @deprecated Use route parameter
  origin?: string
  route: string
  method: string
  url: string
  originalUrl: string
  headers: Record<string, unknown>
  query: unknown
  params: unknown
  rawBody: string
  body: Record<string, unknown>
  multipart?: WebhookMultipartForm
}
