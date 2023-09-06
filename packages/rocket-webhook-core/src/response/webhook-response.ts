import {
  HttpSuccessStatusCode,
  WebhookAPIErrorResult,
  WebhookAPIResult,
  WebhookHandlerReturnType,
  WebhookResponseType,
} from '@boostercloud/rocket-webhook-types'
import { httpStatusCodeFor, toClassTitle } from '@boostercloud/framework-types'
import { WebhookResponseBuilder } from './webhook-response-builder'

export class WebhookResponse {
  public static responseSuccess(response?: WebhookHandlerReturnType): WebhookAPIResult {
    const webhookResponseBuilder: WebhookResponseBuilder = new WebhookResponseBuilder(response)
    const body = webhookResponseBuilder.getBody()
    const headers = webhookResponseBuilder.getHeaders()

    return {
      headers: headers,
      status: HttpSuccessStatusCode,
      body: body,
    }
  }

  public static responseFailure(error: Error): WebhookAPIErrorResult {
    const statusCode = httpStatusCodeFor(error)
    const body = { title: toClassTitle(error), reason: error.message }
    return {
      status: statusCode,
      body: body,
      headers: {
        ...WebhookResponseBuilder.DEFAULT_HEADERS,
        'Content-Type': WebhookResponseType.json,
      },
    }
  }
}
