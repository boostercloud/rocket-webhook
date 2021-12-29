import * as express from 'express'
import { boosterRocketDispatcher } from '@boostercloud/framework-core'
import { HttpCodes, requestFailed } from '../http'

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
          rawBody: req.body, // Body is of type Buffer
          body: JSON.parse(req.body.toString()),
        },
      }
      const response = await boosterRocketDispatcher(request)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.status(HttpCodes.Ok).json(response.result)
    } catch (e) {
      const err = e as Error
      await requestFailed(err, res)
      next(e)
    }
  }
}
