import { Process } from "@business/model/process";
import { CleanserRepository } from "@business/repository/CleanserRepository";
import { CleanserService } from "@business/services/cleanserService";
import * as log from 'lambda-log';

export class ScannerProcess {
    constructor(readonly cleanserService: CleanserService, readonly repository: CleanserRepository) {}

    async scan(process: Process): Promise<Process> {
        let counter: number = 0;
        for await (const bucket of this.cleanserService.lookup(process.lookup)) {
            const filteredBucket = this.cleanserService.filter(bucket, process.ignoreList, process.numOfDays);
            for (const file of filteredBucket.files!) {
                counter++;
                await this.repository.save({
                    bucketName: bucket.name,
                    data: file,
                }, process.ident);
            }
        }
        log.info(`Total ${counter} files for deletion`);
        return process;
    }
}