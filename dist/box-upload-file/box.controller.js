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
exports.BoxController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const box_service_1 = require("./box.service");
let BoxController = class BoxController {
    constructor(boxService) {
        this.boxService = boxService;
    }
    async getUserInfo(res) {
        const user = await this.boxService.getCurrentUser();
        res.status(200).json(user);
    }
    uploadFile(folderId, file) {
        return this.boxService.uploadFile(folderId, file);
    }
};
exports.BoxController = BoxController;
__decorate([
    (0, common_1.Get)('get-user'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BoxController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Post)('upload/:folderId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoxController.prototype, "uploadFile", null);
exports.BoxController = BoxController = __decorate([
    (0, common_1.Controller)('box'),
    __metadata("design:paramtypes", [box_service_1.BoxService])
], BoxController);
//# sourceMappingURL=box.controller.js.map