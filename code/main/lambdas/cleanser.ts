import { CleanserProcess } from '@business/processes/cleanserProcess';
import { CleanserService } from '@business/services/cleanserService';
import {Context} from 'aws-lambda';
import * as s3 from '@aws-sdk/client-s3';
import { S3Service } from '@business/services/s3Service';
import { DynamoDbCleanserRepo } from '@business/repository/CleanserRepository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { readProcess, writeProcess } from '@business/integration';
import { Process } from '@business/model/process';

const s3Client = new s3.S3Client({
    region: 'eu-central-1',
    forcePathStyle: true,
  });

const application = new CleanserProcess(
    new CleanserService(
        new S3Service(s3Client)
    ),
    new DynamoDbCleanserRepo(new DynamoDBClient({
        region: 'eu-central-1',
      }),
      process.env.TABLE_NAME ?? 'missing-envvar-TABLE_NAME')
);

export const handler = async (event: any, context: Context): Promise<{payload: Process}> => {
    const input = readProcess(event);
    // await application.cleanser(input);
    return await application.cleanser(input).then((result)=>({
        payload: writeProcess(input),
    }));
    // return writeProcess(input);
}
