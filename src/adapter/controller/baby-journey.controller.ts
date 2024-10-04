import { Delete, Param } from '@nestjs/common';
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
import { BabyJourneyDocument } from '../schemas/baby-journey.schema';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly babyJourneyService: BabyJourneyService) { }

  @Post('/milestone')
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
  public async deleteMilestone(@Query('user') userId: string, @Param('milestoneId') id: string): Promise<BabyJourneyDocument> {
    return this.babyJourneyService.deleteMilestone(userId, id);
  }

  @Delete('/memory/:memoryId')
  public async deleteMemory(@Query('user') userId: string, @Param('memoryId') id: string): Promise<BabyJourneyDocument> {
    return this.babyJourneyService.deleteMemory(userId, id);
  }

}
