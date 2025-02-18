import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { DropboxAuthService } from './dropbox-auth.service';

@Controller('dropbox-auth')
export class DropboxAuthController {
  constructor(private readonly dropboxAuthService: DropboxAuthService) {}

  @Get('login')
  @Redirect()
  async login() {
    return {
      url: this.dropboxAuthService.getAuthUrl(),
    };
  }

  @Get('callback')
  async callback(@Query('code') code: string) {
    if (!code) throw new Error('Authorization code is missing');
    const tokenData = await this.dropboxAuthService.getAccessToken(code);

    return { message: 'Authentication successful', tokenData };
  }
}
