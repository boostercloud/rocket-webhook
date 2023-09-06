import { RocketUtils, templates } from '@boostercloud/framework-provider-azure-infrastructure'
import { TerraformStack } from 'cdktf'
import * as Mustache from 'mustache'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'
import { apiManagementApiOperation, apiManagementApiOperationPolicy } from '@cdktf/provider-azurerm'
import { UUID } from '@boostercloud/framework-types'

export class TerraformApiManagementApiOperationPolicy {
  static build(
    providerResource: AzurermProvider,
    utils: RocketUtils,
    appPrefix: string,
    functionAppName: string,
    terraformStack: TerraformStack,
    apiManagementApiOperationResource: apiManagementApiOperation.ApiManagementApiOperation,
    resourceGroupName: string
  ): apiManagementApiOperationPolicy.ApiManagementApiOperationPolicy {
    const suffix = UUID.generate().toString().substring(0, 23)
    const idApiManagementApiOperationPolicy = utils.toTerraformName(appPrefix, suffix)
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
