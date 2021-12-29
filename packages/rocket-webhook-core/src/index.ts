import { BoosterConfig, RocketDescriptor } from '@boostercloud/framework-types'
import { functionID, WebhookParams, WebhookRequest } from '@boostercloud/rocket-webhook-types'
import { dispatch } from './webhook-dispatcher'

export class BoosterWebhook {
  public constructor(readonly config: BoosterConfig, readonly params: WebhookParams) {
    config.registerRocketFunction(functionID, async (config: BoosterConfig, request: unknown) => {
      const webhookRequest = request as WebhookRequest
      return dispatch(config, webhookRequest, params)
    })
  }

  public rocketForAzure(): RocketDescriptor {
    return {
      packageName: '@boostercloud/rocket-webhook-azure-infrastructure',
      parameters: this.params,
    }
  }

  public rocketForLocal(): RocketDescriptor {
    return {
      packageName: '@boostercloud/rocket-webhook-local-infrastructure',
      parameters: this.params,
    }
  }
}
