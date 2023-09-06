import { WebhookRequest } from './webhook-request'

export class Helper {
  public static getRouteFromRequest(request: WebhookRequest): string {
    const url = require('url')
    const parsedUrl = new url.URL(request.req.url, `http://${request.req.headers.host}/`)
    return parsedUrl.pathname.replace(/^(\/api\/|\/)/, '')
  }
}
