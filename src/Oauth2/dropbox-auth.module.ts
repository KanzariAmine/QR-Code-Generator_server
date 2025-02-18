import { Module } from '@nestjs/common';
import { DropboxAuthController } from './dropbox-auth.controller';
import { DropboxAuthService } from './dropbox-auth.service';

@Module({
  imports: [],
  controllers: [DropboxAuthController],
  providers: [DropboxAuthService],
})
export class DropboxAuthModule {}
