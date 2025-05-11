import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecordEntity } from '../../domain/entity/record';

export class SaveRecordDTO {
  @ApiProperty({ example: 'userId123', description: 'ID do usuário' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'Primeiro Passo', description: 'Título do registro' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Primeiro passo do bebê', description: 'Descrição do registro' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '01/01/2025', description: 'Data do registro no formato DD/MM/YYYY' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'Date must be in the format DD/MM/YYYY',
  })
  date: string;

  @ApiPropertyOptional({ example: 'imagem.jpg', description: 'Nome do arquivo da imagem (opcional)' })
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
