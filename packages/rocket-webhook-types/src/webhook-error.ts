export class WebhookError extends Error {
  constructor(public httpCode: string, public message: string) {
    super(message)
  }
}
