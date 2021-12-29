import { WebhookParams, functionID, WebhookParamsEvent } from '@boostercloud/rocket-webhook-types'
import { BoosterConfig, rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import { Router } from 'express'
import { WebhookController } from './controllers/webhook-controller'

export class Infra {
  public static mountStack(params: WebhookParams, config: BoosterConfig, router: Router): void {
    process.env[rocketFunctionIDEnvVar] = functionID
    params.forEach((parameter: WebhookParamsEvent) =>
      router.use('/webhook', new WebhookController(parameter.origin).router)
    )
  }
}
