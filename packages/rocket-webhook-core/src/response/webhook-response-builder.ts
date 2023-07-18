import {
  Headers,
  WebhookHandlerFileReturnType,
  WebhookHandlerJsonReturnType,
  WebhookHandlerReturnType,
  WebhookHandlerTextReturnType,
  WebhookResponseType,
} from '@boostercloud/rocket-webhook-types'
import { WebhookFileResponse } from './responder/webhook-file-response'
import { WebhookJsonResponse } from './responder/webhook-json-response'
import { WebhookTextResponse } from './responder/webhook-text-response'
import { WebhookEmptyResponse } from './responder/webhook-empty-response'

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
    if (this.isFile(response)) {
      this.webhookBaseResponse = new WebhookFileResponse()
      return
    }
    if (this.isJson(response)) {
      this.webhookBaseResponse = new WebhookJsonResponse()
      return
    }
    if (this.isText(response)) {
      this.webhookBaseResponse = new WebhookTextResponse()
      return
    }
    console.log('Unexpected response type. Using File')
    this.webhookBaseResponse = new WebhookFileResponse()
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

  private isText(response: WebhookHandlerReturnType): response is WebhookHandlerTextReturnType {
    return (response as WebhookHandlerTextReturnType).responseType === WebhookResponseType.text
  }

  private isJson(response: WebhookHandlerReturnType): response is WebhookHandlerJsonReturnType {
    return (response as WebhookHandlerJsonReturnType).responseType === WebhookResponseType.json
  }

  private isFile(response: WebhookHandlerReturnType): response is WebhookHandlerFileReturnType {
    return (response as WebhookHandlerFileReturnType).responseType === WebhookResponseType.file
  }
}
