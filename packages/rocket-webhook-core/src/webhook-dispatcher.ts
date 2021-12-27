import { BoosterConfig, EventEnvelope, EventInterface } from '@boostercloud/framework-types'
import { BoosterRocketWebhookEntity } from './booster-rocket-webhook-entity'
import { BoosterRocketWebhookEvent } from './booster-rocket-webhook-event'

interface WebhookEventInterface extends EventInterface {
  rawEvent: unknown
}

export async function dispatch(config: BoosterConfig, request: unknown): Promise<string> {
  try {
    await processEvent(config, request)
    return Promise.resolve('Handled event')
  } catch (e) {
    const err = e as Error
    return Promise.reject(err.message || 'Internal server error')
  }

  async function processEvent(config: BoosterConfig, request: unknown): Promise<void> {
    console.log('### WEBHOOK: GOT EVENT', request)

    try {
      const envelop = toEventEnvelop(request)
      await config.provider.events.store([envelop], config, console)
    } catch (e) {
      console.log('[ROCKET#stripe] An error occurred while performing a PutItem operation: ', e)
    }
  }

  function toEventEnvelop(request: unknown): EventEnvelope {
    const { v4: uuidv4 } = require('uuid')
    const id = uuidv4()
    return {
      createdAt: new Date().toISOString(),
      entityID: id,
      kind: 'event',
      requestID: id,
      typeName: BoosterRocketWebhookEvent.name,
      entityTypeName: BoosterRocketWebhookEntity.name,
      version: 1,
      value: {
        rawEvent: request,
      } as WebhookEventInterface,
    } as EventEnvelope
  }
}
