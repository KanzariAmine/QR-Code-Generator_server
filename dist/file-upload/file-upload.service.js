"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const QRCode = require("qrcode");
let FileUploadService = class FileUploadService {
    handleFileUpload(file) {
        if (!file) {
            throw new common_1.BadRequestException('No File Uploaded');
        }
        const allowedMimeTypes = ['application/pdf'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid File Type');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('file is too large!');
        }
        const serverUrl = 'http://192.168.1.3:3000';
        const fileUrl = `${serverUrl}/uploads/${file.filename}`;
        const qrCodeFilename = `${file.filename}-qrcode.png`;
        const qrCodePath = path.join(__dirname, '../../uploads', qrCodeFilename);
        return new Promise((resolve, reject) => {
            QRCode.toFile(qrCodePath, fileUrl, { width: 300 }, (err) => {
                if (err) {
                    reject(new common_1.BadRequestException('Failed to generate QR Code'));
                }
                else {
                    const qrCodeUrl = `${serverUrl}/uploads/${qrCodeFilename}`;
                    resolve({
                        message: 'File uploaded and QR Code generated successfully',
                        filePath: file.path,
                        qrCodeUrl,
                    });
                }
            });
        });
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)()
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map