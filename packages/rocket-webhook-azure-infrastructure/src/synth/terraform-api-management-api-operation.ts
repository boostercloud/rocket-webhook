import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { ApiManagementApi, ApiManagementApiOperation } from '@cdktf/provider-azurerm'
import { TerraformStack } from 'cdktf'
import { eventPublisherName } from '../constants'

export class TerraformApiManagementApiOperation {
  static build(
    terraformStack: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils,
    appPrefix: string,
    resourceGroupName: string
  ): ApiManagementApiOperation {
    const apiManagementApi = applicationSynthStack.apiManagementApi as ApiManagementApi
    const idApiManagementApiOperation = utils.toTerraformName(appPrefix, 'amaor')

    return new ApiManagementApiOperation(terraformStack, idApiManagementApiOperation, {
      operationId: `${eventPublisherName}POST`,
      apiName: apiManagementApi?.name,
      apiManagementName: apiManagementApi?.apiManagementName,
      resourceGroupName: resourceGroupName,
      displayName: `/${eventPublisherName}`,
      method: 'POST',
      urlTemplate: `/${eventPublisherName}`,
      description: '',
      response: [
        {
          statusCode: 200,
        },
      ],
    })
  }
}
