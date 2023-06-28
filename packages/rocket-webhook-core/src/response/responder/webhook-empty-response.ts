import { Headers, WebhookHandlerReturnType, WebhookResponseType } from '@boostercloud/rocket-webhook-types'
import { WebhookResponseClass } from '../webhook-response-builder'

export class WebhookEmptyResponse implements WebhookResponseClass {
  getBody(response?: WebhookHandlerReturnType): unknown {
    return ''
  }

  getHeaders(response?: WebhookHandlerReturnType): Headers {
    return { 'Content-Type': WebhookResponseType.text }
  }
}
