import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { BoosterWebhook } from '@boostercloud/rocket-webhook-core'
import { VoidHandlerCommand } from '../common/VoidHandlerCommand'

Booster.configure('local', (config: BoosterConfig): void => {
  config.appName = 'rocket-webhook-integration-tests'
  config.providerPackage = '@boostercloud/framework-provider-local'
})

Booster.configure('production', (config: BoosterConfig): void => {
  config.appName = 'rocket-webhook-integration-tests'
  config.providerPackage = '@boostercloud/framework-provider-azure'
  config.rockets = [buildBoosterWebhook(config).rocketForAzure()]
})

function buildBoosterWebhook(config: BoosterConfig): BoosterWebhook {
  return new BoosterWebhook(config, [
    {
      origin: 'void',
      handlerClass: VoidHandlerCommand,
    },
  ])
}
