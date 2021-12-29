# Booster rocket webhook Azure

## Description
This Rocket adds a Webhook to your Booster application. When the webhook is called, a function will be executed in your Booster application with request as a parameter. 

## Supported Providers

This Rocket supports the following Providers:

* Azure
* Local

## Application configuration

Add your rocket to your application in the configuration file.

### Generic
```typescript
function buildBoosterWebhook(config: BoosterConfig): BoosterWebhook {
    return new BoosterWebhook(config, [
        {
            origin: 'stripe',
            handlerClass: StripeHandler,
        },
        {
            origin: 'otro',
            handlerClass: FacebookHandler,
        },
    ])
}
```

And call this method on your rocket configuration.

For Azure
```typescript
  config.rockets = [buildBoosterWebhook(config).rocketForAzure()]
```

For Local
```typescript
  config.rockets = [buildBoosterWebhook(config).rocketForLocal()]
```

### Parameters

* origin: Identify the webhook. It will be also the name of the endpoint that will be created
* handlerClass: A class with a `handle` method to handle the request

The `handle` method should be like this one:

```typescript
export class StripeHandlerCommand {

    constructor() {
    }

    public static async handle(webhookEventInterface: WebhookEvent, register: Register): Promise<string> {
        return Promise.resolve('ok')
    }
}
```

## Compile

> npm install

> npm run compile
