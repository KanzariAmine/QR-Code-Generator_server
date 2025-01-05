import { FileUploadService } from './file-upload.service';
export declare class FileUploadController {
    private readonly fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
        filePath: string;
        qrCodeUrl: string;
    }>;
    getFiles(): string[];
    removeFile(filename: string): object;
}