import { getRoute, WebhookParams, WebhookParamsEvent } from '@boostercloud/rocket-webhook-types'
import { BoosterConfig, UUID } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { TerraformFunctionApp } from './terraform-function-app'
import { ApplicationGatewayBackendAddressPool } from '@cdktf/provider-azurerm/lib/application-gateway'

const backendAddressPoolId = 'rocketWebHookBackendAddressPool'

export class Synth {
  public static async mountStack(
    params: WebhookParams,
    config: BoosterConfig,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils,
  ): Promise<ApplicationSynthStack> {

    const functionApp = TerraformFunctionApp.build(
      applicationSynthStack,
      config,
      utils,
    )
    const rocketStack = applicationSynthStack.rocketStack ?? []
    rocketStack.push(functionApp)

    const appGateway = applicationSynthStack.appGateway
    const newBackendAddressPool: ApplicationGatewayBackendAddressPool[] = [
      {
        name: backendAddressPoolId,
        fqdns: [`${functionApp.name}.azurewebsites.net`],
      },
    ]
    appGateway?.addOverride('backend_address_pool', newBackendAddressPool)

    const names: Array<{
      ruleName: string;
      rewriteName: string,
      route: string,
    }> = params.map((param: WebhookParamsEvent) => {
      const suffix = UUID.generate().toString().substring(0, 23)
      const ruleName = utils.toTerraformName(applicationSynthStack.appPrefix, `ru${suffix}`)
      const rewriteName = utils.toTerraformName(applicationSynthStack.appPrefix, `rw${suffix}`)
      const route = getRoute(param)
      return {
        ruleName: ruleName,
        rewriteName: rewriteName,
        route: route,
      }
    })

    const pathRules = names.map((name) => ({
      name: name.ruleName,
      paths: [`/${name.route}`, `/${name.route}/*`],
      backend_address_pool_name: backendAddressPoolId,
      backend_http_settings_name: 'mainBackendHttpSettings',
      rewrite_rule_set_name: 'mainRewriteRuleSet',
    }))

    const rewritesRules = names.map((name, index: number) => ({
      name: name.rewriteName,
      rule_sequence: index + 1,
      condition: [
        {
          pattern: `/${name.route}`,
          variable: 'var_request_uri',
          ignore_case: true,
        },
      ],
      url: {
        path: `/api/${name.route}`,
        components: 'path_only',
      },
    }))

    appGateway?.addOverride('url_path_map.0.path_rule', [...pathRules])
    appGateway?.addOverride('rewrite_rule_set.0.rewrite_rule', [...rewritesRules])

    return applicationSynthStack
  }
}
