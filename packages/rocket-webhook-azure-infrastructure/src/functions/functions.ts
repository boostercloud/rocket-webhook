import { getRoute, WebhookParams } from '@boostercloud/rocket-webhook-types'
import {
  ApplicationSynthStack,
  FunctionAppV4Definitions,
  RocketUtils,
} from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { WebhookFunction } from './webhook-function'
import { getFunctionAppName } from '../helper'

export class Functions {
  static async mountFunctionsV4(
    params: WebhookParams,
    _config: BoosterConfig,
    applicationSynthStack: ApplicationSynthStack,
    _utils: RocketUtils
  ): Promise<FunctionAppV4Definitions> {
    const functionAppName = getFunctionAppName(applicationSynthStack.resourceGroupName)
    const registrations = params.map((param) => WebhookFunction.generateFunctionsCode(getRoute(param))).join('\n')
    const functionsCode = WebhookFunction.sharedImports() + registrations
    return [{ functionAppName, functionsCode }]
  }

  static getFunctionAppName(params: WebhookParams, applicationSynthStack: ApplicationSynthStack): string {
    return getFunctionAppName(applicationSynthStack.resourceGroupName)
  }
}
