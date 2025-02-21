import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DropboxService } from './dropbox.service';

@Controller('dropbox')
export class DropboxController {
  constructor(private readonly dropboxService: DropboxService) {}

  @Get('userinfo')
  async getUserInfo(@Req() request: Request) {
    const authHeader = request.headers['authorization'];
    return this.dropboxService.getUserInfo(authHeader);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('path') path: string,
    @Req() request: Request,
  ) {
    const authHeader = request.headers['authorization'];
    return this.dropboxService.uploadFile(file, path, authHeader);
  }

  @Post('shared-link')
  async getTemporaryLink(@Body('path') path: string, @Req() request: Request) {
    const authHeader = request.headers['authorization'];
    return this.dropboxService.getSharedLink(path, authHeader);
  }

  @Get('generate-qr-code')
  async generateQRCode(@Query('data') data: string, @Res() res: Response) {
    if (!data) {
      throw new BadRequestException('Data is required');
    }

    try {
      // Generate the QR code with logo
      const qrCodeBuffer =
        await this.dropboxService.generateQRCodeWithLogo(data);

      // Set response headers for image
      res.setHeader('Content-Type', 'image/png');
      res.send(qrCodeBuffer);
    } catch (error) {
      throw new BadRequestException('Failed to generate QR Code');
    }
  }

  @Post('delete-file')
  async deleteFile(@Body('path') path: string, @Req() request: Request) {
    const authHeader = request.headers['authorization'];

    return this.dropboxService.deleteFile(path, authHeader);
  }

  @Post('all-file')
  async getAllFiles(@Body('path') path: string, @Req() request: Request) {
    const authHeader = request.headers['authorization'];

    return this.dropboxService.getFilesInFolder(path, authHeader);
  }
}
