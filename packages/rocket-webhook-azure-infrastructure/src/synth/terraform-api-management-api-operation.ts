import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { TerraformStack } from 'cdktf'
import { apiManagementApi, apiManagementApiOperation } from '@cdktf/provider-azurerm'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'

export class TerraformApiManagementApiOperation {
  static build(
    providerResource: AzurermProvider,
    terraformStackResource: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils,
    appPrefix: string,
    resourceGroupName: string,
    endpoint: string
  ): apiManagementApiOperation.ApiManagementApiOperation {
    const apiManagementApi: apiManagementApi.ApiManagementApi = applicationSynthStack.apiManagementApi!
    const idApiManagementApiOperation = utils.toTerraformName(appPrefix, `amaor${endpoint}`)

    return new apiManagementApiOperation.ApiManagementApiOperation(
      terraformStackResource,
      idApiManagementApiOperation,
      {
        operationId: `${endpoint}POST`,
        apiName: apiManagementApi.name,
        apiManagementName: apiManagementApi.apiManagementName,
        resourceGroupName: resourceGroupName,
        displayName: `/webhook/${endpoint}`,
        method: 'POST',
        urlTemplate: `/webhook/${endpoint}`,
        description: '',
        response: [
          {
            statusCode: 200,
          },
        ],
        provider: providerResource,
      }
    )
  }
}
