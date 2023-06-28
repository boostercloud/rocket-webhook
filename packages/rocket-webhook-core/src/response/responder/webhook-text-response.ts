import { Headers, WebhookHandlerTextReturnType, WebhookResponseType } from '@boostercloud/rocket-webhook-types'
import { WebhookResponseClass } from '../webhook-response-builder'

export class WebhookTextResponse implements WebhookResponseClass {
  getBody(response?: WebhookHandlerTextReturnType): unknown {
    return response?.body ?? ''
  }

  getHeaders(response?: WebhookHandlerTextReturnType): Headers {
    return { 'Content-Type': WebhookResponseType.text }
  }
}
