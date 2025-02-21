"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropboxService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const promises_1 = __importDefault(require("fs/promises"));
const path = __importStar(require("path"));
const QRCode = __importStar(require("qrcode"));
const sharp_1 = __importDefault(require("sharp"));
let DropboxService = class DropboxService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.dropboxApiUrl = 'https://api.dropboxapi.com/2';
        this.accessToken = this.configService.get('DROPBOX_ACCESS_TOKEN');
    }
    async getUserInfo() {
        const url = `${this.dropboxApiUrl}/users/get_current_account`;
        const headers = {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
        };
        try {
            const response = await this.httpService
                .post(url, null, { headers })
                .toPromise();
            return response?.data;
        }
        catch (error) {
            throw new Error(`Dropbox API error: ${error.message}`);
        }
    }
    async uploadFile(file, path, authHeader) {
        const url = `https://content.dropboxapi.com/2/files/upload`;
        const headers = {
            Authorization: authHeader,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify({
                path: `${path}/${file.originalname}`,
                mode: 'add',
                autorename: true,
                mute: false,
            }),
        };
        try {
            const response = await this.httpService
                .post(url, file.buffer, { headers })
                .toPromise();
            return response?.data;
        }
        catch (error) {
            throw new Error(`Dropbox API error: ${error.response?.data || error.message}`);
        }
    }
    async getSharedLink(filePath, authHeader) {
        const url = `${this.dropboxApiUrl}/sharing/create_shared_link_with_settings`;
        const headers = {
            Authorization: authHeader,
            'Content-Type': 'application/json',
        };
        try {
            const listUrl = `${this.dropboxApiUrl}/sharing/list_shared_links`;
            const listResponse = await this.httpService
                .post(listUrl, { path: filePath }, { headers })
                .toPromise();
            const existingLink = listResponse?.data?.links?.[0]?.url;
            if (existingLink) {
                console.log('✅ Shared link already exists:', existingLink);
                return existingLink;
            }
            const body = {
                path: filePath,
                settings: {
                    requested_visibility: 'public',
                    allow_download: true,
                },
            };
            const response = await this.httpService
                .post(url, body, { headers })
                .toPromise();
            return response?.data?.url;
        }
        catch (error) {
            throw new Error(`Dropbox API error: ${error}`);
        }
    }
    async generateQRCodeWithLogo(data) {
        const logoPath = path.join(__dirname, '../../assets/kanpower_logo.jpg');
        try {
            const qrBuffer = await QRCode.toBuffer(data, {
                errorCorrectionLevel: 'H',
                margin: 2,
                width: 500,
            });
            const logoBuffer = await promises_1.default.readFile(logoPath);
            const qrMetadata = await (0, sharp_1.default)(qrBuffer).metadata();
            const logoSize = Math.floor(qrMetadata.width * 0.2);
            console.log('🚀 ~ DropboxService ~ generateQRCodeWithLogo ~ logoSize:', logoSize);
            const resizedLogo = await (0, sharp_1.default)(logoBuffer)
                .resize(logoSize, logoSize)
                .toBuffer();
            const qrWithLogo = await (0, sharp_1.default)(qrBuffer)
                .composite([
                {
                    input: resizedLogo,
                    top: Math.floor((qrMetadata.height - logoSize) / 2),
                    left: Math.floor((qrMetadata.width - logoSize) / 2),
                },
            ])
                .png()
                .toBuffer();
            const base64Image = `data:image/png;base64,${qrWithLogo.toString('base64')}`;
            return base64Image;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to generate QR Code with logo');
        }
    }
    async getFilesInFolder(path, authHeader) {
        const url = `${this.dropboxApiUrl}/files/list_folder`;
        const headers = {
            Authorization: authHeader,
            'Content-Type': 'application/json',
        };
        const body = {
            path: path,
            recursive: false,
        };
        try {
            const response = await this.httpService
                .post(url, body, { headers })
                .toPromise();
            return response?.data.entries;
        }
        catch (error) {
            console.error('🚨 Dropbox API Error:', error.response?.data || error.message);
            throw new Error(`Dropbox API error: ${error.response?.data?.error_summary || error.message}`);
        }
    }
    async deleteFile(filePath, authHeader) {
        const url = `${this.dropboxApiUrl}/files/delete_v2`;
        const headers = {
            Authorization: authHeader,
            'Content-Type': 'application/json',
        };
        const body = {
            path: filePath,
        };
        try {
            const response = await this.httpService
                .post(url, body, { headers })
                .toPromise();
            return response?.data;
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.DropboxService = DropboxService;
exports.DropboxService = DropboxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], DropboxService);
//# sourceMappingURL=dropbox.service.js.map