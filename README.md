# Booster rocket webhook Azure

## Description
This Rocket adds HTTP endpoints to your Booster application. When an endpoint is called, a function will be executed in your Booster application with request as a parameter. 

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
            route: 'test',
            handlerClass: TestHandler,
        },
        {
            route: 'clients/other',
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

* route: The endpoint that will be created. It is possible to define nested routes.
* handlerClass: A class with a `handle` method to handle the request
* multiPartConfig: multipart/form-data configuration
  * defParamCharset: the default character set to use for values of part header parameters (e.g. filename)
  * preservePath: If paths in filenames from file parts in a 'multipart/form-data' request shall be preserved. 
  * limits:
    * fileSize: the max file size (in bytes)
    * files: the max number of file fields.
    * parts: the max number of parts (fields + files).

The `handle` method should be like this one:

```typescript
export class TestHandler {

  constructor() {
  }

  public static async handle(webhookEventInterface: WebhookEvent, register: Register): Promise<WebhookHandlerReturnType> {
    if (validationFails()) {
      throw new InvalidParameterError("Error message");
    }
    return Promise.resolve({
      body: { name: "my_name" },
      responseType: WebhookResponseType.json,
    });
  }
}
```

## Return type

Handle methods return a promise of WebhookHandlerReturnType or void. This object contains the headers and body to be returned as response. You need to specify the responseType. Example:

```typescript
  public static async handle(
    webhookEventInterface: WebhookEvent,
    register: Register
  ): Promise<WebhookHandlerReturnType> {
    return Promise.resolve({
      body: 'ok',
      headers: {
        Test: 'test header',
      },
      responseType: WebhookResponseType.text,
    })
  }
```

To return a file set the responseType to `WebhookResponseType.file`. Specify the name and mime type in the `file` field.

Example:

```typescript
    const result: WebhookHandlerReturnType = {
  body: file,
  file: {
    name: '1.txt',
    mimeType: WebhookResponseType.text,
  },
  responseType: WebhookResponseType.file,
}
```

## Authorization

To define with roles can access each point use the `authorize` configuration parameter as the `authorize` parameter in Booster.

Example:

```typescript
{
  route: 'all',
        handlerClass: AllHandlerDispatcher,
        authorize: 'all',
},
{
  route: 'test/roles',
        handlerClass: AdminHandlerDispatcher,
        authorize: [Admin],
},
{
  route: 'custom',
        handlerClass: CustomHandlerDispatcher,
        authorize: (currentUser?: UserEnvelope, request?: WebhookRequest): Promise<void> => {
          if (currentUser?.username !== 'test@test.com') {
            return Promise.reject('Unexpected user')
          }
          return Promise.resolve()
        },
},
```

## Usage

```shell
curl --request POST 'http://localhost:3000/webhook/command?param1=testvalue'
```

The webhookEventInterface object will be similar to this one: 

```json
{
  origin: 'test',
  method: 'POST',
  url: '/test?param1=testvalue',
  originalUrl: '/webhook/test?param1=testvalue',
  headers: {
    accept: '*/*',
    'cache-control': 'no-cache',
    host: 'localhost:3000',
    'accept-encoding': 'gzip, deflate, br',
    connection: 'keep-alive',
    'content-length': '0'
  },
  query: { param1: 'testvalue' },
  params: {},
  rawBody: undefined,
  body: {}
}
```


## Multipart/form-data requests

Endpoints accepts multipart/form-data requests. The `WebhookEvent` will contains a new `multiPart` object with the files and fields in the request. Example:

```json
{
  origin: 'test',
  method: 'POST',
  url: '/test?param1=testvalue',
  originalUrl: '/webhook/test?param1=testvalue',
  headers: {
    accept: '*/*',
    'cache-control': 'no-cache',
    host: 'localhost:3000',
    'accept-encoding': 'gzip, deflate, br',
    connection: 'keep-alive',
    'content-length': '0'
  },
  query: {
    param1: 'testvalue'
  },
  params: {},
  rawBody: undefined,
  body: {},
  multipart: {
    "files": [
      {
        name: "file1",
        bufferFile: Buffer(11),
        filename: "file1.txt",
        encoding: "7bit",
        mimeType: "text/plain"
      }
    ],
    "fields": [
      {
        name: "parameterName",
        value: "value",
        nameTruncated: false,
        valueTruncated: false,
        encoding: "7bit",
        ...
      }
    ]
  }
}
```

## Compile

> npm install

> npm run compile
