import { BoosterConfig, Register } from '@boostercloud/framework-types'
import {
  WebhookEvent,
  WebhookParams,
  WebhookParamsEvent,
  WebhookRequest,
  Helper,
} from '@boostercloud/rocket-webhook-types'
import { RegisterHandler } from '@boostercloud/framework-core'

export async function dispatch(
  config: BoosterConfig,
  request: WebhookRequest,
  params: WebhookParams
): Promise<unknown> {
  try {
    console.log('Webhook: request received')
    const requestId = hashFrom(request)
    const webhookParamsEvent = getWebhookParamsEvent(params, request)
    const handlerClass = webhookParamsEvent.handlerClass
    const webhookEvent = toWebhookEvent(webhookParamsEvent, request)
    const register = new Register(requestId, undefined)
    const result = await handlerClass.handle(webhookEvent, register)
    await RegisterHandler.handle(config, console, register)
    return result
  } catch (e) {
    const err = e as Error
    return Promise.reject(err.message || 'Internal server error')
  }

  function toWebhookEvent(webhookParamsEvent: WebhookParamsEvent, request: WebhookRequest): WebhookEvent {
    return {
      origin: webhookParamsEvent.origin,
      ...request.req,
    } as WebhookEvent
  }

  function getWebhookParamsEvent(params: WebhookParams, request: WebhookRequest): WebhookParamsEvent {
    const origin = Helper.getOriginFromRequest(request)
    const param = params.find((param: WebhookParamsEvent) => param.origin === origin)
    if (param) {
      return param
    }
    throw new Error(`Could not find origin ${origin} in parameters.`)
  }

  function hashFrom(request: WebhookRequest): string {
    const crypto = require('crypto')
    const rawRequest = JSON.stringify(request)
    return crypto.createHash('md5').update(rawRequest).digest('hex')
  }
}
