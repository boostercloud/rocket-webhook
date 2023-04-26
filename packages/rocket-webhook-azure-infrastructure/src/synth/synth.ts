import { WebhookParams, WebhookParamsEvent } from '@boostercloud/rocket-webhook-types'
import { BoosterConfig } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { TerraformApiManagementApiOperation } from './terraform-api-management-api-operation'
import { TerraformApiManagementApiOperationPolicy } from './terraform-api-management-api-operation-policy'
import { TerraformFunctionApp } from './terraform-function-app'
import { TerraformResource, TerraformStack } from 'cdktf'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'
import { windowsFunctionApp } from '@cdktf/provider-azurerm'

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
    const azurermProvider = applicationSynthStack.azureProvider!

    const functionApp = TerraformFunctionApp.build(
      azurermProvider,
      terraformStack,
      applicationSynthStack,
      config,
      utils
    )
    const rocketStack = applicationSynthStack.rocketStack ?? []
    rocketStack.push(functionApp)

    params.forEach((param) =>
      this.createTerraformApiManagementApi(
        azurermProvider,
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
    providerResource: AzurermProvider,
    terraformStack: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils,
    appPrefix: string,
    resourceGroupName: string,
    param: WebhookParamsEvent,
    functionApp: windowsFunctionApp.WindowsFunctionApp,
    rocketStack: Array<TerraformResource>
  ): void {
    const apiManagementApiOperation = TerraformApiManagementApiOperation.build(
      providerResource,
      terraformStack,
      applicationSynthStack,
      utils,
      appPrefix,
      resourceGroupName,
      param.origin
    )
    const apiManagementApiOperationPolicy = TerraformApiManagementApiOperationPolicy.build(
      providerResource,
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
