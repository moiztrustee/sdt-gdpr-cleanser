import { CleanserService } from "../services/cleanserService";
import { CleanserRepository } from "@business/repository/CleanserRepository";
import { Process } from "@business/model/process";
import * as log from 'lambda-log';

export class CleanserProcess {
    constructor(
        readonly cleanserService: CleanserService,
        readonly repository: CleanserRepository,
        readonly archiveBucket: string
    ) {
    }

    async cleanser(process: Process): Promise<Process>  {
        let deleted: number = 0;
        let failed: number = 0;
        for await (let file of this.repository.findFilesByProcess(process.ident)) {
            const fileMoved: boolean = await this.cleanserService.moveFileToArchive(this.archiveBucket, file.bucketName, file.data)
            if (fileMoved) {
                if (process.run && process.run === 'live') {
                    const fileDeleted = await this.cleanserService.deleteFile(file.bucketName, file.data.Key!);
                    if (fileDeleted) {
                        deleted++;
                    } else {
                        failed++;
                        log.error(`Error in deleting file from Bucket: ${file.bucketName} File: ${file.data.Key}`);
                    }
                }
            } else {
                failed++;
                log.error('Error in moving file to Archive Bucket');
            }
        }
        return {
            ...process,
            deleted: deleted,
            failed: failed
        }
    }
}