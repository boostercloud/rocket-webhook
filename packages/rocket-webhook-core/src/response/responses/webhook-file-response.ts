import { Headers, WebhookHandlerFileReturnType } from '@boostercloud/rocket-webhook-types'
import { WebhookResponseClass } from '../webhook-response-builder'

export class WebhookFileResponse implements WebhookResponseClass {
  getBody(response?: WebhookHandlerFileReturnType): unknown {
    return response?.body
  }

  getHeaders(response?: WebhookHandlerFileReturnType): Headers {
    return {
      'Content-Type': response?.file.mimeType || '',
      'Content-Disposition': `attachment; filename=${response?.file.name}`,
    }
  }
}
