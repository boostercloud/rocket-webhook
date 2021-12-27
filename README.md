# Booster rocket webhook Azure

## Description
This Rocket adds a Webhook to your Booster application. When the webhook is called, a new BoosterRocketWebhookEvent will be created. This event will be generated including the request as the value. 

The BoosterRocketWebhookEvent should not be reduced and should be handled with a event handler. Create your own event from this one if you need it 

## Supported Providers

This Rocket supports the following Providers:

* Azure
* Local

## Application configuration

Add your rocket to your application in the configuration file.

### For Azure
```typescript
  config.rockets = [
    new BoosterWebhook(config, {}).rocketForAzure(),
  ]
```

### For Local
```typescript
  config.rockets = [
    new BoosterWebhook(config, {}).rocketForLocal(),
  ]
```

### Parameters

No parameters are needed for this Rocket.

## Compile

> npm install

> npm run compile
