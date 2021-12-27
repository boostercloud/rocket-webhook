import { WebhookParams, functionID } from '@boostercloud/rocket-webhook-types'
import { BoosterConfig, rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import { Router } from 'express'
import { WebhookController } from './controllers/webhook-controller'

export class Infra {
  public static mountStack(params: WebhookParams, config: BoosterConfig, router: Router): void {
    process.env[rocketFunctionIDEnvVar] = functionID
    router.use('/webhookfunc', new WebhookController().router)
  }
}
