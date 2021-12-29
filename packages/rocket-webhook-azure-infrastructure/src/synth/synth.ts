import { WebhookParams, WebhookParamsEvent } from '@boostercloud/rocket-webhook-types'
import { BoosterConfig } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { TerraformApiManagementApiOperation } from './terraform-api-management-api-operation'
import { TerraformApiManagementApiOperationPolicy } from './terraform-api-management-api-operation-policy'
import { TerraformFunctionApp } from './terraform-function-app'
import { TerraformResource, TerraformStack } from 'cdktf'
import { FunctionApp } from '@cdktf/provider-azurerm'

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
    const functionApp = TerraformFunctionApp.build(terraformStack, applicationSynthStack, config, utils)
    const rocketStack = applicationSynthStack.rocketStack ?? []
    rocketStack.push(functionApp)

    params.forEach((param) =>
      this.createTerraformApiManagementApi(
        terraformStack,
        applicationSynthStack,
        utils,
        appPrefix,
        resourceGroupName,
        param,
        functionApp,
        rocketStack
      )
    )

    return applicationSynthStack
  }

  private static createTerraformApiManagementApi(
    terraformStack: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils,
    appPrefix: string,
    resourceGroupName: string,
    param: WebhookParamsEvent,
    functionApp: FunctionApp,
    rocketStack: Array<TerraformResource>
  ): void {
    const apiManagementApiOperation = TerraformApiManagementApiOperation.build(
      terraformStack,
      applicationSynthStack,
      utils,
      appPrefix,
      resourceGroupName,
      param.origin
    )
    const apiManagementApiOperationPolicy = TerraformApiManagementApiOperationPolicy.build(
      utils,
      appPrefix,
      functionApp.name,
      terraformStack,
      apiManagementApiOperation,
      resourceGroupName,
      param.origin
    )
    rocketStack.push(apiManagementApiOperation)
    rocketStack.push(apiManagementApiOperationPolicy)
  }
}
