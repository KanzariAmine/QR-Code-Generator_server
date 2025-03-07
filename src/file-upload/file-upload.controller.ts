import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileUploadService } from './file-upload.service';
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get()
  getHello(): string {
    return this.fileUploadService.getHello();
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.handleFileUpload(file);
  }

  @Get('allFiles')
  @UseGuards(AuthGuard)
  getFiles(): string[] | object {
    return this.fileUploadService.getAllFiles();
  }

  @Delete('delete_file') // Route definition
  @UseGuards(AuthGuard)
  removeFile(@Query('filename') filename: string) {
    return this.fileUploadService.deleteFile(filename);
  }
}
