import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DropboxModule } from './dropBox/dropbox.module';
import { DropboxAuthModule } from './Oauth2/dropbox-auth.module';

@Module({
  imports: [
    DropboxAuthModule,
    DropboxModule,
    // FileUploadModule,
    // BoxUploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
