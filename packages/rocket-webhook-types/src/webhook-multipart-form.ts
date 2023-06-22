export declare type WebhookMultipartForm = {
  files: WebhookParsedFile[]
  fields: WebhookParsedField[]
}

export declare type WebhookParsedFile = {
  name: string
  bufferFile: Buffer
  filename: string
  encoding: string
  mimeType: string
}

export declare type WebhookParsedField = {
  name: string
  value: unknown
  nameTruncated: boolean
  valueTruncated: boolean
  encoding: string
  mimeType: string
}

// From BusBoy configuration
export type MultiPartConfig = {
  /**
   * For multipart forms, the default character set to use for values of part header parameters (e.g. filename)
   * that are not extended parameters (that contain an explicit charset
   *
   * @default 'latin1'
   */
  defParamCharset?: string | undefined

  /**
   * If paths in filenames from file parts in a 'multipart/form-data' request shall be preserved.
   *
   * @default false
   */
  preservePath?: boolean | undefined

  limits?: {
    /**
     * For multipart forms, the max file size (in bytes).
     *
     * @default Infinity
     */
    fileSize?: number | undefined

    /**
     * For multipart forms, the max number of file fields.
     *
     * @default Infinity
     */
    files?: number | undefined

    /**
     * For multipart forms, the max number of parts (fields + files).
     *
     * @default Infinity
     */
    parts?: number | undefined
  }
}
