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
var FileUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const canvas_1 = require("canvas");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const QRCode = __importStar(require("qrcode"));
let FileUploadService = FileUploadService_1 = class FileUploadService {
    constructor() {
        this.baseDir = path.join('/tmp', 'uploads');
        this.logger = new common_1.Logger(FileUploadService_1.name);
        this.ensureDirectoryExists();
    }
    ensureDirectoryExists() {
        if (!fs.existsSync(this.baseDir)) {
            this.logger.warn(`Directory does not exist. Creating directory: ${this.baseDir}`);
            fs.mkdirSync(this.baseDir, { recursive: true });
            this.logger.log(`Directory created: ${this.baseDir}`);
        }
        else {
            this.logger.log(`Directory already exists: ${this.baseDir}`);
        }
    }
    getHello() {
        return 'Hello From upload file!';
    }
    getAllFiles() {
        try {
            this.logger.log('Attempting to read files from the directory...');
            const files = fs.readdirSync(this.baseDir);
            if (files.length === 0) {
                this.logger.warn('No files found in the directory.');
                return {
                    status: 200,
                    message: 'No File to upload',
                };
            }
            this.logger.log(`Successfully retrieved ${files.length} file(s) from the directory.`);
            return files;
        }
        catch (error) {
            this.logger.error(`Error occurred while reading files from directory: ${this.baseDir}`, error.stack);
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
            const serverUrl = 'https://qr-code-generator-server.vercel.app/';
            const fileUrl = `${serverUrl}/uploads/${file.filename}`;
            const qrCodeFilename = `${file.filename}-qrcode.png`;
            const qrCodePath = path.join('/tmp', 'uploads', qrCodeFilename);
            await this.generateQRCodeWithLogo(fileUrl, qrCodePath);
            const qrCodeUrl = `${serverUrl}/uploads/${qrCodeFilename}`;
            return {
                message: 'File uploaded and QR Code generated successfully',
                filePath: file.path,
                qrCodeUrl,
            };
        }
        catch (error) {
            this.logger.error('Failed to process the file or generate QR code', error.stack);
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
exports.FileUploadService = FileUploadService = FileUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map