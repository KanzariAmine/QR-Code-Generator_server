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
exports.BoxService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const box_node_sdk_1 = __importDefault(require("box-node-sdk"));
let BoxService = class BoxService {
    constructor(configService) {
        this.configService = configService;
        this.sdk = new box_node_sdk_1.default({
            clientID: this.configService.get('BOX_CLIENT_ID'),
            clientSecret: this.configService.get('BOX_CLIENT_SECRET'),
            appAuth: {
                keyID: this.configService.get('BOX_PUBLIC_KEY_ID'),
                privateKey: this.configService
                    .get('BOX_PRIVATE_KEY')
                    .replace(/\\n/g, '\n'),
                passphrase: this.configService.get('BOX_PASSPHRASE'),
            },
        });
        this.client = this.sdk.getAppAuthClient('user', '238020673');
        console.log('✅ Box SDK initialized successfully.');
    }
    async getCurrentUser() {
        try {
            const user = await this.client.users.get(this.client.CURRENT_USER_ID);
            console.log('Hello', user.name, '!');
            return user;
        }
        catch (error) {
            console.error('❌ Got an error fetching user details:', error.message);
            throw error;
        }
    }
    async uploadFile(folderId, file) {
        console.log('🚀 ~ BoxService ~ uploadFile ~ folderId:', folderId);
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        try {
            console.log('Uploading file:', file.originalname);
            const fileUpload = await this.client.files.uploadFile(folderId, file.originalname, file.buffer);
            console.log('File uploaded successfully:', fileUpload.entries[0]);
            return {
                fileId: fileUpload.entries[0].id,
                fileName: fileUpload.entries[0].name,
            };
        }
        catch (error) {
            console.error('❌ Box API Error fetching user details:', error.message);
            throw new Error(`Box API Error: ${error.message}`);
        }
    }
};
exports.BoxService = BoxService;
exports.BoxService = BoxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BoxService);
//# sourceMappingURL=box.service.js.map