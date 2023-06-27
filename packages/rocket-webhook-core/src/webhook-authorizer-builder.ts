import { Class, UserEnvelope, RoleInterface, NotAuthorizedError } from '@boostercloud/framework-types'
import { WebhookAuthorizer } from '@boostercloud/rocket-webhook-types'

export class WebhookAuthorizerBuilder {
  public static allowAccess(): Promise<void> {
    return Promise.resolve()
  }

  public static denyAccess(): Promise<void> {
    return Promise.reject(new NotAuthorizedError('Access denied for this resource'))
  }

  public static authorizeRoles(authorizedRoles: Array<Class<RoleInterface>>, user?: UserEnvelope): Promise<void> {
    if (user && userHasSomeRole(user, authorizedRoles)) {
      return WebhookAuthorizerBuilder.allowAccess()
    }
    return WebhookAuthorizerBuilder.denyAccess()
  }

  public static build(authorize: 'all' | Array<Class<RoleInterface>> | WebhookAuthorizer): WebhookAuthorizer {
    let authorizer: WebhookAuthorizer = WebhookAuthorizerBuilder.denyAccess
    if (authorize === 'all') {
      authorizer = WebhookAuthorizerBuilder.allowAccess
    } else if (Array.isArray(authorize)) {
      authorizer = WebhookAuthorizerBuilder.authorizeRoles.bind(null, authorize)
    } else if (typeof authorize === 'function') {
      authorizer = authorize
    }
    return authorizer
  }
}

function userHasSomeRole(user: UserEnvelope, authorizedRoles: Array<Class<RoleInterface>>): boolean {
  return authorizedRoles.some((roleClass) => user.roles?.includes(roleClass.name))
}
