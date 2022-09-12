import { Register } from '@boostercloud/framework-types'
import { WebhookEvent } from '@boostercloud/rocket-webhook-types'

export class VoidHandlerCommand {
  constructor() {}

  public static async handle(webhookEventInterface: WebhookEvent, register: Register): Promise<void> {
    console.log('VoidHandlerCommand!', webhookEventInterface)
    return Promise.resolve()
  }
}
