import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { TerraformStack } from 'cdktf'
import { apiManagementApi, apiManagementApiOperation } from '@cdktf/provider-azurerm'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'
import { UUID } from '@boostercloud/framework-types'

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
    const suffix = UUID.generate().toString().substring(0, 23)
    const idApiManagementApiOperation = utils.toTerraformName(appPrefix, suffix)

    const operationId = `${endpoint.replace(/\//g, '-')}POST`
    return new apiManagementApiOperation.ApiManagementApiOperation(
      terraformStackResource,
      idApiManagementApiOperation,
      {
        operationId: operationId,
        apiName: apiManagementApi.name,
        apiManagementName: apiManagementApi.apiManagementName,
        resourceGroupName: resourceGroupName,
        displayName: `/${endpoint}`,
        method: 'POST',
        urlTemplate: `/${endpoint}`,
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
