import { ConfigService } from '@nestjs/config';
export declare class DropboxAuthService {
    private configService;
    private clientId;
    private clientSecret;
    private redirectUri;
    constructor(configService: ConfigService);
    getAuthUrl(): string;
    getAccessToken(code: string): Promise<string>;
}
