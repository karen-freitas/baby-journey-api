import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { RecordEntity } from '../../domain/entity/record';

export class SaveRecordDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;
}

export function mapToRecordEntity(dto: SaveRecordDTO): RecordEntity {
  const entity = new RecordEntity();
  entity.title = dto.title;
  entity.description = dto.description;
  entity.date = dto.date;
  return entity;
}
