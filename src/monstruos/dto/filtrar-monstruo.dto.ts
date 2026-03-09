import { IsOptional, IsString } from 'class-validator';

export class FiltrarMonstruoDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  species?: string;

  @IsOptional()
  @IsString()
  weakness?: string;
}
