import { BoosterConfig, Register, UUID } from '@boostercloud/framework-types'
import {
  getRoute,
  Helper,
  MultiPartConfig,
  WebhookEvent,
  WebhookHandlerReturnType,
  WebhookMultipartForm,
  WebhookParams,
  WebhookParamsEvent,
  WebhookRequest,
} from '@boostercloud/rocket-webhook-types'
import { RegisterHandler } from '@boostercloud/framework-core'
import { parseMultipartFormData } from './parse-multi-part'
import { WebhookTokenVerifier } from './webhook-token-verifier'
import { WebhookAuthorizationChecker } from './webhook-authorization-checker'
import { WebhookResponse } from './response/webhook-response'

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

    const userEnvelope = await WebhookTokenVerifier.verify(config, request)
    await WebhookAuthorizationChecker.authorize(config, webhookParamsEvent.authorize, userEnvelope, request)

    const webhookEvent = await toWebhookEvent(webhookParamsEvent, request)
    const register = new Register(requestId, {}, RegisterHandler.flush, userEnvelope)
    const result: WebhookHandlerReturnType | void = await handlerClass.handle(webhookEvent, register)
    await RegisterHandler.handle(config, register)
    if (result) {
      return WebhookResponse.responseSuccess(result)
    }
    return WebhookResponse.responseSuccess()
  } catch (e) {
    return WebhookResponse.responseFailure(e)
  }
}

async function toWebhookEvent(webhookParamsEvent: WebhookParamsEvent, request: WebhookRequest): Promise<WebhookEvent> {
  const req = request.req
  const multiPart = await resolveMultipart(req, webhookParamsEvent.multiPartConfig)
  return {
    origin: webhookParamsEvent.origin,
    route: webhookParamsEvent.route ?? webhookParamsEvent.origin,
    method: 'POST',
    url: req.url,
    originalUrl: req.originalUrl,
    headers: req.headers,
    query: req.query,
    params: req.params,
    rawBody: req.rawBody,
    body: req.body,
    multipart: multiPart,
  } as WebhookEvent
}

function getWebhookParamsEvent(params: WebhookParams, request: WebhookRequest): WebhookParamsEvent {
  const requestRoute = Helper.getRouteFromRequest(request)
  const param = params.find((p: WebhookParamsEvent) => getRoute(p) === requestRoute)
  if (param) {
    return param
  }
  throw new Error(`Could not find route ${requestRoute} in parameters.`)
}

async function resolveMultipart(req: any, config?: MultiPartConfig): Promise<WebhookMultipartForm | undefined> {
  const contype = req.headers['content-type']
  if (!contype || !hasMultiPart(contype)) {
    return
  }
  return await parseMultipartFormData(req, config)
}

function hasMultiPart(contype: string) {
  return /multipart\/form-data/i.test(contype)
}
