import { Controller, Get, Param, ParseFilePipeBuilder, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { getExtension } from './util/file.util';
import { JwtAuthGuard } from '@app/authlib';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle()
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addMaxSizeValidator({
        maxSize: 300000000
      })
      .addFileTypeValidator({
        fileType: /(xlsx|csv|)$/,
      })
      .build({
        fileIsRequired: true,
      }),
    ) file: Express.Multer.File) {
    const fileType = getExtension(file?.originalname);
    
    if(fileType == "csv"){
      return this.appService.uploadCsv(file);
    }
    
    return this.appService.uploadExcel(file);
  }

  @Get('status/:id')
  importStatus(
    @Param('id') id: string
  ) {
    return this.appService.importStatus(id);
  }
}
