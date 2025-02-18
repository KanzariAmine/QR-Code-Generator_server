import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoxService } from './box.service';

@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Get('get-user')
  async getUserInfo(@Res() res) {
    // await this.boxService.authenticate();
    const user = await this.boxService.getCurrentUser();
    // console.log('🚀 ~ BoxController ~ getUserInfo ~ user:', user);

    res.status(200).json(user);
  }

  @Post('upload/:folderId')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('folderId') folderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.boxService.uploadFile(folderId, file);
  }
}
