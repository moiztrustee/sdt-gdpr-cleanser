import * as s3 from '@aws-sdk/client-s3'
import { Chance } from 'chance'
import { Readable } from 'stream'
import { streamStringifier } from './utils'
import { S3Service } from '@business/services/s3Service'

describe('S3Service', () => {
  const gen = new Chance()

  const bucket1 = {
    name: gen.string({ casing: 'lower', length: 20, symbols: false }).replace(/[^a-z0-9]/g, ''),
  }

  const bucket2 = {
    name: gen.string({ casing: 'lower', length: 20, symbols: false }).replace(/[^a-z0-9]/g, ''),
  }

  const client = new s3.S3Client({
    credentials: {
      accessKeyId: 'xxx',
      secretAccessKey: 'xxx',
    },
    region: 'eu-central-1',
    endpoint: 'http://localhost:4566',
    forcePathStyle: true,
  })

    beforeAll(async () => {
        await client.send(
            new s3.CreateBucketCommand({
                Bucket: bucket1.name,
            }),
        )

		await client.send(
			new s3.CreateBucketCommand({
				Bucket: bucket2.name,
			}),
		)        
    })

    it('should save to s3', async () => {
        const service = new S3Service(client);

        const exported = await service.write({
            bucket: { name: bucket1.name },
            path: 'generated',
            name: `${gen.guid()}.json`,
        },
        Readable.from('TEST-DATA'));

        await expect(service.read(exported).then((file) => streamStringifier(file.stream))).resolves.toBe('TEST-DATA')
    })


    it('Should get all files of bucket', async() => {
        const service = new S3Service(client);
        const filename = `${gen.guid()}.json`;
        await service.write({
            bucket: { name: bucket2.name },
            path: 'generated',
            name: filename,
        },
        Readable.from('TEST-DATA'));
        const bucket = await service.getAll({ Bucket: bucket2.name });
        expect(bucket.Contents![0].Key).toEqual(`generated/${filename}`);
    });
})
