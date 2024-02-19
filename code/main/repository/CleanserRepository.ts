import {
    AttributeValue,
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandInput,
    QueryCommand,
    QueryCommandInput,
    QueryInput,
  } from '@aws-sdk/client-dynamodb'
import { File } from '@business/services/cleanserService';
import * as luxon from 'luxon';

export interface CleanserRepository {
    save(file: File, ident: string): Promise<File>;
    findFilesByProcess(processId: string, batch?: number): AsyncGenerator<File>
}

export class DynamoDbCleanserRepo implements CleanserRepository {
    constructor(readonly dynamoDB: DynamoDBClient, readonly table: string) {
        
    }

    async* generator(input: QueryInput): AsyncGenerator<File>{
        let key: { [key: string]: AttributeValue } | undefined;
    
        do {
          const {Items, LastEvaluatedKey} = await this.dynamoDB.send(new QueryCommand({
            ...input,
            ExclusiveStartKey: key,
          }));

          for(const item of Items || []) {
            yield JSON.parse(item['payload']?.S!) as File;
          }
    
          key = LastEvaluatedKey;
        } while (!!key)
      }    

    findFilesByProcess(processId: string, batch = 100): AsyncGenerator<File>{

        return this.generator({
            TableName: this.table,
            IndexName: 'GSI_PROCESSID',
            KeyConditionExpression: '#PROCESS_ID = :processId',
            ExpressionAttributeNames: {
                '#PROCESS_ID': 'PROCESS_ID',
            },
            ExpressionAttributeValues: {
                ':processId': { S: processId },
            },
        } as QueryCommandInput);
    }    

    async save(file: File, ident: string): Promise<File> {
        const submittedAt = luxon.DateTime.now().toFormat('yyyyMMddHHmm', {locale: 'UTC'});

        const input = {
            TableName: this.table,
            Item: {
                Bucket: { S: `BUCKET#${file.bucketName}` },
                FilePath: { S: `BUCKET#${file.data.Key}` },
                SUBMITTED_AT: {N: `${submittedAt}`},
                PROCESS_ID: {S: `${ident}`},
                payload: {
                    S: JSON.stringify(file),
                },
            },
        } as PutItemCommandInput;

        return this.dynamoDB.send(new PutItemCommand(input)).then(
            (output) => file,
            (error) => {
              console.log('err', error);
              throw error;
            }
        );
    }
}