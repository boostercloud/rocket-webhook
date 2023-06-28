export type Headers = Record<string, number | string | ReadonlyArray<string>>

export const HttpSuccessStatusCode = 200

export type WebhookAPISuccessResult = {
  status: 200
  body: unknown
  headers: Headers
}

export type WebhookAPIErrorResult = { status: number; body: { title: string; reason: string }; headers: Headers }

export type WebhookAPIResult = WebhookAPISuccessResult | WebhookAPIErrorResult
