import * as express from 'express'
import { boosterRocketDispatcher } from '@boostercloud/framework-core'
import { HttpCodes, requestFailed } from '../http'
import { rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import { functionID } from '@boostercloud/rocket-webhook-types'

export type APIResult =
  | { status: 'success'; result: unknown; headers: Record<string, number | string | ReadonlyArray<string>> }
  | { status: 'failure'; code: number; title: string; reason: string }

export class WebhookController {
  public router: express.Router = express.Router()

  constructor(readonly endpoint: string) {
    this.router.post(`/${endpoint}`, express.raw(), this.handleWebhook.bind(this))
  }

  public async handleWebhook(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const request = {
        [rocketFunctionIDEnvVar]: functionID,
        req: req,
      }
      const response = (await boosterRocketDispatcher(request)) as APIResult
      if (response.status === 'success') {
        for (const headersKey in response.headers) {
          res.setHeader(headersKey, response.headers[headersKey])
        }
        res.status(HttpCodes.Ok).json(response.result)
      } else {
        res.status(response.code).json({ title: response.title, reason: response.reason })
      }
    } catch (e) {
      const err = e as Error
      await requestFailed(err, res)
      next(e)
    }
  }
}
