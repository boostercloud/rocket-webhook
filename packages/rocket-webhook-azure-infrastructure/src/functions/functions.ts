import { WebhookParams } from '@boostercloud/rocket-webhook-types'
import { ApplicationSynthStack, FunctionDefinition } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { WebhookFunction } from './webhook-function'
import { getFunctionAppName } from '../helper'

export class Functions {
  static mountFunctions(params: WebhookParams, config: BoosterConfig): Array<FunctionDefinition> {
    return params.map((param) => WebhookFunction.getFunctionDefinition(config, param.origin))
  }

  static getFunctionAppName(params: WebhookParams, applicationSynthStack: ApplicationSynthStack): string {
    return getFunctionAppName(applicationSynthStack)
  }
}
