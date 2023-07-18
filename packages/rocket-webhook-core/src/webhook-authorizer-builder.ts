import { Class, RoleInterface } from '@boostercloud/framework-types'
import { WebhookAuthorizer } from '@boostercloud/rocket-webhook-types'
import { BoosterAuthorizer } from '@boostercloud/framework-core/dist/booster-authorizer'

export class WebhookAuthorizerBuilder {
  public static build(authorize: 'all' | Array<Class<RoleInterface>> | WebhookAuthorizer): WebhookAuthorizer {
    let authorizer: WebhookAuthorizer = BoosterAuthorizer.denyAccess
    if (authorize === 'all') {
      authorizer = BoosterAuthorizer.allowAccess
    } else if (Array.isArray(authorize)) {
      authorizer = BoosterAuthorizer.authorizeRoles.bind(null, authorize)
    } else if (typeof authorize === 'function') {
      authorizer = authorize
    }
    return authorizer
  }
}
