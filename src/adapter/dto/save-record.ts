import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'Date must be in the format DD/MM/YYYY',
  })
  date: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export function mapToRecordEntity(dto: SaveRecordDTO): RecordEntity {
  const entity = new RecordEntity();
  entity.title = dto.title;
  entity.description = dto.description;
  entity.date = dto.date;
  if (dto.image) {
    entity.image = dto.image;
  }
  return entity;
}
