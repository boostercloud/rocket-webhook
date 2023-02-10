import { WebhookParams, WebhookParamsEvent } from '@boostercloud/rocket-webhook-types'
import { BoosterConfig } from '@boostercloud/framework-types'
import { Router } from 'express'
import { WebhookController } from './controllers/webhook-controller'

export class Infra {
  public static mountStack(params: WebhookParams, config: BoosterConfig, router: Router): void {
    params.forEach((parameter: WebhookParamsEvent) =>
      router.use('/webhook', new WebhookController(parameter.origin).router)
    )
  }
}
