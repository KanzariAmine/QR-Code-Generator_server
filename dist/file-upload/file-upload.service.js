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
const canvas_1 = require("canvas");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
let FileUploadService = class FileUploadService {
    constructor() {
        this.baseDir = path.join(__dirname, '../../uploads');
    }
    getAllFiles() {
        try {
            const files = fs.readdirSync(this.baseDir);
            return files;
        }
        catch (error) {
            throw new Error(`Error reading files: ${error.message}`);
        }
    }
    deleteFile(fileName) {
        const filePath = path.join(this.baseDir, fileName);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException(`File ${fileName} not found`);
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err?.message}`);
                throw new Error(`Could not delete file: ${err?.message}`);
            }
            this.deleteQRCode(fileName);
        });
        return {
            status: 200,
            message: `File ${fileName} deleted successfully`,
        };
    }
    deleteQRCode(filename) {
        const QRCodeName = `${filename}-qrcode.png`;
        const QRCodePath = path.join(this.baseDir, QRCodeName);
        if (!fs.existsSync(QRCodePath)) {
            throw new common_1.NotFoundException(`File ${QRCodeName} not found`);
        }
        fs.unlink(QRCodePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err?.message}`);
                throw new Error(`Could not delete file: ${err?.message}`);
            }
        });
    }
    async handleFileUpload(file) {
        if (!file) {
            throw new common_1.BadRequestException('No File Uploaded');
        }
        const allowedMimeTypes = ['application/pdf'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid File Type');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('File is too Large!');
        }
        try {
            const serverUrl = 'https://dashboard.kanpower.tn/';
            const fileUrl = `${serverUrl}/uploads/${file.filename}`;
            const qrCodeFilename = `${file.filename}-qrcode.png`;
            const qrCodePath = path.join(__dirname, '../../uploads', qrCodeFilename);
            await this.generateQRCodeWithLogo(fileUrl, qrCodePath);
            const qrCodeUrl = `${serverUrl}/uploads/${qrCodeFilename}`;
            return {
                message: 'File uploaded and QR Code generated successfully',
                filePath: file.path,
                qrCodeUrl,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to process the file or generate QR code');
        }
    }
    generateQRCodeWithLogo(data, outputPath) {
        const logopath = path.join(__dirname, '../../assets/kanpower_logo.jpg');
        return new Promise((resolve, reject) => {
            try {
                const canvas = (0, canvas_1.createCanvas)(500, 500);
                QRCode.toCanvas(canvas, data, { errorCorrectionLevel: 'H', margin: 2 })
                    .then(async () => {
                    const cxt = canvas.getContext('2d');
                    const logo = await (0, canvas_1.loadImage)(logopath);
                    const logoSize = canvas.width * 0.2;
                    const logoX = (canvas.width - logoSize) / 2;
                    const logoY = (canvas.height - logoSize) / 2;
                    cxt.drawImage(logo, logoX, logoY, logoSize, logoSize);
                    const buffer = canvas.toBuffer('image/png');
                    fs.writeFile(outputPath, buffer, (err) => {
                        if (err)
                            reject(new common_1.BadRequestException('Failed to save QR Code with logo'));
                        else
                            resolve();
                    });
                })
                    .catch(() => reject(new common_1.BadRequestException('Failed to generate QR Code')));
            }
            catch (error) {
                reject(new common_1.BadRequestException('Error during QR Code generation with logo!!! '));
            }
        });
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)()
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map