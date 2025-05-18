import { Delete, Get, Param, Put, UsePipes } from '@nestjs/common';
import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { mapToRecordEntity, SaveRecordDTO } from '../dto/save-record';
import { AuthGuard } from '../guards/auth-guard';
import { BabyJourneyService } from '../../domain/service/baby-journey.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { ValidationPipe } from '../pipe/validation-pipe';
import { BabyJourneyDocument } from 'src/domain/model/baby-journey.model';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly babyJourneyService: BabyJourneyService) {}

  @Post('/milestone')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  public async postMilestone(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({ maxSize: 3000000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File,
    @Body() body: SaveRecordDTO
  ): Promise<BabyJourneyDocument> {
    const entity = mapToRecordEntity(body);
    return this.babyJourneyService.saveMilestone(body.userId, entity, file);
  }

  @Post('/memory')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  public async postMemory(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({ maxSize: 3000000 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File,
    @Body() body: SaveRecordDTO
  ): Promise<BabyJourneyDocument> {
    const entity = mapToRecordEntity(body);
    return this.babyJourneyService.saveMemory(body.userId, entity, file);
  }

  @Delete('/milestone/:milestoneId')
  public async deleteMilestone(
    @Query('user') userId: string,
    @Param('milestoneId') id: string
  ): Promise<BabyJourneyDocument> {
    return this.babyJourneyService.deleteMilestone(userId, id);
  }

  @Delete('/memory/:memoryId')
  public async deleteMemory(
    @Query('user') userId: string,
    @Param('memoryId') id: string
  ): Promise<BabyJourneyDocument> {
    return this.babyJourneyService.deleteMemory(userId, id);
  }

  @Get('file')
  public async downloadFile(
    @Query('filename') filename: string
  ): Promise<string> {
    return this.babyJourneyService.downloadFile(filename);
  }

  @Put('/milestone/:milestoneId')
  @UsePipes(new ValidationPipe())
  async updateMilestone(
    @Param('milestoneId') milestoneId: string,
    @Body() body: SaveRecordDTO
  ): Promise<BabyJourneyDocument> {
    const entity = mapToRecordEntity(body);
    return this.babyJourneyService.updateMilestone(
      body.userId,
      milestoneId,
      entity
    );
  }

  @Put('/memory/:memoryId')
  @UsePipes(new ValidationPipe())
  async updateMemory(
    @Param('memoryId') memoryId: string,
    @Body() body: SaveRecordDTO
  ): Promise<BabyJourneyDocument> {
    const entity = mapToRecordEntity(body);
    return this.babyJourneyService.updateMemory(body.userId, memoryId, entity);
  }
}
