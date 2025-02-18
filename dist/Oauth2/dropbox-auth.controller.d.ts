import { DropboxAuthService } from './dropbox-auth.service';
export declare class DropboxAuthController {
    private readonly dropboxAuthService;
    constructor(dropboxAuthService: DropboxAuthService);
    login(): Promise<{
        url: string;
    }>;
    callback(code: string): Promise<{
        message: string;
        tokenData: string;
    }>;
}
