import { Headers, WebhookHandlerJsonReturnType, WebhookResponseType } from '@boostercloud/rocket-webhook-types'
import { WebhookResponseClass } from '../webhook-response-builder'

export class WebhookJsonResponse implements WebhookResponseClass {
  getBody(response?: WebhookHandlerJsonReturnType): unknown {
    const body = response?.body
    return body ? JSON.stringify(response.body) : ''
  }

  getHeaders(response?: WebhookHandlerJsonReturnType): Headers {
    return { 'Content-Type': WebhookResponseType.json }
  }
}
