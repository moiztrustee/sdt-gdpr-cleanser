import * as s3 from '@aws-sdk/client-s3'
import * as log from 'lambda-log'
import { Readable } from 'stream'
import { finished } from 'stream/promises'
import { createReadStream, createWriteStream, rm } from 'fs'
import KSUID from 'ksuid'
// import { resolve } from 'path'
// import { DeleteObjectsCommandInput } from '@aws-sdk/client-s3'
// import { all } from 'axios'


export type File = {
    name: string
    path: string
    type?: string
}

export type S3File = File & {
    bucket: {
      name: string
      arn?: string
    }
}

export class S3Service {
  constructor(readonly client: s3.S3Client, readonly ephemeralPath: string = '/tmp') {}

  async read(file: S3File): Promise<{ stream: Readable }> {
    const input = {
      Bucket: file.bucket.name,
      Key: [file.path, file.name].join('/'),
    } as s3.GetObjectCommandInput

    log.info(`PATH: ${input.Key}`)
    return this.client.send(new s3.GetObjectCommand(input)).then((response) => ({
      stream: response.Body as Readable,
    }))
  }

  async getAll(params: s3.ListObjectsV2CommandInput) {
    return this.client.send(new s3.ListObjectsV2Command(params));
  }

  async write(file: S3File, data: Readable): Promise<S3File> {
    const temp = [this.ephemeralPath, `${KSUID.randomSync().string}.${file.type ?? 'csv'}`].join('/')

    await finished(data.pipe(createWriteStream(temp)))

    const input = {
      Bucket: file.bucket.name,
      Key: [file.path, file.name].join('/'),
    } as s3.PutObjectCommandInput

    return this.client
      .send(
        new s3.PutObjectCommand({
          ...input,
          Body: createReadStream(temp),
        }),
      )
      .then(
        (output) =>
          new Promise((resolve, reject) => {
            rm(temp, (error) => {
              if (error) {
                log.error(error)
              }

              resolve(file)
            })
          }),
      )
  }
}
