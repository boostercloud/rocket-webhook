import { Binding, FunctionDefinition } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'

export declare type WebhookHttpBinding = Binding & {
  authLevel?: string
  methods?: Array<string>
  route?: string
}

export declare type WebhookHttpFunctionDefinition = FunctionDefinition<WebhookHttpBinding>

export class WebhookFunction {
  static getFunctionDefinition(config: BoosterConfig, endpoint: string): WebhookHttpFunctionDefinition {
    const name = endpoint.replace(/\//g, '_')
    return {
      name: name,
      config: {
        bindings: [
          {
            type: 'httpTrigger',
            direction: 'in',
            name: 'rawRequest',
            authLevel: 'anonymous',
            methods: ['post', 'get'],
            route: `${endpoint}`,
          },
          {
            type: 'http',
            direction: 'out',
            name: '$return',
          },
        ],
        scriptFile: config.functionRelativePath,
        entryPoint: config.rocketDispatcherHandler.split('.')[1],
      },
    }
  }
}
