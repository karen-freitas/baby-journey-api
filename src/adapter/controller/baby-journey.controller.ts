import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../../app.service';
import { MilestoneDTO } from '../dto/milestone.dto';
import { MilestoneEntity } from 'src/domain/entity/milestone';
import { plainToClass } from 'class-transformer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/milestone")
  public async postMilestone(@Body() body: MilestoneDTO): Promise<MilestoneEntity> {
    const entity = plainToClass(MilestoneEntity, body);
    return entity;
  }

  @Post("/memory")
  public async postMemory(@Body() body: MilestoneDTO): Promise<MilestoneEntity> {
    const entity = plainToClass(MilestoneEntity, body);
    return entity;
  }


}
