import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(userInfo: any): Promise<{
        access_token: string;
    }>;
}
