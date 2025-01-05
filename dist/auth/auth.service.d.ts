import { JwtService } from '@nestjs/jwt';
export declare const jwtConstants: {
    secret: string;
};
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    signIn(email: string, pass: string): Promise<{
        access_token: string;
    }>;
}
