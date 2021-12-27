import { eventPublisherName } from '../constants'
import { Binding, FunctionDefinition } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'

export declare type WebhookHttpBinding = Binding & {
  authLevel?: string
  methods?: Array<string>
}

export declare type WebhookHttpFunctionDefinition = FunctionDefinition<WebhookHttpBinding>

export class WebhookFunction {
  static getFunctionDefinition(config: BoosterConfig): WebhookHttpFunctionDefinition {
    return {
      name: eventPublisherName,
      config: {
        bindings: [
          {
            type: 'httpTrigger',
            direction: 'in',
            name: 'rawRequest',
            authLevel: 'anonymous',
            methods: ['post'],
          },
          {
            type: 'http',
            direction: 'out',
            name: 'res',
          },
        ],
        scriptFile: config.functionRelativePath,
        entryPoint: config.rocketDispatcherHandler.split('.')[1],
      },
    }
  }
}
