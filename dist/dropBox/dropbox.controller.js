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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropboxController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const dropbox_service_1 = require("./dropbox.service");
let DropboxController = class DropboxController {
    constructor(dropboxService) {
        this.dropboxService = dropboxService;
    }
    async getUserInfo() {
        return this.dropboxService.getUserInfo();
    }
    async uploadFile(file, path, request) {
        const authHeader = request.headers['authorization'];
        return this.dropboxService.uploadFile(file, path, authHeader);
    }
    async getTemporaryLink(path, request) {
        const authHeader = request.headers['authorization'];
        return this.dropboxService.getSharedLink(path, authHeader);
    }
    async generateQRCode(data, res) {
        if (!data) {
            throw new common_1.BadRequestException('Data is required');
        }
        try {
            const qrCodeBuffer = await this.dropboxService.generateQRCodeWithLogo(data);
            res.setHeader('Content-Type', 'image/png');
            res.send(qrCodeBuffer);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to generate QR Code');
        }
    }
    async deleteFile(path, request) {
        const authHeader = request.headers['authorization'];
        return this.dropboxService.deleteFile(path, authHeader);
    }
    async getAllFiles(path, request) {
        const authHeader = request.headers['authorization'];
        return this.dropboxService.getFilesInFolder(path, authHeader);
    }
};
exports.DropboxController = DropboxController;
__decorate([
    (0, common_1.Get)('userinfo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DropboxController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('path')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Request]),
    __metadata("design:returntype", Promise)
], DropboxController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('shared-link'),
    __param(0, (0, common_1.Body)('path')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], DropboxController.prototype, "getTemporaryLink", null);
__decorate([
    (0, common_1.Get)('generate-qr-code'),
    __param(0, (0, common_1.Query)('data')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DropboxController.prototype, "generateQRCode", null);
__decorate([
    (0, common_1.Post)('delete-file'),
    __param(0, (0, common_1.Body)('path')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], DropboxController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Post)('all-file'),
    __param(0, (0, common_1.Body)('path')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], DropboxController.prototype, "getAllFiles", null);
exports.DropboxController = DropboxController = __decorate([
    (0, common_1.Controller)('dropbox'),
    __metadata("design:paramtypes", [dropbox_service_1.DropboxService])
], DropboxController);
//# sourceMappingURL=dropbox.controller.js.map