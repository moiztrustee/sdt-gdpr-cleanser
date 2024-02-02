import {
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandInput,
    QueryCommand,
    QueryCommandInput,
  } from '@aws-sdk/client-dynamodb'
import { Bucket, File } from '@business/services/cleanserService';
import * as luxon from 'luxon';

export interface CleanserRepository {
    save(file: File): Promise<File>;
}

export class DynamoDbCleanserRepo implements CleanserRepository {
    constructor(readonly dynamoDB: DynamoDBClient, readonly table: string) {
        
    }

    async findBucketContent(file: File, batch = 100) : Promise<Bucket | undefined>{

        const input = {
            TableName: this.table,
            KeyConditionExpression: '#bucket = :bucket AND #filePath = :filePath',
            ExpressionAttributeNames: {
                '#bucket': 'Bucket',
                '#filePath': 'FilePath',
            },            
            ExpressionAttributeValues: {
                ':bucket': { S: `BUCKET#${file.bucketName}` },
                ':filePath': { S: `BUCKET#${file.data.Key}` },
            },
        } as QueryCommandInput

        return this.dynamoDB.send(new QueryCommand(input)).then(response => {
            if (response.Items && response.Items.length > 0) {                    
                return JSON.parse(response.Items[0].payload.S!);
            }
            return undefined;
        })
    }    

    async save(file: File): Promise<File> {
        const submittedAt = luxon.DateTime.now().toFormat('yyyyMMddHHmm', {locale: 'UTC'});

        const input = {
            TableName: this.table,
            Item: {
                Bucket: { S: `BUCKET#${file.bucketName}` },
                FilePath: { S: `BUCKET#${file.data.Key}` },
                SUBMITTED_AT: {N: `${submittedAt}`},
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