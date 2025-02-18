import { ConfigService } from '@nestjs/config';
export declare class BoxService {
    private readonly configService;
    private sdk;
    private client;
    constructor(configService: ConfigService);
    getCurrentUser(): Promise<any>;
    uploadFile(folderId: string, file: Express.Multer.File): Promise<{
        fileId: any;
        fileName: any;
    }>;
}
