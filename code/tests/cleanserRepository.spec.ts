import * as dyndb from '@aws-sdk/client-dynamodb';
import { DynamoDbCleanserRepo } from '@business/repository/CleanserRepository';
import {KeyType, ProjectionType} from '@aws-sdk/client-dynamodb';
import { File } from '@business/services/cleanserService';
import {Chance} from 'chance';

describe('CleanserRepository', () => {
    const gen = new Chance();
    const client = new dyndb.DynamoDBClient({
      credentials: {
        accessKeyId: 'xxx',
        secretAccessKey: 'xxx',
      },
      region: 'eu-central-1',
      endpoint: 'http://localhost:4566',
    });

    const table = gen.string(
        {casing: 'lower', length: 20, symbols: false}
    ).replace(/[^a-z0-9]/g, '');

    beforeAll(async () => {
        const create = new dyndb.CreateTableCommand({
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            },
            TableName: table,
            KeySchema: [
              {KeyType: 'HASH', AttributeName: 'Bucket'},
              {KeyType: 'RANGE', AttributeName: 'FilePath'},
              
            ],
            AttributeDefinitions: [
              {AttributeName: 'Bucket', AttributeType: 'S'},
              {AttributeName: 'FilePath', AttributeType: 'S'},
              {AttributeName: 'PROCESS_ID', AttributeType: 'S'},
            ],
            GlobalSecondaryIndexes: [
              {
                ProvisionedThroughput: {
                  ReadCapacityUnits: 10,
                  WriteCapacityUnits: 1,
                },
                IndexName: 'GSI_PROCESSID',
                Projection: {
                  ProjectionType: ProjectionType.ALL,
                },
                KeySchema: [
                  {AttributeName: 'PROCESS_ID', KeyType: KeyType.HASH,}
                ]
              }
            ]            
        })
        await client.send(create).then((result) => console.log(result.TableDescription))
    })


    it('should save in dynamo and return content', async () => {

      const repository = new DynamoDbCleanserRepo(
        client, table
      );
  
      const content1 = {bucketName: 'bucket', data: {Key: '/generated/test'}} as File;
      const savedContent = await repository.save(content1, 'random1');
      expect(savedContent.data.Key).toEqual(content1.data.Key);
    })

    it('should return the same content which was saved', async() => {

        const repository = new DynamoDbCleanserRepo(
          client, table
        );
        const processId = 'random2';
        const files = [
          {bucketName: 'bucket1', data: {Key: '/generated/test1.csv'}},
          {bucketName: 'bucket2', data: {Key: '/generated/test2.csv'}}
        ];
        await repository.save(files[0], processId);
        await repository.save(files[1], processId);

        let index = 0;
        for await (let bucket of repository.findFilesByProcess(processId)) {
            // console.log('b', bucket.bucketName);
            // console.log('b', bucket.data);
            expect(bucket).toMatchObject(files[index++]);
        }
    });

})