import { CleanserService } from "../services/cleanserService";
import { CleanserRepository } from "@business/repository/CleanserRepository";
import { Process } from "@business/model/process";

export class CleanserProcess {
    constructor(
        readonly cleanserService: CleanserService,
        readonly repository: CleanserRepository) {
    }

    async cleanser(process: Process): Promise<void>  {
        console.log('process.ignoreList', process.ignoreList);
        for await (const bucket of this.cleanserService.lookup(process.lookup)) {
            const filteredBucket = this.cleanserService.filter(bucket, process.ignoreList, process.numOfDays);
            for (const file of filteredBucket.files!) {
                await this.repository.save({
                    bucketName: bucket.name,
                    data: file
                });
            }
        }
    }
}