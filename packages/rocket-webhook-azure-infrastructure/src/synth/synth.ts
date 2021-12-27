import { WebhookParams } from '@boostercloud/rocket-webhook-types'
import { BoosterConfig } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { TerraformApiManagementApiOperation } from './terraform-api-management-api-operation'
import { TerraformApiManagementApiOperationPolicy } from './terraform-api-management-api-operation-policy'
import { TerraformFunctionApp } from './terraform-function-app'

export class Synth {
  public static mountStack(
    params: WebhookParams,
    config: BoosterConfig,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils
  ): ApplicationSynthStack {
    const appPrefix = applicationSynthStack.appPrefix
    const terraformStack = applicationSynthStack.terraformStack
    const resourceGroupName = applicationSynthStack.resourceGroupName ?? ''

    const apiManagementApiOperation = TerraformApiManagementApiOperation.build(
      terraformStack,
      applicationSynthStack,
      utils,
      appPrefix,
      resourceGroupName
    )
    const functionApp = TerraformFunctionApp.build(terraformStack, applicationSynthStack, config, utils)
    const apiManagementApiOperationPolicy = TerraformApiManagementApiOperationPolicy.build(
      utils,
      appPrefix,
      functionApp.name,
      terraformStack,
      apiManagementApiOperation,
      resourceGroupName
    )

    const rocketStack = applicationSynthStack.rocketStack ?? []
    rocketStack.push(apiManagementApiOperation)
    rocketStack.push(apiManagementApiOperationPolicy)
    rocketStack.push(functionApp)
    return applicationSynthStack
  }
}
