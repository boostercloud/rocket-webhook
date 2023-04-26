import { RocketUtils, templates } from '@boostercloud/framework-provider-azure-infrastructure'
import { TerraformStack } from 'cdktf'
import * as Mustache from 'mustache'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'
import { apiManagementApiOperation, apiManagementApiOperationPolicy } from '@cdktf/provider-azurerm'

export class TerraformApiManagementApiOperationPolicy {
  static build(
    providerResource: AzurermProvider,
    utils: RocketUtils,
    appPrefix: string,
    functionAppName: string,
    terraformStack: TerraformStack,
    apiManagementApiOperationResource: apiManagementApiOperation.ApiManagementApiOperation,
    resourceGroupName: string,
    endpoint: string
  ): apiManagementApiOperationPolicy.ApiManagementApiOperationPolicy {
    const idApiManagementApiOperationPolicy = utils.toTerraformName(appPrefix, `amaopr${endpoint}`)
    const policyContent = Mustache.render(templates.policy, { functionAppName: functionAppName })
    return new apiManagementApiOperationPolicy.ApiManagementApiOperationPolicy(
      terraformStack,
      idApiManagementApiOperationPolicy,
      {
        apiName: apiManagementApiOperationResource.apiName,
        apiManagementName: apiManagementApiOperationResource.apiManagementName,
        resourceGroupName: resourceGroupName,
        operationId: apiManagementApiOperationResource.operationId,
        xmlContent: policyContent,
        provider: providerResource,
      }
    )
  }
}
