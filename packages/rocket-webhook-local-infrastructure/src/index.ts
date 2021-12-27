import { InfrastructureRocket } from '@boostercloud/framework-provider-local-infrastructure'
import { WebhookParams } from '@boostercloud/rocket-webhook-types'
import { Infra } from './infra'

const LocalWebhook = (params: WebhookParams): InfrastructureRocket => ({
  mountStack: Infra.mountStack.bind(Infra, params),
})

export default LocalWebhook
