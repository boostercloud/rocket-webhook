export class WebhookFunction {
  static sharedImports(): string {
    return `const { app } = require('@azure/functions')
const { boosterRocketDispatcher } = require('./dist/index')
`
  }

  static generateFunctionsCode(endpoint: string): string {
    return `
app.http(${JSON.stringify(endpoint.replace(/[^a-zA-Z0-9_]/g, '_'))}, {
  methods: ['POST', 'GET'],
  authLevel: 'anonymous',
  route: ${JSON.stringify(endpoint)},
  handler: async (request, context) => {
    const headers = {}
    request.headers.forEach((value, key) => { headers[key] = value })
    
    const query = {}
    const url = new URL(request.url)
    url.searchParams.forEach((value, key) => { query[key] = value })
    
    const contentType = headers['content-type'] || ''
    const isMultipart = /multipart\\/form-data/i.test(contentType)
    
    let rawBody
    let body
    if (isMultipart) {
      const buffer = Buffer.from(await request.arrayBuffer())
      rawBody = buffer.toString()
      body = buffer
    } else {
      rawBody = await request.text()
      try {
        body = JSON.parse(rawBody)
      } catch (e) {
        body = rawBody
      }
    }
    
    const webhookRequest = {
      req: {
        method: request.method,
        url: request.url,
        originalUrl: request.url,
        headers: headers,
        query: query,
        params: request.params,
        rawBody: rawBody,
        body: body,
      },
    }
    
    const result = await boosterRocketDispatcher(webhookRequest)
    
    const responseBody = ((typeof result.body === 'object' && result.body !== null) && !Buffer.isBuffer(result.body))
      ? JSON.stringify(result.body)
      : result.body
    
    return {
      status: result.status,
      headers: result.headers,
      body: responseBody,
    }
  }
})
`
  }
}
