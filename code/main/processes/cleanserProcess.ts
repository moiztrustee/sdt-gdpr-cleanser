import { CleanserService } from "../services/cleanserService";
import { CleanserRepository } from "@business/repository/CleanserRepository";
import { Process } from "@business/model/process";

export class CleanserProcess {
    constructor(
        readonly cleanserService: CleanserService,
        readonly repository: CleanserRepository) {
    }

    async cleanser(process: Process): Promise<void>  {
        for await (let file of this.repository.findFilesByProcess(process.ident)) {
            console.log('moving file');
            await this.cleanserService.moveFileToArchive("ts-sdt-gdpr-archived", file.bucketName, file.data)
            //delete the file
        }
    }
}