import { BoosterConfig, rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { functionID } from '@boostercloud/rocket-webhook-types'
import { windowsFunctionApp } from '@cdktf/provider-azurerm'
import { getFunctionAppName } from '../helper'

export class TerraformFunctionApp {
  static build(
    {
      terraformStack,
      azureProvider,
      resourceGroup,
      resourceGroupName,
      applicationServicePlan,
      storageAccount,
      cosmosdbDatabase,
      appPrefix,
    }: ApplicationSynthStack,
    config: BoosterConfig,
    utils: RocketUtils
  ): windowsFunctionApp.WindowsFunctionApp {
    if (!cosmosdbDatabase) {
      throw new Error('Cosmosdb database not found')
    }
    if (!storageAccount) {
      throw new Error('Storage account not found')
    }
    if (!applicationServicePlan) {
      throw new Error('Application service plan not found')
    }
    const cosmosDatabaseName = cosmosdbDatabase?.name
    const cosmosDbConnectionString = cosmosdbDatabase?.primaryKey

    const id = utils.toTerraformName(appPrefix, 'webhookfunc')
    return new windowsFunctionApp.WindowsFunctionApp(terraformStack, id, {
      name: getFunctionAppName(resourceGroupName),
      location: resourceGroup.location,
      resourceGroupName: resourceGroup.name,
      servicePlanId: applicationServicePlan.id,
      appSettings: {
        WEBSITE_RUN_FROM_PACKAGE: '1',
        WEBSITE_CONTENTSHARE: id,
        ...config.env,
        BOOSTER_ENV: config.environmentName,
        COSMOSDB_CONNECTION_STRING: `AccountEndpoint=https://${cosmosDatabaseName}.documents.azure.com:443/;AccountKey=${cosmosDbConnectionString};`,
        WEBSITE_CONTENTAZUREFILECONNECTIONSTRING: storageAccount.primaryConnectionString,
        [rocketFunctionIDEnvVar]: functionID,
      },
      storageAccountName: storageAccount.name,
      storageAccountAccessKey: storageAccount.primaryAccessKey,
      dependsOn: [resourceGroup],
      lifecycle: {
        ignoreChanges: ['app_settings["WEBSITE_RUN_FROM_PACKAGE"]'],
      },
      provider: azureProvider,
      siteConfig: {
        applicationStack: {
          nodeVersion: '~18',
        },
      },
      functionsExtensionVersion: '~4',
    })
  }
}
