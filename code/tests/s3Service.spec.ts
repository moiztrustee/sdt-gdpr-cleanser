import * as s3 from '@aws-sdk/client-s3'
import { Chance } from 'chance'
import { Readable } from 'stream'
import { S3Service } from '@business/services/s3Service'
import streamStringifier from './utils'

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
      name: `${ gen.guid() }.json`,
    },
    Readable.from('TEST-DATA'));

    await expect(service.read(exported).then((file) => streamStringifier(file.stream))).resolves.toBe('TEST-DATA')
  })


  it('Should get all files of bucket', async () => {
    const service = new S3Service(client);
    const filename = `${ gen.guid() }.json`;
    await service.write({
      bucket: { name: bucket2.name },
      path: 'generated',
      name: filename,
    },
    Readable.from('TEST-DATA'));
    const bucket = await service.getAll({ Bucket: bucket2.name });
    expect(bucket.Contents![0].Key).toEqual(`generated/${ filename }`);
  });


  it('Should copy file from one bucket to another', async () => {
    const service = new S3Service(client);
    const filename = `${ gen.guid() }.json`;
    const path = 'upload/test';
    const filePath = `${ bucket1.name }/${ path }/${ filename }`;

    await service.write({
      bucket: { name: bucket1.name },
      path,
      name: filename,
    },
    Readable.from('TEST-DATA'));

    await service.copy(bucket2.name, filePath, filePath);
    const exist = await service.checkIfFileExist(bucket2.name, filePath);
    expect(exist).toBeTruthy();
  });

  it('Should check if file exist in bucket', async () => {
    const service = new S3Service(client);
    const path = 'generated';
    const filename = `${ gen.guid() }.json`;
    await service.write({
      bucket: { name: bucket2.name },
      path,
      name: filename,
    },
    Readable.from('TEST-DATA'));

    const exist = await service.checkIfFileExist(bucket2.name, `${ path }/${ filename }`);
    expect(exist).toBeTruthy();
  });

  it('Should delete the file from bucket', async () => {
    const service = new S3Service(client);
    const path = 'generated';
    const filename = 'DELETE_ME.txt';
    await service.write({
      bucket: { name: bucket2.name },
      path,
      name: filename,
    },
    Readable.from('TEST-DATA'));


    await service.delete(bucket2.name, `${ path }/${ filename }`);
    const exist = await service.checkIfFileExist(bucket2.name, `${ path }/${ filename }`);
    expect(exist).toBeFalsy();
  });
})
