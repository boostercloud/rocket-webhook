import { WebhookHandlerClassInterface } from './webhook-handler'
import { MultiPartConfig } from './webhook-multipart-form'

export const functionID = 'rocket-webhook'

export interface WebhookParamsEvent {
  // @deprecated Use route parameter
  origin?: string
  route?: string
  handlerClass: WebhookHandlerClassInterface
  multiPartConfig?: MultiPartConfig
}

export type WebhookParams = Array<WebhookParamsEvent>

export function getRoute(param: WebhookParamsEvent): string {
  const endpoint = param.route ?? param.origin
  if (!endpoint) {
    throw new Error(`Undefined route parameter ${param}`)
  }
  return endpoint
}
