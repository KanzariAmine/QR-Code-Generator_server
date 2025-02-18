"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropboxAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let DropboxAuthService = class DropboxAuthService {
    constructor(configService) {
        this.configService = configService;
        this.clientId = this.configService.get('DROPBOX_CLIENT_ID');
        this.clientSecret = this.configService.get('DROPBOX_CLIENT_SECRET');
        this.redirectUri = this.configService.get('DROPBOX_REDIRECT_URI');
    }
    getAuthUrl() {
        return `${this.configService.get('DROPBOX_AUTH_URL')}?client_id=${this.clientId}&token_access_type=offline&response_type=code`;
    }
    async getAccessToken(code) {
        const data = {
            code,
            grant_type: 'authorization_code',
            client_id: this.clientId,
            client_secret: this.clientSecret,
        };
        try {
            const response = await axios_1.default.post(this.configService.get('DROPBOX_TOKEN_URL'), data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            console.log('✅ Access token response:', response.data);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('❌ Axios Error:', error.message);
                if (error.response) {
                    const status = error.response.status;
                    const errorMessage = status === 400
                        ? 'Invalid request: Check client_id, secret, and redirect_uri.'
                        : status === 401
                            ? 'Unauthorized: Invalid credentials.'
                            : status === 403
                                ? 'Forbidden: Access denied.'
                                : status === 500
                                    ? 'Server error: Dropbox API might be down.'
                                    : `Error: ${status} - ${JSON.stringify(error.response.data)}`;
                    throw new common_1.HttpException({
                        success: false,
                        statusCode: status,
                        data: error.response.data || null,
                    }, status);
                }
                else if (error.request) {
                    throw new common_1.HttpException({
                        success: false,
                        message: 'No response from Dropbox API. Please check your network.',
                    }, common_1.HttpStatus.SERVICE_UNAVAILABLE);
                }
            }
            throw new common_1.HttpException({
                success: false,
                message: 'An unknown error occurred.',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DropboxAuthService = DropboxAuthService;
exports.DropboxAuthService = DropboxAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DropboxAuthService);
//# sourceMappingURL=dropbox-auth.service.js.map