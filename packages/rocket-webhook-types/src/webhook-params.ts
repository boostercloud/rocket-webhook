import { WebhookHandlerClassInterface } from './webhook-handler'
import { MultiPartConfig } from './webhook-multipart-form'
import { Class, RoleInterface, UserEnvelope } from '@boostercloud/framework-types'
import { WebhookRequest } from './webhook-request'

export const functionID = 'rocket-webhook'

export type WebhookAuthorizer = (currentUser?: UserEnvelope, request?: WebhookRequest) => Promise<void>

export type WebhookRoleAccess = 'all' | Array<Class<RoleInterface>> | WebhookAuthorizer

export enum AllowedHttpMethod {
  GET = 'GET',
  POST = 'POST',
}

export interface WebhookParamsEvent {
  // @deprecated Use route parameter
  origin?: string
  route?: string
  handlerClass: WebhookHandlerClassInterface
  multiPartConfig?: MultiPartConfig
  authorize?: WebhookRoleAccess
  allowedMethods?: Array<AllowedHttpMethod>
}

export type WebhookParams = Array<WebhookParamsEvent>

export function getRoute(param: WebhookParamsEvent): string {
  const endpoint = param.route ?? param.origin
  if (!endpoint) {
    throw new Error(`Undefined route parameter ${param}`)
  }
  return endpoint
}
