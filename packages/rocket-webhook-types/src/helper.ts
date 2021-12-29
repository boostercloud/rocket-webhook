import { WebhookRequest } from './webhook-request'

export class Helper {
  public static getOriginFromRequest(request: WebhookRequest): string {
    const url = require('url')
    const parsedUrl = new url.URL(request.req.url, `http://${request.req.headers.host}/`)
    const pathName = parsedUrl.pathname.replace('/', '')
    const paths = pathName.split('/')
    if (paths && paths.length > 0) {
      return paths[paths.length - 1]
    }
    return ''
  }
}
