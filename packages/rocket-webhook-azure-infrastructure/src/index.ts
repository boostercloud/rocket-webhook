import { Synth } from './synth/synth'
import { InfrastructureRocket } from '@boostercloud/framework-provider-azure-infrastructure'
import { Functions } from './functions/functions'
import { WebhookParams } from '@boostercloud/rocket-webhook-types'

const AzureWebhook = (params: WebhookParams): InfrastructureRocket => ({
  mountStack: Synth.mountStack.bind(Synth, params),
  mountFunctions: Functions.mountFunctions.bind(Synth, params),
  getFunctionAppName: Functions.getFunctionAppName.bind(Synth, params),
})

export default AzureWebhook
