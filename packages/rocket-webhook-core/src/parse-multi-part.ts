// Based on https://github.com/anzharip/azure-function-multipart
import {
  WebhookParsedField,
  WebhookParsedFile,
  WebhookMultipartForm,
  MultiPartConfig,
} from '@boostercloud/rocket-webhook-types'
import { IncomingHttpHeaders } from 'http'
import Busboy = require('busboy')

export async function parseMultipartFormData(
  request: any,
  multiPartConfig?: MultiPartConfig
): Promise<WebhookMultipartForm> {
  return new Promise((resolve, reject) => {
    try {
      const fields: Array<WebhookParsedField> = []
      const files: Array<WebhookParsedFile> = []

      let bb: Busboy.Busboy
      if (multiPartConfig) {
        bb = Busboy({
          headers: request.headers as unknown as IncomingHttpHeaders,
          ...multiPartConfig,
        })
      } else {
        bb = Busboy({
          headers: request.headers as unknown as IncomingHttpHeaders,
        })
      }

      bb.on('file', function (name, stream, { filename, encoding, mimeType }) {
        const arrayBuffer: Buffer[] = []
        stream.on('data', function (data) {
          arrayBuffer.push(data)
        })

        stream.on('end', function () {
          const bufferFile = Buffer.concat(arrayBuffer)
          files.push({
            name,
            bufferFile,
            filename,
            encoding,
            mimeType,
          })
        })
      })

      bb.on('field', function (name, value, { nameTruncated, valueTruncated, encoding, mimeType }) {
        fields.push({
          name,
          value,
          nameTruncated,
          valueTruncated,
          encoding,
          mimeType,
        })
      })

      bb.on('finish', async function () {
        resolve({
          fields: fields,
          files: files,
        })
      })

      // Express require to pipe the request
      if (request.pipe) {
        return request.pipe(bb)
      }
      bb.end(request.body)
    } catch (error) {
      reject(error)
    }
  })
}
