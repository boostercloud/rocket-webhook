import { TerraformStack } from 'cdktf'
import { BoosterConfig } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { getFunctionAppName } from '../helper'
import { functionID } from '@boostercloud/rocket-webhook-types'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'
import { windowsFunctionApp } from '@cdktf/provider-azurerm'

export class TerraformFunctionApp {
  static build(
    providerResource: AzurermProvider,
    terraformStack: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    config: BoosterConfig,
    utils: RocketUtils
  ): windowsFunctionApp.WindowsFunctionApp {
    const resourceGroup = applicationSynthStack.resourceGroup!
    const applicationServicePlan = applicationSynthStack.applicationServicePlan!
    const storageAccount = applicationSynthStack.storageAccount!
    const cosmosDatabaseName = applicationSynthStack.cosmosdbDatabase?.name
    const apiManagementServiceName = applicationSynthStack.apiManagementName
    const cosmosDbConnectionString = applicationSynthStack.cosmosdbDatabase?.primaryKey
    const functionAppName = getFunctionAppName(applicationSynthStack)

    const id = utils.toTerraformName(applicationSynthStack.appPrefix, 'webhookfunc')
    return new windowsFunctionApp.WindowsFunctionApp(terraformStack, id, {
      name: functionAppName,
      location: resourceGroup.location,
      resourceGroupName: resourceGroup.name,
      servicePlanId: applicationServicePlan.id,
      appSettings: {
        WEBSITE_RUN_FROM_PACKAGE: '1',
        WEBSITE_CONTENTSHARE: id,
        ...config.env,
        BOOSTER_ENV: config.environmentName,
        BOOSTER_REST_API_URL: `https://${apiManagementServiceName}.azure-api.net/${config.environmentName}`,
        COSMOSDB_CONNECTION_STRING: `AccountEndpoint=https://${cosmosDatabaseName}.documents.azure.com:443/;AccountKey=${cosmosDbConnectionString};`,
        BOOSTER_ROCKET_FUNCTION_ID: functionID,
      },
      storageAccountName: storageAccount.name,
      storageAccountAccessKey: storageAccount.primaryAccessKey,
      dependsOn: [resourceGroup],
      lifecycle: {
        ignoreChanges: ['app_settings["WEBSITE_RUN_FROM_PACKAGE"]'],
      },
      provider: providerResource,
      siteConfig: {
        applicationStack: {
          nodeVersion: '~14',
        },
      },
      functionsExtensionVersion: '~3', // keep it on version 3. Version 4 needs a migration process
    })
  }
}
