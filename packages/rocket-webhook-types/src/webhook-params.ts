import { WebhookHandlerClassInterface } from './webhook-handler-class-interface'

export const functionID = 'rocket-webhook'

export interface WebhookParamsEvent {
  origin: string
  handlerClass: WebhookHandlerClassInterface
}

export type WebhookParams = Array<WebhookParamsEvent>
