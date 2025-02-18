import { BoxService } from './box.service';
export declare class BoxController {
    private readonly boxService;
    constructor(boxService: BoxService);
    getUserInfo(res: any): Promise<void>;
    uploadFile(folderId: string, file: Express.Multer.File): Promise<{
        fileId: any;
        fileName: any;
    }>;
}
