export declare class FileUploadService {
    private readonly baseDir;
    getAllFiles(): string[] | object;
    deleteFile(fileName: string): object;
    private deleteQRCode;
    handleFileUpload(file: Express.Multer.File): Promise<{
        message: string;
        filePath: string;
        qrCodeUrl: string;
    }>;
    private generateQRCodeWithLogo;
}
