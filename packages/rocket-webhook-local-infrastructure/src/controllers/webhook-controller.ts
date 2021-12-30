import * as express from 'express'
import { boosterRocketDispatcher } from '@boostercloud/framework-core'
import { HttpCodes, requestFailed } from '../http'

export type APIResult =
    | { status: 'success'; result: unknown }
    | { status: 'failure'; code: number; title: string; reason: string }

export class WebhookController {
  public router: express.Router = express.Router()

  constructor(origin: string) {
    this.router.post(`/${origin}`, express.raw({ type: 'application/json' }), this.handleWebhook.bind(this))
  }

  public async handleWebhook(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const request = {
        req: {
          method: 'POST',
          url: req.url,
          originalUrl: req.originalUrl,
          headers: req.headers,
          query: req.query,
          params: req.params,
          rawBody: req.rawBody,
          body: req.body,
        },
      }
      const response = await boosterRocketDispatcher(request) as APIResult
      if (response.status === 'success') {
        res.status(HttpCodes.Ok).json(response.result)
      } else {
        res.status(response.code).json({title: response.title, reason: response.reason})
      }
    } catch (e) {
      const err = e as Error
      await requestFailed(err, res)
      next(e)
    }
  }
}
