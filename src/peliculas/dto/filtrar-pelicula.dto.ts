import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltrarPeliculaDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearTo?: number;
}
