import { WebhookEvent } from './webhook-event'
import { Class, Register } from '@boostercloud/framework-types'

export interface WebhookHandlerReturnType {
  body: unknown
  headers?: Record<string, number | string | ReadonlyArray<string>>
}

export interface WebhookHandlerClassInterface extends Class<unknown> {
  handle(webhookEventInterface: WebhookEvent, register: Register): Promise<WebhookHandlerReturnType | void>
}
