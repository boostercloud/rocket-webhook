import { Event } from '@boostercloud/framework-core'

@Event
export class BoosterRocketWebhookEvent {
  constructor(readonly rawEvent: unknown) {}

  public entityID(): string {
    const crypto = require('crypto')
    return crypto.createHash('md5').update(this.rawEvent).digest('hex')
  }
}
