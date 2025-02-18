import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DropboxController } from './dropbox.controller';
import { DropboxService } from './dropbox.service';

@Module({
  imports: [HttpModule],
  controllers: [DropboxController],
  providers: [DropboxService],
})
export class DropboxModule {}
