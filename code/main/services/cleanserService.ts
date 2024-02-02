import * as s3 from '@aws-sdk/client-s3';
import * as luxon from 'luxon';
import { S3Service } from './s3Service';

export interface Cleanser {
    lookup(lookup: Lookup[]): void;
}

export interface Lookup {
    bucket: string;
    folder: string
}

export interface Bucket {
    name: string;
    files: s3._Object[] | undefined
};

export interface File {
    bucketName: string;
    data: s3._Object
}


export class CleanserService implements Cleanser {
    
    constructor(readonly s3Service: S3Service) {
    }

    async* lookup(lookups: Lookup[]): AsyncGenerator<Bucket> {
        for (const lookup of lookups) {
            const output = await this.s3Service.getAll({ Bucket: lookup.bucket });
            yield { name: lookup.bucket, files: output.Contents };
        }
    }

    filter(bucket: Bucket, ignoreList: string[], numOfDays: number): Bucket {
        const currentDate = luxon.DateTime.now();
        const daysThreshold: number = numOfDays;
        const filteredFiles = (bucket.files ?? []).filter(object => {
            const splitFilePath = object.Key!.split('/');
            const fileName = splitFilePath[splitFilePath.length - 1];
            const lastModifiedDate = luxon.DateTime.fromJSDate(new Date(object.LastModified!));
            const differenceInDays: number = currentDate.diff(lastModifiedDate, 'days').toObject().days!;
            return differenceInDays >= daysThreshold && !ignoreList.includes(fileName);
        });
        return {
            name: bucket.name,  
            files: filteredFiles
        } as Bucket;
    }
}