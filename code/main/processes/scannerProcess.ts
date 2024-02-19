import { Process } from "@business/model/process";
import { CleanserRepository } from "@business/repository/CleanserRepository";
import { CleanserService } from "@business/services/cleanserService";

export class ScannerProcess {
    constructor(readonly cleanserService: CleanserService, readonly repository: CleanserRepository) {}

    async scan(process: Process) {
        for await (const bucket of this.cleanserService.lookup(process.lookup)) {
            const filteredBucket = this.cleanserService.filter(bucket, process.ignoreList, process.numOfDays);
            for (const file of filteredBucket.files!) {
                console.log('Saving In Repo');
                await this.repository.save({
                    bucketName: bucket.name,
                    data: file,
                }, process.ident);
            }
        }
        return process;
    }
}