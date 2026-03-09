import { IsInt, IsString, Min } from 'class-validator';

export class CrearPokemonDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsInt()
    @Min(1)
    hp: number;

    @IsInt()
    @Min(1)
    attack: number;

    @IsInt()
    @Min(1)
    defense: number;

    @IsInt()
    @Min(1)
    sp_atk: number;

    @IsInt()
    @Min(1)
    sp_def: number;

    @IsInt()
    @Min(1)
    speed: number;
}
