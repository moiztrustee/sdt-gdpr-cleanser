import { CleanserService } from "../services/cleanserService";
import { CleanserRepository } from "@business/repository/CleanserRepository";
import { Process } from "@business/model/process";

export class CleanserProcess {
    constructor(
        readonly cleanserService: CleanserService,
        readonly repository: CleanserRepository,
        readonly archiveBucket: string
    ) {
    }

    async cleanser(process: Process): Promise<void>  {
        for await (let file of this.repository.findFilesByProcess(process.ident)) {
            //TODO remove hardcoded bucket name
            await this.cleanserService.moveFileToArchive(this.archiveBucket, file.bucketName, file.data)
            if (process.run && process.run === 'live') {
                await this.cleanserService.deleteFile(file.bucketName, file.data.Key!);
            }
        }
    }
}