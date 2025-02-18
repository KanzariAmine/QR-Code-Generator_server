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
exports.DropboxAuthController = void 0;
const common_1 = require("@nestjs/common");
const dropbox_auth_service_1 = require("./dropbox-auth.service");
let DropboxAuthController = class DropboxAuthController {
    constructor(dropboxAuthService) {
        this.dropboxAuthService = dropboxAuthService;
    }
    async login() {
        return {
            url: this.dropboxAuthService.getAuthUrl(),
        };
    }
    async callback(code) {
        if (!code)
            throw new Error('Authorization code is missing');
        const tokenData = await this.dropboxAuthService.getAccessToken(code);
        return { message: 'Authentication successful', tokenData };
    }
};
exports.DropboxAuthController = DropboxAuthController;
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DropboxAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DropboxAuthController.prototype, "callback", null);
exports.DropboxAuthController = DropboxAuthController = __decorate([
    (0, common_1.Controller)('dropbox-auth'),
    __metadata("design:paramtypes", [dropbox_auth_service_1.DropboxAuthService])
], DropboxAuthController);
//# sourceMappingURL=dropbox-auth.controller.js.map