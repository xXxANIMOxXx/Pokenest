import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entidades/pokemon.entidad';
import { PokemonServicio } from './pokemon.servicio';
import { PokemonControlador } from './pokemon.controlador';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon])],
  providers: [PokemonServicio],
  controllers: [PokemonControlador],
})
export class PokemonModulo {}
