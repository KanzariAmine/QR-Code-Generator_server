import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class DropboxService {
    private readonly httpService;
    private readonly configService;
    private readonly dropboxApiUrl;
    private readonly accessToken;
    constructor(httpService: HttpService, configService: ConfigService);
    getUserInfo(): Promise<any>;
    uploadFile(file: Express.Multer.File, path: string, authHeader: string): Promise<any>;
    getSharedLink(filePath: string, authHeader: string): Promise<any>;
    generateQRCodeWithLogo(data: string): Promise<String>;
    getFilesInFolder(path: string, authHeader: any): Promise<any>;
    deleteFile(filePath: string, authHeader: any): Promise<any>;
}
