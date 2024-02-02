import { Bucket, CleanserService, Lookup } from '@business/services/cleanserService';
import { S3Service } from '@business/services/s3Service';
import * as luxon from 'luxon';
import { deepEqual, mock, when, instance, anything } from 'ts-mockito';

describe('CleanserService', () => {
    const day182 = luxon.DateTime.now().minus({day: 182}).toJSDate();
    const day10 = luxon.DateTime.now().minus({day: 10 }).toJSDate();
    const day90 = luxon.DateTime.now().minus({day: 90}).toJSDate();
    const day200 = luxon.DateTime.now().minus({day: 200}).toJSDate();

    const lookups = [{ bucket: 'mockedBucket', folder: 'mockedFolder' }];
    const s3service = mock<S3Service>();
    when(s3service.getAll(anything())).thenResolve({
        Contents: [
            { Key: 'mockedFolder/file1.txt' },
            { Key: 'mockedFolder/file2.txt' },
            { Key: 'mockedFolder/process.json' },
        ],
        $metadata: {}
    });

    const cleanserService = new CleanserService(instance(s3service));


    it('list all buckets', async () => {
        
        const result = [];
        for await (const bucket of cleanserService.lookup(lookups)) {
            result.push(bucket);
        }

        expect(result).toEqual([{
              name: 'mockedBucket',
              files: [
                { Key: 'mockedFolder/file1.txt' },
                { Key: 'mockedFolder/file2.txt' },
                { Key: 'mockedFolder/process.json' },
              ],
            },
        ]);
    });

    it('should filter buckets object older then 180 days', () => {

        const ignoreList = [
            "process.json"
        ];

        const bucket1: Bucket = {
            name: 'mockedBucket1',
            files: [
                {
                    Key: "mockedFolder/file1.txt",
                    LastModified: day182
                },
                {
                    Key: "mockedFolder/file2.txt",
                    LastModified: day10
                },
                {
                    Key: "mockedFolder/file3.txt",
                    LastModified: day90
                },                
                {
                    Key: "mockedFolder/process.json",
                    LastModified: day200
                }                
            ]
        };

        const filtered = cleanserService.filter(bucket1, ignoreList, 180);
        expect(filtered).toMatchObject({
            name: 'mockedBucket1',
            files: [bucket1.files![0]]
        })
    }); 
});