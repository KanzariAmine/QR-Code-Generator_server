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

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.handleFileUpload(file);
  }

  @Get('allFiles')
  getFiles(): string[] {
    return this.fileUploadService.getAllFiles();
  }

  @Delete('delete_file') // Route definition
  removeFile(@Query('filename') filename: string) {
    return this.fileUploadService.deleteFile(filename);
  }
}
