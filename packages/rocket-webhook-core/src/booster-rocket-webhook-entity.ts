import { Entity, Reduces } from '@boostercloud/framework-core'
import { BoosterRocketWebhookEvent } from './booster-rocket-webhook-event'

@Entity
export class BoosterRocketWebhookEntity {
  public constructor(readonly value: unknown) {}

  @Reduces(BoosterRocketWebhookEvent)
  public static reduceRocketWebhookEvent(event: BoosterRocketWebhookEvent): BoosterRocketWebhookEntity {
    return new BoosterRocketWebhookEntity(event.rawEvent)
  }
}
