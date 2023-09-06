import { BoosterConfig, UserEnvelope } from '@boostercloud/framework-types'
import { WebhookRequest } from '@boostercloud/rocket-webhook-types'
import { BoosterTokenVerifier } from '@boostercloud/framework-core/dist/booster-token-verifier'

export class WebhookTokenVerifier {
  static async verify(config: BoosterConfig, request: WebhookRequest): Promise<UserEnvelope | undefined> {
    const boosterTokenVerifier = new BoosterTokenVerifier(config)
    const headers = request?.req?.headers
    const token = headers?.authorization
    if (!token) {
      return
    }
    return await boosterTokenVerifier.verify(token)
  }
}
