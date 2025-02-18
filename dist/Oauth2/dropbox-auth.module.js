"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropboxAuthModule = void 0;
const common_1 = require("@nestjs/common");
const dropbox_auth_controller_1 = require("./dropbox-auth.controller");
const dropbox_auth_service_1 = require("./dropbox-auth.service");
let DropboxAuthModule = class DropboxAuthModule {
};
exports.DropboxAuthModule = DropboxAuthModule;
exports.DropboxAuthModule = DropboxAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [dropbox_auth_controller_1.DropboxAuthController],
        providers: [dropbox_auth_service_1.DropboxAuthService],
    })
], DropboxAuthModule);
//# sourceMappingURL=dropbox-auth.module.js.map