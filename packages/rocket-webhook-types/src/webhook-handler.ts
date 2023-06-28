import { WebhookEvent } from './webhook-event'
import { Class, Register } from '@boostercloud/framework-types'
import { Headers } from './webhook-api-result'
import { WebhookResponseType } from './webhook-response-type'

export interface WebhookHandlerBaseReturnType {
  body: unknown
  headers?: Headers
}

export interface WebhookHandlerTextReturnType extends WebhookHandlerBaseReturnType {
  responseType: WebhookResponseType.text
}

export interface WebhookHandlerJsonReturnType extends WebhookHandlerBaseReturnType {
  responseType: WebhookResponseType.json
}

export interface WebhookHandlerFileReturnType extends WebhookHandlerBaseReturnType {
  responseType: WebhookResponseType.file
  file: {
    name: string
    mimeType: string
  }
}

export type WebhookHandlerReturnType =
  | WebhookHandlerTextReturnType
  | WebhookHandlerJsonReturnType
  | WebhookHandlerFileReturnType

export interface WebhookHandlerClassInterface extends Class<unknown> {
  handle(webhookEventInterface: WebhookEvent, register: Register): Promise<WebhookHandlerReturnType | void>
}
