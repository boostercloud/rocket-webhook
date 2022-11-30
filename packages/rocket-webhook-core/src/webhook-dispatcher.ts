import { BoosterConfig, Register, UUID } from '@boostercloud/framework-types'
import {
  WebhookEvent,
  WebhookParams,
  WebhookParamsEvent,
  WebhookRequest,
  Helper,
  WebhookHandlerReturnType,
} from '@boostercloud/rocket-webhook-types'
import { RegisterHandler } from '@boostercloud/framework-core'

export async function dispatch(
  config: BoosterConfig,
  request: WebhookRequest,
  params: WebhookParams
): Promise<unknown> {
  try {
    console.log('Webhook: request received')
    const requestId = UUID.generate()
    const webhookParamsEvent = getWebhookParamsEvent(params, request)
    const handlerClass = webhookParamsEvent.handlerClass
    const webhookEvent = toWebhookEvent(webhookParamsEvent, request)
    const register = new Register(requestId, {})
    const result: WebhookHandlerReturnType | void = await handlerClass.handle(webhookEvent, register)
    await RegisterHandler.handle(config, register)
    if (result) {
      return config.provider.api.requestSucceeded(result.body, result.headers)
    }
    return config.provider.api.requestSucceeded()
  } catch (e) {
    return config.provider.api.requestFailed(e)
  }
}

function toWebhookEvent(webhookParamsEvent: WebhookParamsEvent, request: WebhookRequest): WebhookEvent {
  return {
    origin: webhookParamsEvent.origin,
    ...request.req,
  } as WebhookEvent
}

function getWebhookParamsEvent(params: WebhookParams, request: WebhookRequest): WebhookParamsEvent {
  const origin = Helper.getOriginFromRequest(request)
  const param = params.find((p: WebhookParamsEvent) => p.origin === origin)
  if (param) {
    return param
  }
  throw new Error(`Could not find origin ${origin} in parameters.`)
}
