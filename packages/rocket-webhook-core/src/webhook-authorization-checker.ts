import { BoosterConfig, UserEnvelope } from '@boostercloud/framework-types'
import { WebhookAuthorizer, WebhookRequest, WebhookRoleAccess } from '@boostercloud/rocket-webhook-types'
import { WebhookAuthorizerBuilder } from './webhook-authorizer-builder'

export class WebhookAuthorizationChecker {
  static async authorize(
    config: BoosterConfig,
    authorizer: WebhookRoleAccess | undefined,
    userEnvelope: UserEnvelope | undefined,
    request: WebhookRequest
  ): Promise<void> {
    if (authorizer) {
      const webhookAuthorizer: WebhookAuthorizer = WebhookAuthorizerBuilder.build(authorizer)
      if (webhookAuthorizer) {
        await webhookAuthorizer(userEnvelope, request)
      }
    }
  }
}
