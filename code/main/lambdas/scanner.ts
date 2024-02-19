import { CleanserService } from '@business/services/cleanserService';
import {Context} from 'aws-lambda';
import * as s3 from '@aws-sdk/client-s3';
import { S3Service } from '@business/services/s3Service';
import { DynamoDbCleanserRepo } from '@business/repository/CleanserRepository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { readProcess, writeProcess } from '@business/integration';
import { Process, Scheduled } from '@business/model/process';
import { ScannerProcess } from '@business/processes/scannerProcess';

const s3Client = new s3.S3Client({
    region: 'eu-central-1',
    forcePathStyle: true,
});

const application = new ScannerProcess(
    new CleanserService(new S3Service(s3Client)),
    new DynamoDbCleanserRepo(new DynamoDBClient({
        region: 'eu-central-1',
    }), process.env.TABLE_NAME ?? 'missing-envvar-TABLE_NAME')
);
    
export const handler = async (event: any, context: Context): Promise<{ Payload: Process }> => {
    const process = IsScheduled(event)
        ? Scheduled()
        : readProcess(event);
        
    return await application.scan(process).then((result)=>({
        Payload: writeProcess(process),
    }));
}

const IsScheduled = (candidate: any): boolean => {
    return 'detail-type' in candidate
    && 'source' in candidate
    && candidate['detail-type'] === 'Scheduled Event'
    && candidate['source'] === 'aws.events';
}
