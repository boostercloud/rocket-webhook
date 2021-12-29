import { WebhookEvent } from './webhook-event'
import { Class, Register } from '@boostercloud/framework-types'

export interface WebhookHandlerClassInterface extends Class<unknown> {
  handle(webhookEventInterface: WebhookEvent, register: Register): Promise<unknown>
}
