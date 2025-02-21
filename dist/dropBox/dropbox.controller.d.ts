import { Response } from 'express';
import { DropboxService } from './dropbox.service';
export declare class DropboxController {
    private readonly dropboxService;
    constructor(dropboxService: DropboxService);
    getUserInfo(request: Request): Promise<any>;
    uploadFile(file: Express.Multer.File, path: string, request: Request): Promise<any>;
    getTemporaryLink(path: string, request: Request): Promise<any>;
    generateQRCode(data: string, res: Response): Promise<void>;
    deleteFile(path: string, request: Request): Promise<any>;
    getAllFiles(path: string, request: Request): Promise<any>;
}
