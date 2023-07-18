import { Headers, WebhookHandlerReturnType, WebhookResponseType } from '@boostercloud/rocket-webhook-types'
import { WebhookFileResponse } from './responses/webhook-file-response'
import { WebhookJsonResponse } from './responses/webhook-json-response'
import { WebhookTextResponse } from './responses/webhook-text-response'
import { WebhookEmptyResponse } from './responses/webhook-empty-response'

export interface WebhookResponseClass {
  getBody(response?: WebhookHandlerReturnType): unknown
  getHeaders(response?: WebhookHandlerReturnType): Headers
}

export class WebhookResponseBuilder {
  public static DEFAULT_HEADERS: Headers = {
    'Access-Control-Allow-Origin': '*',
  }

  private webhookBaseResponse: WebhookResponseClass

  constructor(readonly response?: WebhookHandlerReturnType) {
    if (!response) {
      this.webhookBaseResponse = new WebhookEmptyResponse()
      return
    }
    switch (response.responseType) {
      case WebhookResponseType.file:
        this.webhookBaseResponse = new WebhookFileResponse()
        return
      case WebhookResponseType.json:
        this.webhookBaseResponse = new WebhookJsonResponse()
        return
      case WebhookResponseType.text:
        this.webhookBaseResponse = new WebhookTextResponse()
        return
      default:
        console.log('Unexpected response type. Using File')
        this.webhookBaseResponse = new WebhookFileResponse()
    }
  }

  public getBody(): unknown {
    return this.webhookBaseResponse.getBody(this.response)
  }

  public getHeaders(): Headers {
    let headers = WebhookResponseBuilder.DEFAULT_HEADERS
    if (this.response?.headers) {
      headers = { ...headers, ...this.response?.headers }
    }
    const customHeaders = this.webhookBaseResponse.getHeaders(this.response)
    return { ...headers, ...customHeaders }
  }
}
