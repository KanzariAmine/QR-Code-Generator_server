"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const multer_1 = require("multer");
const auth_module_1 = require("../auth/auth.module");
const file_upload_controller_1 = require("./file-upload.controller");
const file_upload_service_1 = require("./file-upload.service");
let FileUploadModule = class FileUploadModule {
};
exports.FileUploadModule = FileUploadModule;
exports.FileUploadModule = FileUploadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, cb) => {
                        const uploadPath = './uploads';
                        if (!(0, fs_1.existsSync)(uploadPath)) {
                            (0, fs_1.mkdirSync)(uploadPath, { recursive: true });
                        }
                        cb(null, uploadPath);
                    },
                    filename: (req, file, cb) => {
                        const fileName = `${Date.now()}-${file.originalname}`;
                        cb(null, fileName);
                    },
                }),
            }),
        ],
        controllers: [file_upload_controller_1.FileUploadController],
        providers: [file_upload_service_1.FileUploadService],
    })
], FileUploadModule);
//# sourceMappingURL=file-upload.module.js.map