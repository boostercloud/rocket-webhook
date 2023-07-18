import * as express from 'express'
import { boosterRocketDispatcher } from '@boostercloud/framework-core'
import { requestFailed } from '../http'
import { rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import {
  functionID,
  Headers,
  HttpSuccessStatusCode,
  WebhookAPIResult,
  WebhookAPISuccessResult,
  WebhookResponseType,
} from '@boostercloud/rocket-webhook-types'
import * as stream from 'stream'

export class WebhookController {
  public router: express.Router = express.Router()

  constructor(readonly endpoint: string) {
    this.router.post(`/${endpoint}`, express.raw(), this.handleWebhook.bind(this))
  }

  public async handleWebhook(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const request = {
        [rocketFunctionIDEnvVar]: functionID,
        req,
      }
      const response: WebhookAPIResult = (await boosterRocketDispatcher(request)) as WebhookAPIResult
      res.status(response.status)
      if (this.isSuccess(response)) {
        const body = response.body
        this.setHeaders(response, res)
        const type = this.getType(response?.headers)
        if (type === WebhookResponseType.file) {
          const readStream = new stream.PassThrough()
          readStream.end(response.body)
          readStream.pipe(res)
        } else if (type === WebhookResponseType.json) {
          res.json(body)
        } else {
          res.send(body)
        }
        return
      }
      res.json(response.body)
    } catch (e) {
      const err = e as Error
      await requestFailed(err, res)
      next(e)
    }
  }

  private getType(headers: Headers): WebhookResponseType {
    const contentType = headers['Content-type']

    switch (contentType) {
      case WebhookResponseType.json:
        return WebhookResponseType.json
      case WebhookResponseType.text:
        return WebhookResponseType.text
      default:
        return WebhookResponseType.file
    }
  }

  private setHeaders(response: WebhookAPISuccessResult, res: express.Response): void {
    for (const headersKey in response.headers) {
      res.setHeader(headersKey, response.headers[headersKey])
    }
  }

  private isSuccess(response: WebhookAPIResult): response is WebhookAPISuccessResult {
    return (response as WebhookAPISuccessResult).status === HttpSuccessStatusCode
  }
}
