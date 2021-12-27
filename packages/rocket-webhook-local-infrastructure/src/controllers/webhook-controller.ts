import * as express from 'express'
import { boosterRocketDispatcher } from '@boostercloud/framework-core'
import { HttpCodes, requestFailed } from '../http'

export class WebhookController {
  public router: express.Router = express.Router()

  constructor() {
    this.router.post('/', this.handleGraphQL.bind(this))
  }

  public async handleGraphQL(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const request = {
        req: {
          method: 'POST',
          url: req.url,
          headers: req.headers,
          query: req.query,
          params: req.params,
          body: req.body,
          rawBody: req.body ? JSON.stringify(req.body, null, 2) : '',
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
